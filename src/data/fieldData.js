// Initial fielder positions (normalized 0–1 relative to field width/height)
export const initialFielderPositions = [
    [0.49, 0.347],   // WK
    [0.47, 0.68],    // Bowler
    [0.466, 0.333],  // Fielder 3
    [0.25, 0.15],    // Fielder 4
    [0.3, 0.41],     // Fielder 5
    [0.35, 0.53],    // Fielder 6
    [0.32, 0.65],    // Fielder 7
    [0.6, 0.74],     // Fielder 8
    [0.7, 0.6],      // Fielder 9
    [0.71, 0.41],    // Fielder 10
    [0.6, 0.07],     // Fielder 11
];

// All cricket fielding positions (name and vector coordinates)
export const fieldPositions = [
    { name: '1st slip', vector: [0.476, 0.347] },
    { name: '2nd slip', vector: [0.461, 0.35] },
    { name: '3rd slip', vector: [0.443, 0.365] },
    { name: '4th slip', vector: [0.426, 0.374] },
    { name: '5th slip', vector: [0.411, 0.38] },
    { name: '6th slip', vector: [0.398, 0.388] },
    { name: 'fly slip', vector: [0.388, 0.307] },
    { name: 'gully', vector: [0.34, 0.387] },
    { name: 'backward point', vector: [0.294, 0.386] },
    { name: 'point', vector: [0.292, 0.428] },
    { name: 'silly point', vector: [0.44, 0.428] },
    { name: 'forward point', vector: [0.29, 0.46] },
    { name: 'cover point', vector: [0.29, 0.518] },
    { name: 'cover', vector: [0.29, 0.576] },
    { name: 'short cover', vector: [0.371, 0.517] },
    { name: 'extra cover', vector: [0.284, 0.675] },
    { name: 'mid-off', vector: [0.397, 0.68] },
    { name: 'deep mid-off', vector: [0.383, 0.774] },
    { name: 'short mid-off', vector: [0.42, 0.553] },
    { name: 'silly mid-off', vector: [0.45, 0.472] },
    { name: 'mid-on', vector: [0.576, 0.681] },
    { name: 'deep mid-on', vector: [0.603, 0.771] },
    { name: 'short mid-on', vector: [0.567, 0.554] },
    { name: 'silly mid-on', vector: [0.533, 0.475] },
    { name: 'short mid-wicket', vector: [0.6, 0.502] },
    { name: 'mid-wicket', vector: [0.723, 0.577] },
    { name: 'short leg', vector: [0.54, 0.426] },
    { name: 'square leg', vector: [0.722, 0.426] },
    { name: 'forward\nsquare leg', vector: [0.722, 0.467] },
    { name: 'backward\nsquare leg', vector: [0.722, 0.384] },
    { name: 'leg slip', vector: [0.512, 0.347] },
    { name: 'leg gully', vector: [0.632, 0.38] },
    { name: 'backward\nshort leg', vector: [0.625, 0.295] },
    { name: 'fine leg', vector: [0.705, 0.186] },
    { name: 'short\nfine leg', vector: [0.666, 0.218] },
    { name: 'deep\nfine leg', vector: [0.791, 0.13] },
    { name: 'long leg', vector: [0.67, 0.05] },
    { name: 'square\nfine leg', vector: [0.842, 0.35] },
    { name: 'straight\nfine leg', vector: [0.587, 0.093] },
    { name: 'long stop', vector: [0.488, 0.013] },
    { name: 'third man', vector: [0.306, 0.166] },
    { name: 'short\nthird man', vector: [0.331, 0.203] },
    { name: 'deep\nthird man', vector: [0.229, 0.097] },
    { name: 'fine\nthird man', vector: [0.349, 0.073] },
    { name: 'square\nthird man', vector: [0.191, 0.198] },
    { name: 'deep backward\npoint', vector: [0.07, 0.307] },
    { name: 'deep point', vector: [0.036, 0.427] },
    { name: 'deep\ncover point', vector: [0.036, 0.547] },
    { name: 'deep cover', vector: [0.066, 0.669] },
    { name: 'sweeper cover', vector: [0.138, 0.797] },
    { name: 'wide\nlong off', vector: [0.229, 0.891] },
    { name: 'long off', vector: [0.306, 0.933] },
    { name: 'straight\nlong off', vector: [0.405, 0.96] },
    { name: 'straight hit', vector: [0.495, 0.97] },
    { name: 'straight\nlong on', vector: [0.585, 0.96] },
    { name: 'long on', vector: [0.677, 0.933] },
    { name: 'wide\nlong on', vector: [0.756, 0.889] },
    { name: 'deep forward\nmid-wicket', vector: [0.858, 0.783] },
    { name: 'deep\nmid-wicket', vector: [0.922, 0.658] },
    { name: 'deep forward\nsquare leg', vector: [0.948, 0.516] },
    { name: 'deep\nsquare leg', vector: [0.944, 0.429] },
    { name: 'deep backward\nsquare leg', vector: [0.921, 0.33] },
];

