/**
 * Generates a timestamped filename in the format: gameplan-DDMMM-HHMM.png
 */
function generateFilename() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dd = String(now.getDate()).padStart(2, '0');
    const mmm = months[now.getMonth()];
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `gameplan-${dd}${mmm}-${hh}${mm}.png`;
}

/**
 * Downloads the Konva stage as a high-res PNG image.
 *
 * @param {object} stageRef - React ref to the Konva Stage
 * @param {string} [filename] - Download filename (defaults to gameplan-DDMMM-HHMM.png)
 */
export function downloadStageImage(stageRef, filename) {
    filename = filename || generateFilename();
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
