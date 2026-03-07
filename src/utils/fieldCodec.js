/**
 * fieldCodec.js
 *
 * Compact encoding of cricket-field state into a single opaque URL-safe string.
 *
 * Binary layout:
 *   Bytes 0–36 (always present, produces 50 base64url chars when alone):
 *     1 bit  – handedness (0 = right, 1 = left)
 *     1 bit  – showPositions flag
 *     1 bit  – showBoundaryCoverage flag
 *     1 bit  – showCatchCoverage flag
 *     For each of 11 players:
 *       13 bits – x coordinate (value × 10, range 0-8000)
 *       13 bits – y coordinate (value × 10, range 0-8000)
 *     Total: 4 + 22×13 = 290 bits → 37 bytes
 *
 *   Bytes 37+ (only present when at least one player has a non-default name):
 *     2 bytes – bitmask indicating which players (0-10) have custom names
 *     1 byte  – total count of 5-bit characters in the name stream
 *     Remaining bytes – 5-bit packed name characters:
 *       0-25 = a-z, 26 = space, 27 = separator between names
 *       Names are stored lowercase; decoded with smart casing
 *       (≤2 chars → UPPERCASE, otherwise → Title Case).
 *       Max 10 characters per name.
 *
 * Without names: 50 base64url chars.
 * With names: everything packed into one opaque base64url blob.
 */

const BIT_WIDTH_FLAG = 1;
const BIT_WIDTH_COORD = 13; // supports 0-8191, we need 0-8000
const BIT_WIDTH_NAME_CHAR = 5; // 5-bit alphabet for name characters
const PLAYERS_COUNT = 11;
const NUM_FLAGS = 4; // handedness + showPositions + showBoundaryCoverage + showCatchCoverage
const COORD_SCALE = 10; // multiply float by 10 to preserve 1 decimal place
const HEADER_BITS = NUM_FLAGS * BIT_WIDTH_FLAG + PLAYERS_COUNT * 2 * BIT_WIDTH_COORD; // 4 + 286 = 290
const COORD_BYTES = Math.ceil(HEADER_BITS / 8); // 37 bytes
const MAX_NAME_LENGTH = 10; // max characters per player name
const NAME_SEPARATOR = 27; // 5-bit code for name separator
const NAME_SPACE = 26; // 5-bit code for space character

// ── helpers ──────────────────────────────────────────────────────────

function packBits(values, bitWidths) {
    const totalBits = bitWidths.reduce((a, b) => a + b, 0);
    const buffer = new Uint8Array(Math.ceil(totalBits / 8));

    let bitPos = 0;
    for (let i = 0; i < values.length; i++) {
        let val = values[i];
        const width = bitWidths[i];
        for (let b = width - 1; b >= 0; b--) {
            if ((val >> b) & 1) {
                buffer[bitPos >> 3] |= 1 << (7 - (bitPos & 7));
            }
            bitPos++;
        }
    }

    return buffer;
}

function unpackBits(buffer, bitWidths) {
    const values = [];
    let bitPos = 0;

    for (const width of bitWidths) {
        let val = 0;
        for (let b = width - 1; b >= 0; b--) {
            if ((buffer[bitPos >> 3] >> (7 - (bitPos & 7))) & 1) {
                val |= 1 << b;
            }
            bitPos++;
        }
        values.push(val);
    }

    return values;
}

