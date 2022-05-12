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
  // 这种材质提供了对反光度的更多控制
  // clearCoat(清漆) 该属性控制物体表面清漆涂层效果的明显程度，属性值越高，则清漆涂层越厚。取值范围在0到1之间。默认值为0
  // clearCoatRoughness 该属性控制物体表面清漆涂层的粗糙程度。粗糙程度越高，漫反射越明显。取值范围在0到1之间。默认值为0
  // reflectivity 反光度 该属性用于控制非金属表面的反光度。因此当metalness 为1 或接近1时该属性的作用很小。取消范围在0到1之间。默认值为0.5
  var step = 0;
  var material = new THREE.MeshPhysicalMaterial({color: 0x7777ff})
  var controls = new function () {
    this.color = material.color.getStyle();
    this.emissive = material.emissive.getStyle();
  };

  var gui = new dat.GUI();
  
  addBasicMaterialSettings(gui, controls, material);
  addMeshSelection(gui, controls, material, scene);
  var spGui = gui.addFolder("THREE.MeshPhysicalMaterial");
  spGui.addColor(controls, 'color').onChange(function (e) {
    material.color.setStyle(e)
  });
  spGui.addColor(controls, 'emissive').onChange(function (e) {
    material.emissive = new THREE.Color(e);
  });
  spGui.add(material, 'metalness', 0, 1, 0.01);
  spGui.add(material, 'roughness', 0, 1, 0.01);
  spGui.add(material, 'clearCoat', 0, 1, 0.01);
  spGui.add(material, 'clearCoatRoughness', 0, 1, 0.01);
  spGui.add(material, 'reflectivity', 0, 1, 0.01);
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