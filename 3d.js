var gl;
var program;
var at = [0, 0, 0];
var eye = [1, 1, 1];
var up = [0, 1, 0];
var mView = lookAt(eye, at, up);
var mProjection = ortho(-2,2,-2,2,10,-10);
var instances = [];



function processTransformations() {
    var transformation = mat4();
    var xpos       = parseFloat(document.getElementById("xpos").value);
    var ypos       = parseFloat(document.getElementById("ypos").value);
    var zpos       = parseFloat(document.getElementById("zpos").value);
    var rotatex    = parseFloat(document.getElementById("rotatex").value);
    var rotatey    = parseFloat(document.getElementById("rotatey").value);
    var rotatez    = parseFloat(document.getElementById("rotatez").value);
    var xfactor    = parseFloat(document.getElementById("xfactor").value);
    var yfactor    = parseFloat(document.getElementById("yfactor").value);
    var zfactor    = parseFloat(document.getElementById("zfactor").value);
    transformation  = mult(scalem(xfactor, yfactor, zfactor), transformation);
    transformation = mult(rotateX(rotatex), transformation);
    transformation = mult(rotateY(rotatey), transformation);
    transformation = mult(rotateZ(rotatez), transformation);
    transformation = mult(translate(xpos, ypos, zpos), transformation);
    instances[instances.length -1 ].mModel = transformation;
}


function registerEvents() {
    document.getElementById("xpos").oninput    = function (event) {
        processTransformations();
    };
    document.getElementById("ypos").oninput    = function (event) {
        processTransformations();
    };
    document.getElementById("zpos").oninput    = function (event) {
        processTransformations();
    };

    document.getElementById("rotatex").oninput = function (event) {
        processTransformations();
    };
    document.getElementById("rotatey").oninput = function (event) {
        processTransformations();
    };
    document.getElementById("rotatez").oninput = function (event) {
        processTransformations();
    };

    document.getElementById("xfactor").oninput = function (event) {
        processTransformations();
    };
    document.getElementById("yfactor").oninput = function (event) {
        processTransformations();
    };

    document.getElementById("zfactor").oninput = function (event) {
        processTransformations();
    };
    window.addEventListener("resize", () => {
        var canvas = document.getElementById("gl-canvas");
        var controls = document.getElementById("controls");
        canvas.width  = Math.min(window.innerWidth, window.innerHeight) - controls.offsetHeight;
        canvas.height = canvas.width;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    });

    function resetControls() {
        document.getElementById("xpos").value = 0;
        document.getElementById("ypos").value = 0;
        document.getElementById("zpos").value = 0;

        document.getElementById("rotatex").value = 0;
        document.getElementById("rotatey").value = 0;
        document.getElementById("rotatez").value = 0;

        document.getElementById("xfactor").value = 1;
        document.getElementById("yfactor").value = 1;
        document.getElementById("zfactor").value = 1;
    }

    document.getElementById("cube").onclick  = function (event) {
        resetControls();
        let cube = {
            mModel: mat4(),
            type: 'cube'
        };
        instances.push(cube);
    };

    document.getElementById("restart").onclick  = function (event) {
        resetControls();
        instances = [];
    };


    document.getElementById("reset").onclick  = function (event) {
        resetControls();
        if (instances.length > 0) {
            instances[instances.length -1].mModel = vec4();
        }
    };
    document.getElementById("sphere").onclick  = function (event) {
        resetControls();
        let sphere = {
            mModel: mat4(),
            type  : 'sphere'
        };
        instances.push(sphere);
    };
}

window.onload = function init() {


    registerEvents();

    var canvas = document.getElementById("gl-canvas");
    var controls = document.getElementById("controls")
    canvas.width  = Math.min(window.innerWidth, window.innerHeight) - controls.offsetHeight;
    canvas.height = canvas.width;
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }


    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1.0);

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    sphereInit(gl);
    cubeInit(gl);



    // Associate our shader variables with our data buffer
    mModelLoc = gl.getUniformLocation(program, "mModel");
    mViewLoc = gl.getUniformLocation(program, "mView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let n = 0; n < instances.length; n++) {
        gl.useProgram(program);
        gl.uniformMatrix4fv(mModelLoc, false, flatten(instances[n].mModel));
        gl.uniformMatrix4fv(mViewLoc, false, flatten(mView));
        gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));
        if (instances[n].type == 'cube')
            cubeDrawWireFrame(gl, program);
        else
            sphereDrawWireFrame(gl, program);
    }
    window.requestAnimationFrame(render);
}
