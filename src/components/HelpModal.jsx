import React from 'react';

import { CloseIcon } from './icons';

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="help-modal-overlay" onClick={onClose}>
            <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="help-modal-header">
                    <h2>How to Use Gameplan</h2>
                    <button className="help-modal-close" onClick={onClose} title="Close">
                        <CloseIcon height={28} width={28} />
                    </button>
                </div>

                <div className="help-modal-body">
                    <div className="help-section">
                        <h3>Sharing Your Field</h3>
                        <p>
                            The URL in your address bar always reflects the current field setup —
                            player positions, custom names, and toggle settings. You can copy the
                            page URL at any time and share it with anyone; opening the link will
                            recreate the exact same field placement.
                        </p>
                    </div>

                    <div className="help-section">
                        <h3>Moving Fielders</h3>
                        <p>
                            Click and drag any of the round player markers on the grass. Their
                            position labels will automatically update based on standard cricket
                            coordinates (e.g., dragging a player to the square leg boundary will
                            auto-label them &quot;deep square leg&quot;).
                        </p>
                    </div>

                    <div className="help-section">
                        <h3>Zoom &amp; Pan</h3>
                        <p>
                            Use the <strong>+ / - buttons</strong> in the bottom right, your mouse
                            scroll wheel, or pinch-to-zoom on touch screens to zoom in. Once zoomed
                            in, click and drag anywhere on the empty grass to pan around the field.
                        </p>
                    </div>

                    <div className="help-section">
                        <h3>Renaming Players</h3>
                        <p>
                            <strong>Double-click</strong> any player marker on the canvas to edit
                            their name directly on the field. You can also edit player names in bulk
                            using the Sidebar (menu icon in the top left).
                        </p>
                    </div>

                    <div className="help-section">
                        <h3>Using Presets</h3>
                        <p>
                            The top-left toolbar contains a <strong>Presets</strong> dropdown.
                            Selecting a preset (like &quot;Attacking 1&quot; or &quot;Slower
                            Bowler&quot;) will instantly snap the 9 outfielders to their designated
                            strategic coordinates.
                        </p>
                    </div>

                    <div className="help-section">
                        <h3>Toggles &amp; Actions</h3>
                        <p>
                            Use the buttons in the top-right toolbar to toggle visibility of player
                            names, position labels, boundary coverage, catch zones, and switch
                            between Right-Handed / Left-Handed batter orientations (which
                            automatically mirrors the field).
                        </p>
                        <p>Use the top-left toolbar to download your field as a high-res image.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
