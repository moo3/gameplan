/**
 * fieldCodec.js
 *
 * Compact encoding of cricket-field state into a single opaque URL-safe string.
 *
 * Binary layout:
 *   Bytes 0–35 (always present, produces 48 base64url chars when alone):
 *     1 bit  – handedness (0 = right, 1 = left)
 *     For each of 11 players:
 *       13 bits – x coordinate (value × 10, range 0-8000)
 *       13 bits – y coordinate (value × 10, range 0-8000)
 *     Total: 1 + 22×13 = 287 bits → 36 bytes
 *
 *   Bytes 36+ (only present when at least one player has a non-default name):
 *     2 bytes – bitmask indicating which players (0-10) have custom names
 *     For each flagged player (in index order):
 *       N bytes – UTF-8 name, null-terminated (0x00)
 *       (last name may omit the trailing null since it's at buffer end)
 *
 * Without names: 48 base64url chars.
 * With names: everything packed into one opaque base64url blob.
 */

const BIT_WIDTH_HANDEDNESS = 1;
const BIT_WIDTH_COORD = 13; // supports 0-8191, we need 0-8000
const PLAYERS_COUNT = 11;
const COORD_SCALE = 10; // multiply float by 10 to preserve 1 decimal place
const COORD_BYTES = 36; // 287 bits → 36 bytes

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
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function fromBase64url(str) {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return buffer;
}

const textEncoder = new TextEncoder();

// ── public API ───────────────────────────────────────────────────────

/**
 * Encode the delimited field string into a compact URL-safe token.
 * Everything — coordinates and names — is packed into a single opaque blob.
 *
 * @param {string} delimited  e.g. "0|392.0,277.6,Dhoni|376.0,544.0|..."
 * @returns {string}          base64url string (48 chars min)
 */
export function encodeField(delimited) {
    const parts = delimited.split('|');
    const handedness = parseInt(parts[0], 10);

    const coordValues = [handedness];
    const bitWidths = [BIT_WIDTH_HANDEDNESS];
    const names = new Map(); // playerIndex → name

    for (let i = 1; i <= PLAYERS_COUNT; i++) {
        const segments = parts[i].split(',');
        const x = Math.round(parseFloat(segments[0]) * COORD_SCALE);
        const y = Math.round(parseFloat(segments[1]) * COORD_SCALE);
        coordValues.push(x, y);
        bitWidths.push(BIT_WIDTH_COORD, BIT_WIDTH_COORD);

        if (segments.length > 2) {
            names.set(i - 1, segments.slice(2).join(','));
        }
    }

    // Pack coordinates into 36 bytes
    const coordBuffer = packBits(coordValues, bitWidths);

    if (names.size === 0) {
        return toBase64url(coordBuffer);
    }

    // Build name bytes: 2-byte bitmask + null-terminated names in index order
    let bitmask = 0;
    for (const index of names.keys()) {
        bitmask |= (1 << index);
    }

    const nameByteArrays = [];
    nameByteArrays.push(bitmask & 0xFF, (bitmask >> 8) & 0xFF);

    const sortedIndices = [...names.keys()].sort((a, b) => a - b);
    for (let n = 0; n < sortedIndices.length; n++) {
        const nameBytes = textEncoder.encode(names.get(sortedIndices[n]));
        nameByteArrays.push(...nameBytes);
        // Add null terminator between names (skip after the last one)
        if (n < sortedIndices.length - 1) {
            nameByteArrays.push(0);
        }
    }

    // Combine coord bytes + name bytes into one buffer
    const combined = new Uint8Array(COORD_BYTES + nameByteArrays.length);
    combined.set(coordBuffer);
    combined.set(nameByteArrays, COORD_BYTES);

    return toBase64url(combined);
}

/**
 * Decode a compact token back into the delimited field string.
 *
 * @param {string} encoded  base64url string (48+ chars)
 * @returns {string}        e.g. "0|392.0,277.6,Dhoni|376.0,544.0|..."
 */
export function decodeField(encoded) {
    const buffer = fromBase64url(encoded);

    // Decode coordinates
    const bitWidths = [
        BIT_WIDTH_HANDEDNESS,
        ...Array(PLAYERS_COUNT * 2).fill(BIT_WIDTH_COORD),
    ];
    const values = unpackBits(buffer, bitWidths);
    const handedness = values[0];

    // Decode names from remaining bytes (if any)
    const nameMap = {};
    if (buffer.length > COORD_BYTES) {
        const bitmask = buffer[COORD_BYTES] | (buffer[COORD_BYTES + 1] << 8);

        // Collect player indices that have names, in order
        const namedIndices = [];
        for (let i = 0; i < PLAYERS_COUNT; i++) {
            if (bitmask & (1 << i)) namedIndices.push(i);
        }

        // Parse null-terminated names from remaining bytes
        let offset = COORD_BYTES + 2;
        for (let n = 0; n < namedIndices.length; n++) {
            // Find null terminator or end of buffer
            let end = offset;
            while (end < buffer.length && buffer[end] !== 0) end++;

            const nameBytes = buffer.slice(offset, end);
            let name = '';
            for (let b = 0; b < nameBytes.length; b++) {
                name += String.fromCharCode(nameBytes[b]);
            }
            nameMap[namedIndices[n]] = name;
            offset = end + 1; // skip past null terminator
        }
    }

    // Reconstruct delimited string
    const pairs = [];
    for (let i = 1; i < values.length; i += 2) {
        const playerIndex = (i - 1) / 2;
        const x = (values[i] / COORD_SCALE).toFixed(1);
        const y = (values[i + 1] / COORD_SCALE).toFixed(1);
        if (nameMap[playerIndex] !== undefined) {
            pairs.push(`${x},${y},${nameMap[playerIndex]}`);
        } else {
            pairs.push(`${x},${y}`);
        }
    }

    return `${handedness}|${pairs.join('|')}`;
}

/**
 * Read the current URL path and, if it contains a valid encoded token,
 * decode it into a structured field state.
 *
 * @returns {{ isLeftHanded: boolean, coords: Array<{ x: number, y: number }>, names: Record<number, string> } | null}
 */
export function parseFieldFromPath() {
    const segment = window.location.pathname.split('/').filter(Boolean)[0];
    if (!segment) return null;

    try {
        const delimited = decodeField(segment);
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
        return { coords, isLeftHanded, names };
    } catch {
        return null;
    }
}
