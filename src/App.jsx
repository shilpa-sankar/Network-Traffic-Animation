import './App.css'
import CanvasComponent from './components/canvasContainer'
import { useState, useEffect } from 'react';

function App() {
  /**
   * state initialization for graph data
   * two variables has been created using useState hook 
   * 1. graphData: to store the nodes and links data
   * 2. loading: to store the loading state of the graph data
   */
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const [loading, setLoading] = useState(true);

  /**
   * The useEffect hook is used to perform side effects (like data fetching) in functional components
   * The empty dependency array [] means this effect will run only once, when the component mounts.
   */
  useEffect(() => {
    /**
     * Fetching the network data from the JSON file
     * The fetch() method is used to fetch resources from the network
     * The response.json() method parses the JSON response into a JavaScript object
     * The setGraphData() method is used to update the state of the graph data
     * The setLoading() method is used to update the loading state of the graph data
     */
    fetch('http://localhost:5173/nodeDataJSON.json')
      .then(response => response.json())
      .then(data => {
        setGraphData({ nodes: data.nodes, links: data.links });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading network data:', error);
        // setLoading is given as false here to stop infinite loading when error occurs.
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
