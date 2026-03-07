import React from 'react';

import {
    BatterIcon,
    BoundaryIcon,
    CameraIcon,
    CatchIcon,
    CloseIcon,
    MenuIcon,
    MoonIcon,
    NameTagIcon,
    PositionIcon,
    ResetZoomIcon,
    ShareIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from './icons';

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
                    {/* ── Fielders ── */}
                    <div className="help-section">
                        <h3>Fielders</h3>
                        <p>
                            <strong>Drag</strong> any player marker to reposition. Position labels
                            update automatically using standard cricket field coordinates.
                        </p>
                        <p>
                            <strong>Double-click</strong> a marker to rename it directly on the field.
                        </p>
                    </div>

                    {/* ── Left Toolbar ── */}
                    <div className="help-section">
                        <h3>Left Toolbar</h3>
                        <div className="help-icon-list">
                            <div className="help-icon-row">
                                <span className="help-icon"><MoonIcon /></span>
                                <span>Toggle dark / light mode</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><MenuIcon /></span>
                                <span>Open sidebar to edit all player names</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><CameraIcon /></span>
                                <span>Download field as a high-res PNG image</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><ShareIcon /></span>
                                <span>Copy a shareable URL that recreates your exact field setup</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Toolbar ── */}
                    <div className="help-section">
                        <h3>Right Toolbar</h3>
                        <div className="help-icon-list">
                            <div className="help-icon-row">
                                <span className="help-icon"><NameTagIcon /></span>
                                <span>Show / hide player names</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><PositionIcon /></span>
                                <span>Show / hide position labels</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><BatterIcon /></span>
                                <span>Switch between right-handed and left-handed batter (mirrors the field)</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><BoundaryIcon /></span>
                                <span>Toggle boundary coverage zones</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><CatchIcon /></span>
                                <span>Toggle catch coverage zones</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Zoom & Pan ── */}
                    <div className="help-section">
                        <h3>Zoom &amp; Pan</h3>
                        <div className="help-icon-list">
                            <div className="help-icon-row">
                                <span className="help-icon"><ZoomInIcon /></span>
                                <span className="help-icon"><ZoomOutIcon /></span>
                                <span>Zoom in / out (or use scroll wheel / pinch)</span>
                            </div>
                            <div className="help-icon-row">
                                <span className="help-icon"><ResetZoomIcon /></span>
                                <span>Reset zoom to default view</span>
                            </div>
                        </div>
                        <p>When zoomed in, drag the empty grass to pan around.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
