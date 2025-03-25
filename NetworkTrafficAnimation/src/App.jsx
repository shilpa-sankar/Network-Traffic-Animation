import './App.css'
import CanvasComponent from './components/canvasContainer'
import { useState, useEffect } from 'react';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5173/nodeDataJSON.json')
      .then(response => response.json())
      .then(data => {
        setGraphData({ nodes: data.nodes, links: data.links });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading network data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading network topology...</div>;
  }


  return (
    <>
      <div>
        <CanvasComponent graphData={graphData} />
      </div>
    </>
  )
}

export default App
