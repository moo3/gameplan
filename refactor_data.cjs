const fs = require('fs');
const file = 'src/data/fieldData.js';
let content = fs.readFileSync(file, 'utf8');

let cleanContent = content.replace(/export const/g, 'const');
eval(cleanContent);

let newPositionsStr = 'export const fieldPositions = [\n';
for (let i = 0; i < positionNames.length; i++) {
    newPositionsStr += `    { name: '${positionNames[i].replace(/\n/g, '\\n')}', vector: [${positionCoordinates[i][0]}, ${positionCoordinates[i][1]}] },\n`;
}
newPositionsStr += '];\n';

let finalContent = `// Initial fielder positions (normalized 0–1 relative to field width/height)
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
${newPositionsStr}
`;

fs.writeFileSync(file, finalContent);
console.log("Written merged data to " + file);
