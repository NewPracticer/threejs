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
    // 设置圆柱顶部的尺寸
    this.radiusTop = 20;
    // 设置圆柱底部的尺寸
    this.radiusBottom = 20;
    // 设置圆柱的高度
    this.height = 20;
    // 沿圆柱的半径分成多少段。默认值为8.分段数越多。意味着圆柱越光滑
    this.radialSegments = 8;
    // 沿圆柱的高度分成多少段。默认值为1，分段数越多,意味着面越多
    this.heightSegments = 8;
    // 指定网格的顶部和底部是否封闭
    this.openEnded = false;
    // 决定了在x轴上开始圆柱的位置
    this.thetaStart = 0;
    // 决定了有多少圆柱面被绘制
    this.thetaLength = 2 * Math.PI;
    
    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return new THREE.CylinderGeometry(controls.radiusTop, controls.radiusBottom,
                  controls.height, controls.radialSegments, controls.heightSegments, controls.openEnded,
                  controls.thetaStart, controls.thetaLength
                )
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'radiusTop', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'radiusBottom', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'radialSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'openEnded').onChange(controls.redraw);
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