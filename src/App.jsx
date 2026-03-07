import React, { useCallback, useEffect, useRef, useState } from 'react';

import CricketField from './components/CricketField';
import FieldActions from './components/FieldActions';
import FieldToolbar from './components/FieldToolbar';
import HelpModal from './components/HelpModal';
import Sidebar from './components/Sidebar';
import ZoomControls from './components/ZoomControls';
import { usePlayers } from './hooks/usePlayers';
import { useZoomPan } from './hooks/useZoomPan';
import './App.css';

const FIELD_WIDTH = 950;
const FIELD_HEIGHT = 800;

function App() {
  const stageRef = useRef(null);
  const fieldContainerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ height: 0, width: 0 });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [showNames, setShowNames] = useState(true);
  const [showPositions, setShowPositions] = useState(true);
  const [showBoundaryCoverage, setShowBoundaryCoverage] = useState(true);
  const [showCatchCoverage, setShowCatchCoverage] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    focusedPlayerIndex,
    handleLeftHandedToggle,
    handlePlayerDrag,
    handlePlayerNameChange,
    isLeftHanded,
    playerNames,
    players,
    setFocusedPlayerIndex
  } = usePlayers();

  const {
    handleResetZoom,
    handleZoomIn,
    handleZoomOut,
    panPos,
    setPanPos,
    setZoomScale,
    zoomScale
  } = useZoomPan(stageRef);

  // Observe the field container size for responsive scaling
  useEffect(() => {
    const el = fieldContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { height, width } = entries[0].contentRect;
      setContainerSize({ height, width });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sync theme to <html> data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Download image
  const handleDownloadImage = useCallback(() => {
    if (!stageRef.current) return;
    const filename = `set-your-field-placement.png`;

    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
  }, []);

  return (
    <div className="app-container">
      <div ref={fieldContainerRef} className="field-container">
        <FieldActions
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onDownloadImage={handleDownloadImage}
          setTheme={setTheme}
          theme={theme}
        />
        <CricketField
          onPlayerNameChange={(index, newName) => handlePlayerNameChange(index + 1, newName)}
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
        />
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
        <ZoomControls
          onResetZoom={handleResetZoom}
          onZoomOut={handleZoomOut}
          onZoomIn={handleZoomIn}
        />
        <div className="vzfld-logo">VZFLD</div>
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
