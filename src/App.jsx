import React, { useCallback, useRef, useState } from 'react';

import { parseFieldFromPath } from './utils/fieldCodec';
import { downloadStageImage } from './utils/downloadImage';
import CricketField from './components/CricketField';
import FieldActions from './components/FieldActions';
import FieldToolbar from './components/FieldToolbar';
import HelpModal from './components/HelpModal';
import SharePopup from './components/SharePopup';
import Sidebar from './components/Sidebar';
import ZoomControls from './components/ZoomControls';
import { useContainerSize } from './hooks/useContainerSize';
import { usePlayers } from './hooks/usePlayers';
import { useTheme } from './hooks/useTheme';
import { useUrlSync } from './hooks/useUrlSync';
import { useZoomPan } from './hooks/useZoomPan';
import './App.css';

const FIELD_WIDTH = 950;
const FIELD_HEIGHT = 800;

function App() {
    const stageRef = useRef(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [initialFieldState] = useState(() => parseFieldFromPath());

    // When loading from URL: use decoded flags + hide names unless custom names exist
    // When visiting directly: show names and positions by default
    const hasUrlState = initialFieldState !== null;
    const hasCustomNames = hasUrlState && Object.keys(initialFieldState.names).length > 0;

    const [showNames, setShowNames] = useState(hasUrlState ? hasCustomNames : true);
    const [showPositions, setShowPositions] = useState(
        hasUrlState ? initialFieldState.flags.showPositions : true,
    );
    const [showBoundaryCoverage, setShowBoundaryCoverage] = useState(
        hasUrlState ? initialFieldState.flags.showBoundaryCoverage : true,
    );
    const [showCatchCoverage, setShowCatchCoverage] = useState(
        hasUrlState ? initialFieldState.flags.showCatchCoverage : false,
    );

    const [theme, setTheme] = useTheme('light');
    const { containerRef, containerSize } = useContainerSize();

    const {
        focusedPlayerIndex,
        handleLeftHandedToggle,
        handlePlayerDrag,
        handlePlayerNameChange,
        isLeftHanded,
        playerNames,
        players,
        setFocusedPlayerIndex,
    } = usePlayers(initialFieldState);

    const {
        handleResetZoom,
        handleZoomIn,
        handleZoomOut,
        panPos,
        setPanPos,
        setZoomScale,
        zoomScale,
    } = useZoomPan(stageRef);

    const { shareUrl, openShare, closeShare } = useUrlSync({
        players,
        isLeftHanded,
        showPositions,
        showBoundaryCoverage,
        showCatchCoverage,
    });

    const handleDownloadImage = useCallback(() => {
        downloadStageImage(stageRef);
    }, []);

    return (
        <div className="app-container">
            <div ref={containerRef} className="field-container">
                <FieldActions
                    onOpenSidebar={() => setSidebarOpen(true)}
                    onOpenHelp={() => setIsHelpOpen(true)}
                    onDownloadImage={handleDownloadImage}
                    onShare={openShare}
                    setTheme={setTheme}
                    theme={theme}
                />
                <CricketField
                    onPlayerNameChange={(index, newName) =>
                        handlePlayerNameChange(index + 1, newName)
                    }
                    onPlayerDrag={handlePlayerDrag}
                    showBoundaryCoverage={showBoundaryCoverage}
                    focusedPlayerIndex={focusedPlayerIndex}
                    containerHeight={containerSize.height}
                    showCatchCoverage={showCatchCoverage}
                    containerWidth={containerSize.width}
                    showPositions={showPositions}
                    isLeftHanded={isLeftHanded}
                    setZoomScale={setZoomScale}
                    height={FIELD_HEIGHT}
                    showNames={showNames}
                    zoomScale={zoomScale}
                    setPanPos={setPanPos}
                    width={FIELD_WIDTH}
                    stageRef={stageRef}
                    players={players}
                    panPos={panPos}
                >
                    <ZoomControls
                        onResetZoom={handleResetZoom}
                        onZoomOut={handleZoomOut}
                        onZoomIn={handleZoomIn}
                    />
                </CricketField>
                <FieldToolbar
                    setShowBoundaryCoverage={setShowBoundaryCoverage}
                    showBoundaryCoverage={showBoundaryCoverage}
                    setShowCatchCoverage={setShowCatchCoverage}
                    setIsLeftHanded={handleLeftHandedToggle}
                    showCatchCoverage={showCatchCoverage}
                    setShowPositions={setShowPositions}
                    showPositions={showPositions}
                    setShowNames={setShowNames}
                    isLeftHanded={isLeftHanded}
                    showNames={showNames}
                />
                <div className="gameplan-logo">
                    <span>GAMEPLAN</span>
                    <span className="app-version">v{__APP_VERSION__}</span>
                </div>
                <SharePopup url={shareUrl} onClose={closeShare} />
            </div>
            <Sidebar
                onPlayerNameChange={handlePlayerNameChange}
                onClose={() => setSidebarOpen(false)}
                onPlayerFocus={setFocusedPlayerIndex}
                focusedPlayerIndex={focusedPlayerIndex}
                playerNames={playerNames}
                isOpen={sidebarOpen}
            />
            <HelpModal onClose={() => setIsHelpOpen(false)} isOpen={isHelpOpen} />
        </div>
    );
}

export default App;
