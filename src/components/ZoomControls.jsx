import React from 'react';

import { ResetZoomIcon, ZoomInIcon, ZoomOutIcon } from './icons';

const ZoomControls = ({ onResetZoom, onZoomIn, onZoomOut }) => {
    return (
        <div className="zoom-controls">
            <button className="zoom-btn" onClick={onZoomIn} data-tooltip="Zoom In" aria-label="Zoom In">
                <ZoomInIcon />
            </button>
            <button className="zoom-btn" onClick={onResetZoom} data-tooltip="Reset Zoom" aria-label="Reset Zoom">
                <ResetZoomIcon />
            </button>
            <button className="zoom-btn" onClick={onZoomOut} data-tooltip="Zoom Out" aria-label="Zoom Out">
                <ZoomOutIcon />
            </button>
        </div>
    );
};

export default ZoomControls;
