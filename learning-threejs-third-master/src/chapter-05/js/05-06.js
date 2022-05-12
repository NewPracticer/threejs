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

    var baseSphere = new THREE.SphereGeometry(4, 10, 10);
    this.radius = baseSphere.parameters.radius;
    // 该属性指定竖直方向上的分段数。段数越多，球体的表面越光滑。默认值为8，最小值是3
    this.widthSegments = baseSphere.parameters.widthSegments;
    // 该属性为水平方向上的分段数。段数越多，球体的表面越光滑，默认值为6，最小值是2
    this.heightSegments = baseSphere.parameters.heightSegments;
    //该属性用来指定从x轴的什么地方开始绘制球体。取值范围是 0 到 2 PI
    this.phiStart = 0;
    //该属性用来指定球体从phistart开始画多少 2PI是整球
    this.phiLength = Math.PI * 2;
    // 该属性用来指定从y轴的什么地方开始绘制球体
    this.thetaStart = 0;
    // 该属性用来指定球体从thetaStart开始画多少
    this.thetaLength = Math.PI;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return new THREE.SphereGeometry(controls.radius, controls.widthSegments, controls.heightSegments,
                  controls.phiStart, controls.phiLength, controls.thetaStart, controls.thetaLength);
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'widthSegments', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);
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
