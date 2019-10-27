var gl;
var program;
var at = [0, 0, 0];
var eye = [1, 1, 1];
var up = [0, 1, 0];
var mView = lookAt(eye, at, up);
var mProjection = ortho(-2,2,-2,2,10,-10);
var instances = [];
var mModelLoc;
var mViewLoc;
var mProjectionLoc;

function processTransformations() {
    var transformation = mat4();
    console.log($("#xfactor").val());

    transformation  = mult(scalem($("#xfactor").val(), $("#yfactor").val(), $("#zfactor").val()), transformation);
    transformation = mult(rotateX($("#rotatex").val()), transformation);
    transformation = mult(rotateY($("#rotatey").val()), transformation);
    transformation = mult(rotateZ($("#rotatez").val()), transformation);
    transformation = mult(translate($("#xpos").val(), $("#ypos").val(), $("#zpos").val()), transformation);
    instances[instances.length -1 ].mModel = transformation;
}
function registerEvents() {
    $("div#controls > div > input").on("input", () => {
        processTransformations();
    });

    $(window).resize(() => {
        var $canvas = $("#gl-canvas");
        var $controls = $("#controls");
        $canvas.width(Math.min(window.innerWidth, window.innerHeight) - $controls[0].offsetHeight);
        $canvas.height($canvas.width());
        gl.viewport(0, 0, $canvas[0].width, $canvas[0].height);
    });

    function resetControls() {
        $("#translation > input, #rotations > input").val(0);
        $("#scale > input").val(1);
    }

    $("#cube").click(() => {
        resetControls();
        let cube = {
            mModel: mat4(),
            type: 'cube'
        };
        instances.push(cube);
    });

    $("#restart").click(() => {
        resetControls();
        instances = [];
    });


    $("#reset").click(() => {
        resetControls();
        if (instances.length > 0) {
            let old = {
                mModel: mat4(),
                type  : instances.pop().type
            };
            instances.push(old);
        }
    });
    $("#sphere").click(() => {
        resetControls();
        let sphere = {
            mModel: mat4(),
            type  : 'sphere'
        };
        instances.push(sphere);
    });
}
function setupUniforms() {
    var $canvas = $("#gl-canvas");
    var $controls = $("#controls");
    $canvas.width(Math.min(window.innerWidth, window.innerHeight) - $controls[0].offsetHeight);
    $canvas.height($canvas.width);
    gl = WebGLUtils.setupWebGL($canvas[0]);
    if(!gl) { alert("WebGL isn't available"); }
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    mModelLoc      = gl.getUniformLocation(program, "mModel");
    mViewLoc       = gl.getUniformLocation(program, "mView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");
    gl.viewport(0,0,$canvas[0].width, $canvas[0].height);
    gl.clearColor(0, 0, 0, 1.0);
}
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
$(function() {
    registerEvents();
    setupUniforms();
    sphereInit(gl);
    cubeInit(gl);
    render();
});

