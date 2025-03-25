import * as THREE from 'three';

export default class Node {
    constructor(stage, position, color, data) {
        const { name, id, type } = data;
        this.name = name;
        this.id = id;
        this.type = type;
        this.stage = stage;
        this.position = position;
        this.color = color;
        this.sphere = this.createSphere();
        if (this.sphere) {
            this.stage.scene.add(this.sphere);
        }
        else {
            console.error('Failed to create sphere');
        }
    }

    createSphere() {
        const geometry = new THREE.SphereGeometry(0.6, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(this.position.x, this.position.y, this.position.z);
        return sphere;
    }
}