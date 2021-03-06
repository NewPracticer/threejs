function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;
  initDefaultLighting(scene);

  // setup the control parts of the ui
  var controls = new function () {
    var self = this;

    // the start geometry and material. Used as the base for the settings in the control UI
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;
    
    var baseGeom = new THREE.BoxGeometry(4, 10, 10, 4, 4, 4);
    // 该属性定义长方体的宽度。所谓宽度是长方体沿x轴方向的长度
    this.width = baseGeom.parameters.width;
    // 该属性定义长方体的高度。所谓高度是长方体沿y轴方向的长度
    this.height = baseGeom.parameters.height;
    // 该属性定义长方体的深度。所谓深度是长方体沿z轴方向的长度
    this.depth = baseGeom.parameters.depth;
    // 该属性定义是沿x轴方向将面分成多少分。默认值为1
    this.widthSegments = baseGeom.parameters.widthSegments;
    // 该属性定义是沿y轴方向将面分成多少份，默认值为1
    this.heightSegments = baseGeom.parameters.heightSegments;
    // 该属性定义是沿z轴方向将面分成多少份，默认值为1
    this.depthSegments = baseGeom.parameters.depthSegments;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return new THREE.BoxGeometry(controls.width, controls.height, controls.depth, Math.round(
                   controls.widthSegments), Math.round(controls.heightSegments), Math.round(
                   controls.depthSegments));
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'width', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'depth', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'depthSegments', 0, 10).onChange(controls.redraw);
  // add a material section, so we can switch between materials
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)

  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})
  gui.add(controls, 'groundPlaneVisible').onChange(function(e) {groundPlane.material.visible = e})

  // initialize the first redraw so everything gets initialized
  controls.redraw();
  var step = 0;
  // call the render function
  render();
  function render() {
    stats.update();
    controls.mesh.rotation.y = step+=0.01
    controls.mesh.rotation.x = step
    controls.mesh.rotation.z = step
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
