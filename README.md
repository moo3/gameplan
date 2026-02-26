# Cricketer Fielders App

A modern, responsive React application for designing, editing, and planning cricket fielding positions.

## Core Features

- **Interactive Field Canvas:** Built using `react-konva` for high-performance rendering of the cricket ground, pitch, players, and boundaries.
- **Draggable Fielders:** 11 fully draggable players (WK, Bowler, and 9 Outfielders) mathematically constrained to remain within the boundary rope.
- **Smart Position Naming:** Uses a K-Nearest-Neighbor (KNN) geometric lookup against standard cricket coordinates to automatically label fielders as they are dragged (e.g., dragging a player to the "point" boundary correctly labels them "deep point").
- **Left/Right Handed Toggle:** Flips the pitch layout and mirrors all active fielder positions mathematically.
- **Zoom & Pan:** Native canvas pinch-to-zoom (mobile), scroll-wheel zoom (desktop), and drag-to-pan support for deep analysis.
- **Field Editing:** Use the sidebar menu to quickly rename the players or labels on the field.
- **Export to Image:** Export a high-resolution PNG image map of your field for sharing.

## Developer Guide

### Architecture Overview

- **`src/App.jsx`**: The main controller. Owns the state for all players, UI panels, and canvas configuration.
- **`src/components/CricketField.jsx`**: Pure presentation layer for the Konva stage. Handles drawing the elliptical grass layers, pitch, lines, and coverage triangles.
- **`src/components/PlayerMarker.jsx`**: Individual fielder component handling drag-bounds and inline text-editing layers.
- **`src/data/fieldData.js`**: Contains the hardcoded geometric reference map (`fieldPositions`) defining standard 0-1 normalized coordinates for every possible position (slips, gullies, deep mid-wicket, etc).
- **`src/utils/fieldUtils.js`**: Pure mathematical functions. Computes Nearest-Neighbor distances, boundary constraints, collision logic, and coordinate flipping.

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### Tech Stack
- React 18
- Vite
- React-Konva
- Vanilla CSS (Responsive with `dvh` mobile support)
