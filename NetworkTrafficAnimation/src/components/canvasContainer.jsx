import React, { Component } from 'react';
import * as THREE from 'three';
import Node from '../objects/nodes';
import Link from '../objects/links';

const VERTICALMODE = 'vertical';
const HORIZONTALMODE = 'horizontal';
export const HEIGHT_OFFSET = 10;

let progress = 0;
let startTime = null;

class StaticSphereHierarchy extends Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.parentSphere = null;

    this.viewMode = VERTICALMODE;

    if (this.viewMode === VERTICALMODE) {
      this.parentPoistion = new THREE.Vector3(0, 15, 0);
    }
    else if (this.viewMode === HORIZONTALMODE) {
      this.parentPoistion = new THREE.Vector3(15, 0, 0);
    }

    this.layer = 3;
    this.nodeData = props.graphData.nodes;
    this.linkData = props.graphData.links;

    this.nodes = [];
    this.links = [];
  }

  componentDidMount() {
    this.setupScene();
    this.createNodes();
    this.createLinks();
    this.startAnimation();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    const container = document.getElementById('canvas-container');
    if (container && this.renderer.domElement) {
      container.removeChild(this.renderer.domElement);
    }
  }

  setupScene = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    this.camera.position.z = 50;
    this.scene.background = new THREE.Color(0x111111);
    
    // Single render (no animation loop)
    this.renderer.render(this.scene, this.camera);
  };

  createNodes = () => {
    const noOfNodesinLevel1 = 0;
    const noOfNodesinLevel2 = 0;
    const noOfNodesinLevel3 = 0;
    for(let i = 0; i < this.nodeData.length; i++) {
      let position = new THREE.Vector3(0, 0, 0);
      if (this.nodeData[i].level === 0) {
        position.y = 15;
      }
      else if (this.nodeData[i].level === 1) {
        position.y = 5;
        position.x = -5 * (i - noOfNodesinLevel1);
      }
      else if (this.nodeData[i].level === 2) {
        position.y = -5;
        position.x = -5 * (i - noOfNodesinLevel2);
      }
      else if (this.nodeData[i].level === 3) {
        position.y = -5;
        position.x = -5 * (i - noOfNodesinLevel3);
      }
      const nodeObject = new Node(this, position, 0x00ff00, this.nodeData[i]);
      this.nodes.push(nodeObject);
    }
  };

  createLinks = () => {
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
      const linkObject = new Link(source, target);
      this.links.push(linkObject);
    }
  }

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  };

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    if (this.nodes[0]) {
      this.nodes[0].position.x += 0.01;
      this.nodes[0].position.y += 0.01;
    }
    
    this.renderer.render(this.scene, this.camera);
  };

  startAnimation = () => {
    if (!this.animationId) {
      this.animate();
    }
  };


  render() {
    return (
      <div id="canvas-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    );
  }
}

export default StaticSphereHierarchy;