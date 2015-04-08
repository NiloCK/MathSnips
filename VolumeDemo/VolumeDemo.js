/// <reference path="../Scripts/three.js/build/three.js" />

function RectPrism(length, width, height) {
    this.length = length;
    this.width = width;
    this.height = height;
    this.volumn = length * width * height;

    this.cubes = [];

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.rect = null;
    this.canvas = null;
}

RectPrism.prototype.getControls = function () {
    var ret = document.createElement('div');

    var addCube = document.createElement('button');
    addCube.onclick = this.addCube;
    addCube.textContent = "Add Cube";
    
    var removeCube = document.createElement('button');
    removeCube.onclick = function () {
        if (this.cubes.length > 0) {
            
        }
        
    };
    removeCube.innerText = "Remove Cube";

    var countDisplay = document.createElement('div');
    countDisplay.innerText =  this.cubes.length;

    ret.appendChild(addCube);
    ret.appendChild(removeCube);
    ret.appendChild(countDisplay);

    return ret;
}

RectPrism.prototype.addCube = function () {

};

RectPrism.prototype.removeCube = function () {
    if (this.cubes.length > 0) {
        var cube = this.cubes.pop();

    }
};

RectPrism.prototype.getCanvasDrawing = function (size) {
    if (this.canvas) {
        return this.canvas;
    }

    if (!size)
        size = 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(size, size);

    var boxGeometry = new THREE.BoxGeometry(this.length, this.width, this.height);
    var boxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    var boxWhole = new THREE.Mesh(boxGeometry, boxMat);

    boxWhole.position.x = 0;
    boxWhole.position.y = 0;
    boxWhole.position.z = 0;


    //var wireBox = new THREE.WireframeHelper(boxWhole, 0xffffff);
    //scene.add(wireBox);

    this.scene.add(boxWhole);
    this.camera.position.x = 5;
    this.camera.position.y = 5;
    this.camera.position.z = 5;

    this.camera.lookAt(new THREE.Vector3(-1, -1, -1));

    //function render(renderer) {
    //    requestAnimationFrame(render(renderer));
    //    renderer.render(this.scene, this.camera);
    //}

    this.canvas = this.renderer.domElement;
    this.canvas.onmousemove = onDocumentMouseMove.bind(this);

    this.render();
    return this.canvas;
};

RectPrism.prototype.render = function () {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
};

function onDocumentMouseMove(event) {

    event.preventDefault();

    if (isMouseDown) {

        theta = -((event.clientX - onMouseDownPosition.x) * 0.5)
                + onMouseDownTheta;
        phi = ((event.clientY - onMouseDownPosition.y) * 0.5)
              + onMouseDownPhi;

        phi = Math.min(180, Math.max(0, phi));

        this.camera.position.x = radious * Math.sin(theta * Math.PI / 360)
                            * Math.cos(phi * Math.PI / 360);
        this.camera.position.y = radious * Math.sin(phi * Math.PI / 360);
        this.camera.position.z = radious * Math.cos(theta * Math.PI / 360)
                            * Math.cos(phi * Math.PI / 360);
        this.camera.updateMatrix();

    }

    //mouse3D = projector.unprojectVector(
    //    new THREE.Vector3(
    //        (event.clientX / renderer.domElement.width) * 2 - 1,
    //        -(event.clientY / renderer.domElement.height) * 2 + 1,
    //        0.5
    //    ),
    //    camera
    //);
    //ray.direction = mouse3D.subSelf(camera.position).normalize();

    //interact();
    //render();

}