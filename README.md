# Gameplan

A modern, responsive React application for designing, editing, sharing, and planning cricket fielding positions.

## Core Features
- **Interactive Field Canvas:** Built using `react-konva` for high-performance rendering of the cricket ground, pitch, players, and boundaries.
- **URL State Sharing:** Losslessly compresses the exact field layout and custom player names into a 48+ character URL for instant, zero-database sharing.
- **Draggable Fielders:** 11 fully draggable players (WK, Bowler, and 9 Outfielders) constrained mathematically to remain within the boundary rope.
- **Smart Position Naming:** Uses a K-Nearest-Neighbor (KNN) geometric lookup against standard cricket coordinates to automatically label fielders as they are dragged (e.g., dragging a player to the "point" boundary correctly labels them "deep point").
- **Coverage Analysis:** Toggle visual boundary and catch coverage area overlays for your fielders to identify field gaps.
- **Left/Right Handed Toggle:** Flips the pitch layout and mirrors all active fielder positions mathematically.
- **Zoom & Pan:** Native canvas pinch-to-zoom (mobile), scroll-wheel zoom (desktop), and drag-to-pan support for deep analysis.
- **Field Editing:** Use the sidebar menu to quickly rename the players or labels on the field.
- **Export to Image:** Export a high-resolution PNG image map of your field.

## Developer Guide

### Architecture Overview

The app is built using a modern React architecture applying the Single Responsibility Principle:

- **`src/App.jsx`**: The main entry point. Decodes URLs, injects state, and manages the primary layout grid.
- **`src/hooks/usePlayers.js`**: Central hook managing all complex fielder state, dragging, and KNN position calculations.
- **`src/components/CricketField.jsx`**: Pure presentation container organizing the Konva Stage and delegating to specialized layers:
    - **`FieldLayer`**: Renders the static grass, inner circle, and pitch.
    - **`CoverageLayer`**: Renders the dynamic boundary and catch coverage triangles.
    - **`PlayerLayer`**: Renders the individual draggable `.PlayerMarker` elements.
- **`src/utils/fieldCodec.js`**: Contains the custom 5-bit + base64url binary encoder/decoder used for the URL string compression.
- **`src/data/fieldData.js`**: Contains the geometric reference map (`fieldPositions`) defining standard 0-1 normalized coordinates for every possible position.

### CI/CD Workflow
This project utilizes **semantic-release** with GitHub Actions for fully automated versioning and deployments to Sevalla (`.github/workflows/release.yml`). Commits should follow the **Conventional Commits** specification to trigger deployments.

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the dev server:**
   ```bash
   npm run dev
   ```
3. **Run Unit Tests:**
   ```bash
   npm test
   ```

### Tech Stack
- React 18, Vite, React-Konva, Vitest
- Vanilla CSS (Responsive with `dvh` mobile support)
