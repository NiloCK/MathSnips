/// <reference path="../Scripts/three.js/build/three.js" />

function RectPrism(length, width, height) {
    this.length = length;
    this.width = width;
    this.height = height;

    this.box = null;
    this.canvas = null;

    this.animTest = function () {
        this.box.rotation.x += 0.01;
        requestAnimationFrame(this.animTest);
    }
}

//RectPrism.prototype.animTest = function () {
//    this.box.rotation.x += 0.01;
//    requestAnimationFrame(this.animTest);
//}

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
    this.box = new THREE.Mesh(boxGeometry, boxMat);

    this.box.position.x = 0;
    this.box.position.y = 0;
    this.box.position.z = 0;
    

    //var wireBox = new THREE.WireframeHelper(this.box, 0xffffff);
    //scene.add(wireBox);

    scene.add(this.box);
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    
    camera.lookAt(new THREE.Vector3(-1,-1,-1)); 

    function render() {
        //this.box.rotation.x += 0.1;
        //this.box.rotation.y += 0.03;
        //this.box.rotation.z -= -0.2;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    this.canvas = renderer.domElement;

    render();

    return this.canvas;
}