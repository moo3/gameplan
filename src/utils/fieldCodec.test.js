import { describe, expect, it } from 'vitest';

import { decodeField, encodeField } from './fieldCodec';

// The default field positions serialized to the delimited format
const DEFAULT_INPUT =
    '0|392.0,277.6|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';

const LEFT_HANDED_INPUT =
    '1|392.0,277.6|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';

const INPUT_WITH_NAMES =
    '0|392.0,277.6,Dhoni|376.0,544.0|372.8,266.4|200.0,120.0,Kohli|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0,Bumrah|480.0,56.0';

// Default flags used when encoding
const DEFAULT_FLAGS = { showPositions: true, showBoundaryCoverage: true, showCatchCoverage: false };

describe('fieldCodec', () => {
    // ── encodeField ────────────────────────────────────────────────

    describe('encodeField', () => {
        it('produces a 50-character string for 11 players with no names', () => {
            expect(encodeField(DEFAULT_INPUT, DEFAULT_FLAGS)).toHaveLength(50);
        });

        it('output is fully URL-safe (base64url alphabet only)', () => {
            const encoded = encodeField(DEFAULT_INPUT, DEFAULT_FLAGS);
            expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
        });

        it('output with names is also fully URL-safe', () => {
            const encoded = encodeField(INPUT_WITH_NAMES, DEFAULT_FLAGS);
            expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
        });

        it('different handedness produces a different token', () => {
            const a = encodeField(DEFAULT_INPUT, DEFAULT_FLAGS);
            const b = encodeField(LEFT_HANDED_INPUT, DEFAULT_FLAGS);
            expect(a).not.toBe(b);
        });

        it('with names produces a longer but fully opaque token', () => {
            const encoded = encodeField(INPUT_WITH_NAMES, DEFAULT_FLAGS);
            expect(encoded.length).toBeGreaterThan(50);
            expect(encoded).not.toContain('Dhoni');
            expect(encoded).not.toContain('dhoni');
            expect(encoded).not.toContain('Kohli');
            expect(encoded).not.toContain('Bumrah');
        });
    });

    // ── decodeField ────────────────────────────────────────────────

    describe('decodeField', () => {
        it('is the inverse of encodeField (lossless roundtrip for coords)', () => {
            const encoded = encodeField(DEFAULT_INPUT, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toBe(DEFAULT_INPUT);
        });

        it('roundtrips left-handed flag correctly', () => {
            const encoded = encodeField(LEFT_HANDED_INPUT, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toBe(LEFT_HANDED_INPUT);
        });

        it('roundtrips player names with smart casing', () => {
            const encoded = encodeField(INPUT_WITH_NAMES, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toContain('Dhoni');
            expect(delimited).toContain('Kohli');
            expect(delimited).toContain('Bumrah');
        });

        it('normalizes case on roundtrip (lowercase input → Title Case output)', () => {
            const lowerInput =
                '0|392.0,277.6,dhoni|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';
            const encoded = encodeField(lowerInput, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toContain('Dhoni');
        });

        it('uses UPPERCASE for names ≤ 2 characters', () => {
            const input =
                '0|392.0,277.6,MS|376.0,544.0,AB|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';
            const encoded = encodeField(input, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toContain('MS');
            expect(delimited).toContain('AB');
        });

        it('handles edge-value coordinates (0.0, 800.0)', () => {
            const edgeInput =
                '0|0.0,0.0|800.0,800.0|400.0,400.0|0.0,800.0|800.0,0.0|100.0,200.0|300.0,400.0|500.0,600.0|700.0,100.0|50.0,750.0|600.0,300.0';
            const encoded = encodeField(edgeInput, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toBe(edgeInput);
        });

        it('handles sub-pixel precision (e.g. 123.4, 567.8)', () => {
            const precisionInput =
                '0|123.4,567.8|0.1,799.9|400.5,200.3|111.1,222.2|333.3,444.4|555.5,666.6|777.7,100.0|200.0,300.0|400.0,500.0|600.0,700.0|12.3,45.6';
            const encoded = encodeField(precisionInput, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toBe(precisionInput);
        });

        it('handles a single player with a name', () => {
            const input =
                '0|392.0,277.6,Jadeja|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';
            const encoded = encodeField(input, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toContain('Jadeja');
        });

        it('truncates names longer than 10 characters', () => {
            const input =
                '0|392.0,277.6,Wicketkeeper|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';
            const encoded = encodeField(input, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toContain('Wicketkeep');
            expect(delimited).not.toContain('Wicketkeeper');
        });

        it('handles all players with names', () => {
            const input =
                '0|392.0,277.6,Alice|376.0,544.0,Bob|372.8,266.4,Charlie|200.0,120.0,Dave|240.0,328.0,Eve|280.0,424.0,Frank|256.0,520.0,Grace|480.0,592.0,Heidi|560.0,480.0,Ivan|568.0,328.0,Judy|480.0,56.0,Karl';
            const encoded = encodeField(input, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toContain('Alice');
            expect(delimited).toContain('Bob');
            expect(delimited).toContain('Charlie');
            expect(delimited).toContain('Karl');
            expect(delimited).toContain('392.0,277.6');
            expect(delimited).toContain('480.0,56.0');
        });

        it('handles names with spaces', () => {
            const input =
                '0|392.0,277.6,Ms Dhoni|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';
            const encoded = encodeField(input, DEFAULT_FLAGS);
            const { delimited } = decodeField(encoded);
            expect(delimited).toContain('Ms Dhoni');
        });
    });

    // ── flags ──────────────────────────────────────────────────────

    describe('flags', () => {
        it('roundtrips all flags correctly', () => {
            const flags = {
                showPositions: true,
                showBoundaryCoverage: false,
                showCatchCoverage: true,
            };
            const encoded = encodeField(DEFAULT_INPUT, flags);
            const { flags: decoded } = decodeField(encoded);
            expect(decoded).toEqual(flags);
        });

        it('defaults flags to false when not provided', () => {
            const encoded = encodeField(DEFAULT_INPUT);
            const { flags } = decodeField(encoded);
            expect(flags).toEqual({
                showPositions: false,
                showBoundaryCoverage: false,
                showCatchCoverage: false,
            });
        });

        it('different flag values produce different tokens', () => {
            const a = encodeField(DEFAULT_INPUT, {
                showPositions: true,
                showBoundaryCoverage: true,
                showCatchCoverage: false,
            });
            const b = encodeField(DEFAULT_INPUT, {
                showPositions: false,
                showBoundaryCoverage: false,
                showCatchCoverage: true,
            });
            expect(a).not.toBe(b);
        });
    });

    // ── determinism ────────────────────────────────────────────────

    describe('determinism', () => {
        it('same input always produces the same output', () => {
            const a = encodeField(DEFAULT_INPUT, DEFAULT_FLAGS);
            const b = encodeField(DEFAULT_INPUT, DEFAULT_FLAGS);
            expect(a).toBe(b);
        });

        it('same input with names always produces the same output', () => {
            const a = encodeField(INPUT_WITH_NAMES, DEFAULT_FLAGS);
            const b = encodeField(INPUT_WITH_NAMES, DEFAULT_FLAGS);
            expect(a).toBe(b);
        });
    });

    // ── size comparison ────────────────────────────────────────────

    describe('compression efficiency', () => {
        it('11 names produces a token shorter than 115 chars', () => {
            const input =
                '0|392.0,277.6,Alice|376.0,544.0,Bob|372.8,266.4,Charlie|200.0,120.0,Dave|240.0,328.0,Eve|280.0,424.0,Frank|256.0,520.0,Grace|480.0,592.0,Heidi|560.0,480.0,Ivan|568.0,328.0,Judy|480.0,56.0,Karl';
            const encoded = encodeField(input, DEFAULT_FLAGS);
            console.log(`11-name token length: ${encoded.length}`);
            expect(encoded.length).toBeLessThan(115);
        });
    });
});
