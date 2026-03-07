import React, { useCallback, useEffect, useRef, useState } from 'react';

import { encodeField, parseFieldFromPath } from './utils/fieldCodec';
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

    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    // Keep the address bar URL in sync with the current field state
    useEffect(() => {
        const playerStrings = players.map((p, index) => {
            const defaultName = `Player${index + 1}`;
            if (p.name === defaultName) {
                return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }
            return `${p.x.toFixed(1)},${p.y.toFixed(1)},${p.name}`;
        });
        const delimitedString = `${isLeftHanded ? 1 : 0}|${playerStrings.join('|')}`;
        const compressed = encodeField(delimitedString, {
            showPositions,
            showBoundaryCoverage,
            showCatchCoverage,
        });
        const newPath = `/${compressed}`;
        if (window.location.pathname !== newPath) {
            window.history.replaceState(null, '', newPath);
        }
        // If share popup is open, update its URL too
        if (shareUrl) {
            setShareUrl(`${window.location.origin}${newPath}`);
            setCopied(false);
        }
    }, [players, isLeftHanded, showPositions, showBoundaryCoverage, showCatchCoverage]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleShare = useCallback(() => {
        setShareUrl(window.location.href);
        setCopied(false);
    }, []);

    const handleCopyUrl = useCallback(() => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [shareUrl]);

    return (
        <div className="app-container">
            <div ref={fieldContainerRef} className="field-container">
                <FieldActions
                    onOpenSidebar={() => setSidebarOpen(true)}
                    onOpenHelp={() => setIsHelpOpen(true)}
                    onDownloadImage={handleDownloadImage}
                    onShare={handleShare}
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

                {shareUrl && (
                    <div className="share-popup">
                        <button className="share-popup-close" onClick={() => setShareUrl('')}>
                            ✕
                        </button>
                        <a
                            className="share-popup-url"
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {shareUrl}
                        </a>
                        <button
                            className="share-popup-copy"
                            onClick={handleCopyUrl}
                            title={copied ? 'Copied!' : 'Copy to clipboard'}
                        >
                            {copied ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    width="16"
                                    height="16"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    width="16"
                                    height="16"
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
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
