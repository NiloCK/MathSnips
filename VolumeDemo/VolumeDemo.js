/// <reference path="../Scripts/three.js/build/three.js" />

function RectPrism(length, width, height) {
    this.length = length;
    this.width = width;
    this.height = height;

    this.rect = null;
    this.canvas = null;
}

RectPrism.prototype.getCanvasDrawing = function(size){
    if (this.canvas) {
        return this.canvas;
    }

    if (!size)
        size = 300;

    //this.canvas = document.createElement('canvas');
    //this.canvas.height = size;
    //this.canvas.width = size;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(size, size);

    var boxGeometry = new THREE.BoxGeometry(this.width, this.width, this.height);
    var boxMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var boxWhole = new THREE.Mesh(boxGeometry, boxMat);

    boxWhole.position.x = 0;
    boxWhole.position.y = 0;
    boxWhole.position.z = 0;
    

    //var wireBox = new THREE.WireframeHelper(boxWhole, 0xffffff);
    //scene.add(wireBox);

    scene.add(boxWhole);
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    
    camera.lookAt(new THREE.Vector3(-1,-1,-1)); 

    function render() {
        boxWhole.rotation.x += 0.1;
        boxWhole.rotation.y += 0.03;
        boxWhole.rotation.z -= -0.2;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    this.canvas = renderer.domElement;

    render();

    return this.canvas;
}