function toBase64url(buffer) {
    let binary = '';
    for (const byte of buffer) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(str) {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return buffer;
}

/** Convert a character to its 5-bit code. Unsupported chars become space. */
function charTo5bit(ch) {
    if (ch === ' ') return NAME_SPACE;
    const code = ch.charCodeAt(0);
    if (code >= 97 && code <= 122) return code - 97; // a-z
    if (code >= 65 && code <= 90) return code - 65; // A-Z → lowercase
    return NAME_SPACE;
}

/** Convert a 5-bit code back to a character. */
function fiveBitToChar(code) {
    if (code === NAME_SPACE) return ' ';
    if (code >= 0 && code <= 25) return String.fromCharCode(97 + code); // a-z
    return ' ';
}

/** Smart case: ≤2 chars → UPPERCASE, otherwise → Title Case. */
function smartCase(name) {
    if (name.length <= 2) return name.toUpperCase();
    return name.replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
}

// ── public API ───────────────────────────────────────────────────────

/**
 * Encode the delimited field string + flags into a compact URL-safe token.
 *
 * @param {string} delimited  e.g. "0|392.0,277.6,Dhoni|376.0,544.0|..."
 * @param {object} [flags]    { showPositions, showBoundaryCoverage, showCatchCoverage }
 * @returns {string}          base64url string (50 chars min)
 */
export function encodeField(delimited, flags = {}) {
    const parts = delimited.split('|');
    const handedness = parseInt(parts[0], 10);

    const headerValues = [
        handedness,
        flags.showPositions ? 1 : 0,
        flags.showBoundaryCoverage ? 1 : 0,
        flags.showCatchCoverage ? 1 : 0,
    ];
    const bitWidths = Array(NUM_FLAGS).fill(BIT_WIDTH_FLAG);

    const names = new Map(); // playerIndex → name

    for (let i = 1; i <= PLAYERS_COUNT; i++) {
        const segments = parts[i].split(',');
        const x = Math.round(parseFloat(segments[0]) * COORD_SCALE);
        const y = Math.round(parseFloat(segments[1]) * COORD_SCALE);
        headerValues.push(x, y);
        bitWidths.push(BIT_WIDTH_COORD, BIT_WIDTH_COORD);

        if (segments.length > 2) {
            names.set(i - 1, segments.slice(2).join(','));
        }
    }

    // Pack header (flags + coordinates) into COORD_BYTES
    const coordBuffer = packBits(headerValues, bitWidths);

    if (names.size === 0) {
        return toBase64url(coordBuffer);
    }

    // Build bitmask
    let bitmask = 0;
    for (const index of names.keys()) {
        bitmask |= 1 << index;
    }

    // Build 5-bit packed name stream
    const nameValues = [];
    const nameBitWidths = [];
    const sortedIndices = [...names.keys()].sort((a, b) => a - b);

    for (let n = 0; n < sortedIndices.length; n++) {
        const name = names.get(sortedIndices[n]).toLowerCase().slice(0, MAX_NAME_LENGTH);
        for (const ch of name) {
            nameValues.push(charTo5bit(ch));
            nameBitWidths.push(BIT_WIDTH_NAME_CHAR);
        }
        if (n < sortedIndices.length - 1) {
            nameValues.push(NAME_SEPARATOR);
            nameBitWidths.push(BIT_WIDTH_NAME_CHAR);
        }
    }

    const nameBuffer = packBits(nameValues, nameBitWidths);

    // Combine: header bytes + 2-byte bitmask + 1-byte char count + name bytes
    const totalChars = nameValues.length;
    const combined = new Uint8Array(COORD_BYTES + 3 + nameBuffer.length);
    combined.set(coordBuffer);
    combined[COORD_BYTES] = bitmask & 0xff;
    combined[COORD_BYTES + 1] = (bitmask >> 8) & 0xff;
    combined[COORD_BYTES + 2] = totalChars;
    combined.set(nameBuffer, COORD_BYTES + 3);

    return toBase64url(combined);
}

/**
 * Decode a compact token back into the delimited field string + flags.
 *
 * @param {string} encoded  base64url string (50+ chars)
 * @returns {{ delimited: string, flags: object }}
 */
export function decodeField(encoded) {
    const buffer = fromBase64url(encoded);

    // Decode header: flags + coordinates
    const headerBitWidths = [
        ...Array(NUM_FLAGS).fill(BIT_WIDTH_FLAG),
        ...Array(PLAYERS_COUNT * 2).fill(BIT_WIDTH_COORD),
    ];
    const values = unpackBits(buffer, headerBitWidths);

    const handedness = values[0];
    const flags = {
        showPositions: values[1] === 1,
        showBoundaryCoverage: values[2] === 1,
        showCatchCoverage: values[3] === 1,
    };

    // Decode names from remaining bytes (if any)
    const nameMap = {};
    if (buffer.length > COORD_BYTES) {
        const bitmask = buffer[COORD_BYTES] | (buffer[COORD_BYTES + 1] << 8);

        const namedIndices = [];
        for (let i = 0; i < PLAYERS_COUNT; i++) {
            if (bitmask & (1 << i)) namedIndices.push(i);
        }

        const totalChars = buffer[COORD_BYTES + 2];
        const nameBytes = buffer.slice(COORD_BYTES + 3);
        const charWidths = Array(totalChars).fill(BIT_WIDTH_NAME_CHAR);
        const charValues = unpackBits(nameBytes, charWidths);

        const nameStrings = [];
        let current = '';
        for (const code of charValues) {
            if (code === NAME_SEPARATOR) {
                nameStrings.push(current);
                current = '';
            } else {
                current += fiveBitToChar(code);
            }
        }
        nameStrings.push(current);

        for (let n = 0; n < namedIndices.length && n < nameStrings.length; n++) {
            const trimmed = nameStrings[n].trimEnd();
            if (trimmed) {
                nameMap[namedIndices[n]] = smartCase(trimmed);
            }
        }
    }

    // Reconstruct delimited string
    const pairs = [];
    for (let i = NUM_FLAGS; i < values.length; i += 2) {
        const playerIndex = (i - NUM_FLAGS) / 2;
        const x = (values[i] / COORD_SCALE).toFixed(1);
        const y = (values[i + 1] / COORD_SCALE).toFixed(1);
        if (nameMap[playerIndex] !== undefined) {
            pairs.push(`${x},${y},${nameMap[playerIndex]}`);
        } else {
            pairs.push(`${x},${y}`);
        }
    }

    const delimited = `${handedness}|${pairs.join('|')}`;
    return { delimited, flags };
}

/**
 * Read the current URL path and, if it contains a valid encoded token,
 * decode it into a structured field state.
 *
 * @returns {{ isLeftHanded: boolean, coords: Array<{ x: number, y: number }>, names: Record<number, string>, flags: object } | null}
 */
export function parseFieldFromPath() {
    const segment = window.location.pathname.split('/').filter(Boolean)[0];
    if (!segment) return null;

    try {
        const { delimited, flags } = decodeField(segment);
        const parts = delimited.split('|');
        const isLeftHanded = parts[0] === '1';
        const coords = [];
        const names = {};
        for (let i = 1; i < parts.length; i++) {
            const segments = parts[i].split(',');
            coords.push({ x: parseFloat(segments[0]), y: parseFloat(segments[1]) });
            if (segments.length > 2) {
                names[i - 1] = segments.slice(2).join(',');
            }
        }
        return { coords, flags, isLeftHanded, names };
    } catch {
        return null;
    }
}
