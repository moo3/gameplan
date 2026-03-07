/**
 * Downloads the Konva stage as a high-res PNG image.
 *
 * @param {object} stageRef - React ref to the Konva Stage
 * @param {string} [filename='gameplan-placement.png'] - Download filename
 */
export function downloadStageImage(stageRef, filename = 'gameplan-placement.png') {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
