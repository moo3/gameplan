import { describe, expect, it } from 'vitest';

import { decodeField, encodeField } from './fieldCodec';

// The default field positions serialized to the delimited format
const DEFAULT_INPUT =
    '0|392.0,277.6|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';

const LEFT_HANDED_INPUT =
    '1|392.0,277.6|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';

const INPUT_WITH_NAMES =
    '0|392.0,277.6,Dhoni|376.0,544.0|372.8,266.4|200.0,120.0,Kohli|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0,Bumrah|480.0,56.0';

describe('fieldCodec', () => {
    // ── encodeField ────────────────────────────────────────────────

    describe('encodeField', () => {
        it('produces a 48-character string for 11 players with no names', () => {
            expect(encodeField(DEFAULT_INPUT)).toHaveLength(48);
        });

        it('output is fully URL-safe (base64url alphabet only)', () => {
            const encoded = encodeField(DEFAULT_INPUT);
            expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
        });

        it('output with names is also fully URL-safe', () => {
            const encoded = encodeField(INPUT_WITH_NAMES);
            expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
        });

        it('different handedness produces a different token', () => {
            const a = encodeField(DEFAULT_INPUT);
            const b = encodeField(LEFT_HANDED_INPUT);
            expect(a).not.toBe(b);
        });

        it('with names produces a longer but fully opaque token', () => {
            const encoded = encodeField(INPUT_WITH_NAMES);
            expect(encoded.length).toBeGreaterThan(48);
            // Names should NOT be visible as plaintext in the token
            expect(encoded).not.toContain('Dhoni');
            expect(encoded).not.toContain('Kohli');
            expect(encoded).not.toContain('Bumrah');
        });
    });

    // ── decodeField ────────────────────────────────────────────────

    describe('decodeField', () => {
        it('is the inverse of encodeField (lossless roundtrip)', () => {
            const encoded = encodeField(DEFAULT_INPUT);
            expect(decodeField(encoded)).toBe(DEFAULT_INPUT);
        });

        it('roundtrips left-handed flag correctly', () => {
            const encoded = encodeField(LEFT_HANDED_INPUT);
            expect(decodeField(encoded)).toBe(LEFT_HANDED_INPUT);
        });

        it('roundtrips player names correctly', () => {
            const encoded = encodeField(INPUT_WITH_NAMES);
            expect(decodeField(encoded)).toBe(INPUT_WITH_NAMES);
        });

        it('handles edge-value coordinates (0.0, 800.0)', () => {
            const edgeInput =
                '0|0.0,0.0|800.0,800.0|400.0,400.0|0.0,800.0|800.0,0.0|100.0,200.0|300.0,400.0|500.0,600.0|700.0,100.0|50.0,750.0|600.0,300.0';
            const encoded = encodeField(edgeInput);
            expect(decodeField(encoded)).toBe(edgeInput);
        });

        it('handles sub-pixel precision (e.g. 123.4, 567.8)', () => {
            const precisionInput =
                '0|123.4,567.8|0.1,799.9|400.5,200.3|111.1,222.2|333.3,444.4|555.5,666.6|777.7,100.0|200.0,300.0|400.0,500.0|600.0,700.0|12.3,45.6';
            const encoded = encodeField(precisionInput);
            expect(decodeField(encoded)).toBe(precisionInput);
        });

        it('handles a single player with a name', () => {
            const input =
                '0|392.0,277.6,WicketKeeper|376.0,544.0|372.8,266.4|200.0,120.0|240.0,328.0|280.0,424.0|256.0,520.0|480.0,592.0|560.0,480.0|568.0,328.0|480.0,56.0';
            const encoded = encodeField(input);
            expect(decodeField(encoded)).toBe(input);
        });

        it('handles all players with names', () => {
            const input =
                '0|392.0,277.6,Alice|376.0,544.0,Bob|372.8,266.4,Charlie|200.0,120.0,Dave|240.0,328.0,Eve|280.0,424.0,Frank|256.0,520.0,Grace|480.0,592.0,Heidi|560.0,480.0,Ivan|568.0,328.0,Judy|480.0,56.0,Karl';
            const encoded = encodeField(input);
            expect(decodeField(encoded)).toBe(input);
        });
    });

    // ── determinism ────────────────────────────────────────────────

    describe('determinism', () => {
        it('same input always produces the same output', () => {
            const a = encodeField(DEFAULT_INPUT);
            const b = encodeField(DEFAULT_INPUT);
            expect(a).toBe(b);
        });

        it('known encoded value matches expected token (no names)', () => {
            expect(encodeField(DEFAULT_INPUT)).toBe(
                'PUFbDrCqA6QU0H0CWCWBmgrwhIKAKKEsC5BXglgWMGaEsARg'
            );
        });

        it('same input with names always produces the same output', () => {
            const a = encodeField(INPUT_WITH_NAMES);
            const b = encodeField(INPUT_WITH_NAMES);
            expect(a).toBe(b);
        });
    });
});
