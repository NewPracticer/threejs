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
  // 这种唯一一种既可以在物体表面实现高光效果的材质。
  // 它既可以模拟塑料质感，也可以在一定程度上模拟金属质感
  // color 颜色 这是材质的环境色
  // emissive 自发光 材质自发光的颜色
  // specular 高光颜色 该属性指定该材质的光亮程度及高光部分的颜色
  // 如果将它设置成与color 相同的颜色,将会得到一个更加类似金属的材质
  // 如果将它设置成灰色，材质将会变得更像塑料
  // shiness 高光度。 该属性指定物体表面镜面高光部分的轮廓的清晰程序。越光滑的表面，高光部分越清晰,
  // 反之越模糊，该属性的默认值为30
  var step = 0;
  var material = new THREE.MeshPhongMaterial({color: 0x7777ff})
  var controls = new function () {
    this.color = material.color.getStyle();
    this.emissive = material.emissive.getStyle();
    this.specular = material.specular.getStyle();
  };

  var gui = new dat.GUI();
  
  addBasicMaterialSettings(gui, controls, material);
  addMeshSelection(gui, controls, material, scene);
  var spGui = gui.addFolder("THREE.MeshPhongMaterial");
  spGui.addColor(controls, 'color').onChange(function (e) {
    material.color.setStyle(e)
  });
  spGui.addColor(controls, 'emissive').onChange(function (e) {
    material.emissive = new THREE.Color(e);
  });
  spGui.addColor(controls, 'specular').onChange(function (e) {
    material.specular = new THREE.Color(e);
  });
  spGui.add(material, 'shininess', 0, 100, )
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