// Initial fielder positions (normalized 0–1 relative to field width/height)
export const initialFielderPositions = [
    [0.49, 0.347], // WK
    [0.47, 0.68], // Bowler
    [0.466, 0.333], // Fielder 3
    [0.25, 0.15], // Fielder 4
    [0.3, 0.41], // Fielder 5
    [0.35, 0.53], // Fielder 6
    [0.32, 0.65], // Fielder 7
    [0.6, 0.74], // Fielder 8
    [0.7, 0.6], // Fielder 9
    [0.71, 0.41], // Fielder 10
    [0.6, 0.07], // Fielder 11
];

// All cricket fielding positions (name and vector coordinates)
export const fieldPositions = {
    '1s': { vector: [0.476, 0.347], displayName: '1st slip' },
    '2s': { vector: [0.461, 0.35], displayName: '2nd slip' },
    '3s': { vector: [0.443, 0.365], displayName: '3rd slip' },
    '4s': { vector: [0.426, 0.374], displayName: '4th slip' },
    '5s': { vector: [0.411, 0.38], displayName: '5th slip' },
    '6s': { vector: [0.398, 0.388], displayName: '6th slip' },
    'bp': { vector: [0.294, 0.386], displayName: 'backward\npoint' },
    'bsleg': { vector: [0.625, 0.295], displayName: 'backward\nshort leg' },
    'bsqleg': { vector: [0.722, 0.384], displayName: 'backward\nsquare leg' },
    'c': { vector: [0.29, 0.576], displayName: 'cover' },
    'cp': { vector: [0.29, 0.518], displayName: 'cover\npoint' },
    'd3man': { vector: [0.229, 0.097], displayName: 'deep third man' },
    'dbp': { vector: [0.07, 0.307], displayName: 'deep backward point' },
    'dbwsqleg': { vector: [0.921, 0.33], displayName: 'deep backward\nsquare leg' },
    'dc': { vector: [0.066, 0.669], displayName: 'deep cover' },
    'dcp': { vector: [0.036, 0.547], displayName: 'deep cover point' },
    'dfineleg': { vector: [0.791, 0.13], displayName: 'deep\nfine leg' },
    'dfmw': { vector: [0.858, 0.783], displayName: 'deep forward\nmid-wicket' },
    'dfsqleg': { vector: [0.948, 0.516], displayName: 'deep forward\nsquare leg' },
    'dmon': { vector: [0.603, 0.771], displayName: 'deep mid-on' },
    'dmoff': { vector: [0.383, 0.774], displayName: 'deep mid-off' },
    'dmw': { vector: [0.922, 0.658], displayName: 'deep mid-wicket' },
    'dp': { vector: [0.036, 0.427], displayName: 'deep point' },
    'dsqleg': { vector: [0.944, 0.429], displayName: 'deep\nsquare leg' },
    'ec': { vector: [0.284, 0.675], displayName: 'extra cover' },
    'f3man': { vector: [0.349, 0.073], displayName: 'fine third man' },
    'fl': { vector: [0.705, 0.186], displayName: 'fine leg' },
    'fp': { vector: [0.29, 0.46], displayName: 'forward point' },
    'fs': { vector: [0.388, 0.307], displayName: 'fly slip' },
    'fsqleg': { vector: [0.722, 0.467], displayName: 'forward\nsquare leg' },
    'g': { vector: [0.34, 0.387], displayName: 'gully' },
    'lg': { vector: [0.632, 0.38], displayName: 'leg gully' },
    'lleg': { vector: [0.67, 0.05], displayName: 'long leg' },
    'loff': { vector: [0.306, 0.933], displayName: 'long off' },
    'lon': { vector: [0.677, 0.933], displayName: 'long on' },
    'ls': { vector: [0.512, 0.347], displayName: 'leg slip' },
    'lstop': { vector: [0.488, 0.013], displayName: 'long stop' },
    'mo': { vector: [0.397, 0.68], displayName: 'mid-off' },
    'mon': { vector: [0.576, 0.681], displayName: 'mid-on' },
    'mw': { vector: [0.723, 0.577], displayName: 'mid-wicket' },
    'p': { vector: [0.292, 0.428], displayName: 'point' },
    'sc': { vector: [0.371, 0.517], displayName: 'short cover' },
    'sfleg': { vector: [0.666, 0.218], displayName: 'short fine leg' },
    'sh': { vector: [0.495, 0.97], displayName: 'straight hit' },
    'sl': { vector: [0.54, 0.426], displayName: 'short leg' },
    'sloff': { vector: [0.405, 0.96], displayName: 'straight long off' },
    'slon': { vector: [0.585, 0.96], displayName: 'straight long on' },
    'smon': { vector: [0.567, 0.554], displayName: 'short mid-on' },
    'smoff': { vector: [0.42, 0.553], displayName: 'short mid-off' },
    'smw': { vector: [0.6, 0.502], displayName: 'short mid-wicket' },
    'sp': { vector: [0.44, 0.428], displayName: 'silly point' },
    'sq3man': { vector: [0.191, 0.198], displayName: 'square third man' },
    'sqfleg': { vector: [0.842, 0.35], displayName: 'square fine leg' },
    'sqleg': { vector: [0.722, 0.426], displayName: 'square leg' },
    'stfleg': { vector: [0.587, 0.093], displayName: 'straight\nfine leg' },
    'sttm': { vector: [0.331, 0.203], displayName: 'short third man' },
    'swc': { vector: [0.138, 0.797], displayName: 'sweeper cover' },
    'symoff': { vector: [0.45, 0.472], displayName: 'silly mid-off' },
    'symon': { vector: [0.533, 0.475], displayName: 'silly mid-on' },
    'tm': { vector: [0.306, 0.166], displayName: 'third man' },
    'wloff': { vector: [0.229, 0.891], displayName: 'wide long off' },
    'wlon': { vector: [0.756, 0.889], displayName: 'wide long on' },
};

export const fieldPositionNames = Object.values(fieldPositions).map((p) => p.displayName);
export const fieldPositionVectors = Object.values(fieldPositions).map((p) => p.vector);

