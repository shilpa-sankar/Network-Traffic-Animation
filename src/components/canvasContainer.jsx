import React, { Component } from 'react';
import * as THREE from 'three';
import Node from '../objects/nodes';
import Link from '../objects/links';
import * as dat from 'dat.gui';


const VERTICALMODE = 'vertical';
const HORIZONTALMODE = 'horizontal';
export const HEIGHT_OFFSET = 10;


class StaticSphereHierarchy extends Component {
  /**
   * @param {object} props  The props object which is pasing from app.jsx file , so we get the graphData
   * @member var {object} scene  The scene object which is used to create the scene
   * @member var {object} camera  The camera object which is used to create the camera
   * @member var {object} renderer  The renderer object which is used to create the renderer
   * @member var {object} parentSphere  The parentSphere object which is used to create the first sphere on the heiraarchy
   * @member var {string} viewMode  The viewMode object which is used to create whether its horizontal or vertical
  */
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-70, 70, 55, -55, 1, 1000 );
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    console.log('this.camera : ', this.camera );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.parentSphere = null;

    this.viewMode = VERTICALMODE;

    this.layer = 3;
    // nodeData and linkData are the data which is coming from the props
    // nodeData is the array of nodes and linkData is the array of links
    this.nodeData = props.graphData.nodes;
    this.linkData = props.graphData.links;

    this.nodes = [];
    this.links = [];
  }
// after the scene is loaded we mount the scene and create the nodes and links
// we also add the event listener for the resize of the window
  componentDidMount() {
    this.setupScene();
    this.createNodes();
    this.createLinks();
    this.initGUI();
    this.startAnimation();
    window.addEventListener('resize', this.handleResize);
  }
// after loading the scene we remove the event listener and the renderer dom element
// we also stop the animation and remove child from the canvas container
  componentWillUnmount() {
    this.stopAnimation();
    window.removeEventListener('resize', this.handleResize);
    this.removeGUI();
    this.scene.clear();
    const container = document.getElementById('canvas-container');
    if (container && this.renderer.domElement) {
      container.removeChild(this.renderer.domElement);
    }
  }

  setupScene = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
    this.scene.background = new THREE.Color(0x111111);
    
  };

  initGUI() {
    this.gui = new dat.GUI();
    
    // Dropdown for flow direction
    this.gui.add(this, 'viewMode', [VERTICALMODE, HORIZONTALMODE])
      .name('Layout')
      .onChange(async () => await this.updateView());
  }

  removeGUI() {
    this.gui.destroy();
  }

  async updateView() {
    this.removeLinks();
    await this.arrangeNodesInTree().then(() => {
      this.createLinks();
    });
  }

  createNodes = () => {
    /**
     * The below code is used to create the nodes in the scene
     * The nodes are created based on the level of the node
     */
    this.nodeMap = new Map();
    for(let i = 0; i < this.nodeData.length; i++) {
      const nodeObject = new Node(this, new THREE.Vector3(0, 0, 0), 0x00ff00, this.nodeData[i]);
      if (this.nodeMap.has(this.nodeData[i].level)) {
        this.nodeMap.get(this.nodeData[i].level).push(nodeObject);
      }
      else {
        this.nodeMap.set(this.nodeData[i].level, [nodeObject]);
      }
    }

    this.arrangeNodesInTree();
  };

  arrangeNodesInTree = async () => {
      this.nodes = [];
      //set position
      this.nodeMap.forEach((value, key) => {
        let length = value.length;
        const secondarOffset = 30 / length * key;
        const primaryOffset = 10;
        for (let i = 0; i < length; i++) {
          if (this.viewMode === VERTICALMODE) {
            // primary axis 
            console.log('value[i]: ', value[i]);
            value[i].position.y = 20 - key * primaryOffset;
            value[i].sphere.position.y = 20 - key * primaryOffset;
            value[i].text1.position.y = 20 - key * primaryOffset + 1.2;
            value[i].text.position.y = 20 - key * primaryOffset + 3;
            if (value[i].image) value[i].image.position.y = 20 - key * primaryOffset + 5;
  
            //secondary axis
            value[i].position.x = i * secondarOffset - (length - 1) * secondarOffset/2;
            value[i].sphere.position.x = i * secondarOffset - (length - 1) * secondarOffset/2;
            value[i].text.position.x = i * secondarOffset - (length - 1) * secondarOffset/2;
            value[i].text1.position.x = i * secondarOffset - (length - 1) * secondarOffset/2;
            if (value[i].image) value[i].image.position.x = i * secondarOffset - (length - 1) * secondarOffset/2;
          }
          else if (this.viewMode === HORIZONTALMODE) {
            // primary axis 
            value[i].position.x = - 10 + key * primaryOffset;
            value[i].sphere.position.x = - 10 + key * primaryOffset;
            value[i].text1.position.x = - 10 + key * primaryOffset - 1.2;
            value[i].text.position.x = - 10 + key * primaryOffset - 3;
            if (value[i].image) value[i].image.position.x = - 10 + key * primaryOffset - 8;
  
            //secondary axis
            value[i].position.y = i * secondarOffset - (length - 1) * secondarOffset/2;
            value[i].sphere.position.y = i * secondarOffset - (length - 1) * secondarOffset/2;
            value[i].text1.position.y = i * secondarOffset - (length - 1) * secondarOffset/2 - 1.2;
            value[i].text.position.y = i * secondarOffset - (length - 1) * secondarOffset/2 - 3;
            if (value[i].image) value[i].image.position.y = i * secondarOffset - (length - 1) * secondarOffset/2 - 2;
          }
        this.nodes.push(value[i]);
        }
      })
      return Promise.resolve();
  }

  createLinks = () => {
    /**
     * The below code is used to create the links in the scene
     * The links are created based on the source and target nodes
    */
    for (let i = 0; i < this.linkData.length; i++) {
      let source  = null;
      let target = null;
      for(let j = 0; j < this.nodes.length; j++) { 
        if(this.nodes[j].id === this.linkData[i].source) {
          source = this.nodes[j];
        } 
        if(this.nodes[j].id === this.linkData[i].target) {
          target = this.nodes[j];
        }
        if(source && target) {
          break;
        }
      }
      // the link object is created using the Link class
      // the link object is added to the links array
      const linkObject = new Link(source, target);
      this.links.push(linkObject);
    }
  }

  removeLinks() {
    for (let i = 0; i < this.links.length; i++) {
      this.scene.remove(this.links[i].line);
      this.scene.remove(this.links[i].animationSphere);
    }
    this.links = [];
  }
// handleResize is used to handle the resize of the window
  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  };

  animate = () => {
    
    // Update progress (0 to 1)
    
    this.animationId = requestAnimationFrame(this.animate);
    
    for (let i = 0; i < this.links.length; i++) {
      // this.links[i].animate(progress, timestamp/200);
      this.links[i].animate();
    }
    
    this.renderer.render(this.scene, this.camera);
  };

  startAnimation = () => {
    if (!this.animationId) {
      this.animate();
    }
  };

  stopAnimation = () => {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  };

  render() {
    return (
      <div id="canvas-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    );
  }
}

export default StaticSphereHierarchy;