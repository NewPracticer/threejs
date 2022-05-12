
function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  addLargeGroundPlane(scene).position.y = -10;

  // setup the control parts of the ui
  var controls = new function () {
    var self = this;

    // the start geometry and material. Used as the base for the settings in the control UI
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;
    // 该属性指定多面体的大小，默认值为1
    this.radius = 10;
    // 通过这个属性，可以给这个多面体添加额外的细节
    // 如果设置1，这个多面体上的每个三角形都会分成4个小三角形
    // 如果设为2，那4个小三角形中的每一个都将会继续分成4个小三角形。
    this.detail = 0;
    this.type = 'Icosahedron';
    
    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        var polyhedron;
        switch (controls.type) {
                  case 'Icosahedron':
                    // 可以创建出一个有20个相同三角形面的多面体
                    polyhedron = new THREE.IcosahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Tetrahedron':
                    // 这个多面体只包含由4个点点创建的4个三角形面
                    // 创建的一个多面体
                    polyhedron = new THREE.TetrahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Octahedron':
                    // 实现八面体
                    polyhedron = new THREE.OctahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Dodecahedron':
                    // 实现十二面体
                    polyhedron = new THREE.DodecahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Custom':
                    // 设置构成多面体的顶点
                    var vertices = [
                      1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
                    ];
                    // 设置由vertices创建出的面
                    var indices = [
                      2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
                    ];
                    // 
                    polyhedron = new THREE.PolyhedronGeometry(vertices, indices, controls.radius, controls.detail);
                    break;
                }

        return polyhedron
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
  gui.add(controls, 'detail', 0, 3).step(1).onChange(controls.redraw);
  gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(controls.redraw);


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