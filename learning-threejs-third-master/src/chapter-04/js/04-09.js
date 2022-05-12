function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  addLargeGroundPlane(scene);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-0, 30, 60);
  spotLight.castShadow = true;
  spotLight.intensity = 0.6;
  scene.add(spotLight);

  // call the render function
  // 这种材质使用更加正确的物理计算来决定物体表面如何与场景中的光源互动
  // metalness：金属感程度。该属性控制物体表面的金属感程度。0代表完全塑料质感，1代表完全金属质感，默认值为0.5
  // roughness 粗糙程度。该属性控制物体表面的粗糙程度。在视觉上，它决定表面对入射光的漫反射程度。默认值为0.5
  
  var step = 0;
  var material = new THREE.MeshStandardMaterial({color: 0x7777ff})
  var controls = new function () {
    this.color = material.color.getStyle();
    this.emissive = material.emissive.getStyle();
  };

  var gui = new dat.GUI();
  
  addBasicMaterialSettings(gui, controls, material);
  addMeshSelection(gui, controls, material, scene);
  var spGui = gui.addFolder("THREE.MeshStandardMaterial");
  spGui.addColor(controls, 'color').onChange(function (e) {
    material.color.setStyle(e)
  });
  spGui.addColor(controls, 'emissive').onChange(function (e) {
    material.emissive = new THREE.Color(e);
  });
  spGui.add(material, 'metalness', 0, 1, 0.01);
  spGui.add(material, 'roughness', 0, 1, 0.01);
  spGui.add(material, 'wireframe');
  spGui.add(material, 'wireframeLinewidth', 0, 20);

  camera.lookAt(controls.selected.position);
  render();

  function render() {
    stats.update();

    if (controls.selected) controls.selected.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}