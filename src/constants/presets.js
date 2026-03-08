export const BUILT_IN_PRESETS = [
    {
        id: 't20-powerplay-pace-aggressive',
        name: 'Powerplay - Pace (Aggressive)',
        category: 'Powerplay (Overs 1-6)',
        description: 'Attacking field for a fast bowler in the powerplay. Two slips and a gully.',
        format: 'T20',
        players: [
            '1s',
            '2s',
            'g',
            'mo',
            'mon',
            'mw',
            'sqleg',
            'fl',
            'tm'
        ]
    },
    {
        id: 't20-death-overs-pace-defensive',
        name: 'Death Overs - Pace (Defensive)',
        category: 'Death Overs (Overs 16-20)',
        description: 'Defensive field protecting the boundaries. Men back on the leg side and off side.',
        format: 'T20',
        players: [
            'dp',
            'ec',
            'loff',
            'lon',
            'dmw',
            'dsqleg',
            'sttm',
            'bp',
            'sfleg'
        ]
    },
    {
        id: 't20-middle-overs-spin',
        name: 'Middle Overs - Spin (Balanced)',
        category: 'Middle Overs (Overs 7-15)',
        description: 'Balanced field for a spinner. Protecting the boundaries while keeping catching options.',
        format: 'T20',
        players: [
            '1s',
            'sfleg',
            'dmw',
            'lon',
            'loff',
            'dc',
            'p',
            'c',
            'smw'
        ]
    },
    {
        id: 't20-powerplay-spin',
        name: 'Powerplay - Spin (Attacking)',
        category: 'Powerplay (Overs 1-6)',
        description: 'Attacking field for a spinner in the powerplay. Slip and short leg in place.',
        format: 'T20',
        players: [
            '1s',
            'sl',
            'p',
            'c',
            'mo',
            'mon',
            'mw',
            'sqleg',
            'sfleg'
        ]
    }
];
