import * as THREE from 'three';

export default class Node {
    /**
     * 
     * @param {*stage will be the object which is going to pass while creating the class object in another file} stage 
     * @param {* node position} position 
     * @param {*color of the node} color 
     * @param {* equating name,id,type to the data} data 
     */
    constructor(stage, position, color, data) {
        const { name, id, type, level, upSpeed, downSpeed } = data;
        this.name = name;
        this.id = id;
        this.type = type;
        this.level = level;
        this.stage = stage;
        this.position = position;
        this.color = color;
        this.upSpeed = upSpeed;
        this.downSpeed = downSpeed;
        this.sphere = this.createSphere();
        this.text = this.createTextSprite(`${name}`);
        this.image = this.createImageSprite();
        this.text1 = this.createTextSprite(`↑${upSpeed}kbps ↓${downSpeed}kbps`);
        console.log('name: ', name);
        // if the sphere is created then only add the sphere to the scene
        if (this.sphere) {
            this.stage.scene.add(this.sphere);
            if (this.text) {
                this.text.position.set(this.position.x, this.position.y + 3.2, this.position.z);
                this.stage.scene.add(this.text);
            }
            if (this.text1) {
                this.text1.position.set(this.position.x, this.position.y + 1.2, this.position.z);
                this.stage.scene.add(this.text1);
            }
            if (this.image) {
                this.image.position.set(this.position.x, this.position.y, this.position.z);
                this.stage.scene.add(this.image);
            }
        }
        else {
            console.error('Failed to create sphere');
        }
    }

    // creating the sphere
    createSphere() {
        const geometry = new THREE.SphereGeometry(0.6, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(this.position.x, this.position.y, this.position.z);
        return sphere;
    }

    // creating image sprite
    createImageSprite() {
        if (this.id !== '1') {
            return null;
        }
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('https://network-traffic-animation-y4iz.vercel.app/router.png');
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 2, 2);
        return sprite;
    }

    // creating text sprite
    createTextSprite(message) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set a base font to measure the text width
        context.font = 'Bold 50px Arial';
        
        // Measure the text width
        const textMetrics = context.measureText(message);
        const textWidth = textMetrics.width;
        const textHeight = 50; // Approximate height based on font size
        
        // Set canvas dimensions with padding
        const padding = 20; // Extra space around text
        canvas.width = textWidth + padding * 2;
        canvas.height = textHeight + padding * 2;
        
        // Re-apply font and style (since canvas was resized)
        context.font = 'Bold 50px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle'; // Better vertical alignment
        
        // Draw text in the center
        context.fillText(
            message,
            canvas.width / 2,  // x position (centered)
            canvas.height / 2  // y position (centered)
        );
        
        // Create Three.js texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true // Enable transparency (if needed)
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // Scale sprite proportionally (adjust as needed)
        const scaleFactor = 0.02; // Smaller scale for better visibility
        sprite.scale.set(
            canvas.width * scaleFactor,
            canvas.height * scaleFactor,
            1
        );
        
        return sprite;
    }
}