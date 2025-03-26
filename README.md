# Network Traffic Animation Project

## Overview

The **Network Traffic Animation Project** is a visualization tool built using React and Three.js. It creates a 3D representation of network nodes and links, allowing users to view and interact with hierarchical network structures. The project supports both vertical and horizontal layouts for better visualization.

## Features

- 3D visualization of network nodes and links.
- Dynamic layout switching between vertical and horizontal modes.
- Interactive GUI for layout customization.
- Responsive design to handle window resizing.
- Smooth animations for link transitions.

## Technologies Used

- **React**: For building the user interface.
- **Three.js**: For rendering 3D graphics.
- **dat.GUI**: For providing an interactive GUI for layout customization.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shilpa-sankar/Network-Traffic-Animation.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Network-Traffic-Animation-1
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- **src/components**: Contains React components like `canvasContainer.jsx` for rendering the 3D scene.
- **src/objects**: Contains classes for nodes and links used in the visualization.

## Key Files

- `canvasContainer.jsx`: Main component responsible for setting up the 3D scene, rendering nodes and links, and handling user interactions.

## Customization

- Modify the `graphData` prop passed to the `StaticSphereHierarchy` component to customize the nodes and links.
- Use the GUI to switch between vertical and horizontal layouts.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [Three.js](https://threejs.org/)
- [dat.GUI](https://github.com/dataarts/dat.gui)