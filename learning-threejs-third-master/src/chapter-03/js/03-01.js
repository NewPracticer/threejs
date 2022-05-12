function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // add ambient lighting
  // 这是一个基本光源，该光源的颜色将会叠加到场景现有物体的颜色上
  // 该光源并没有特别的来源方向，并且不会生成阴影
  // 会将场景中的所有物体渲染为相同的颜色
  var ambientLight = new THREE.AmbientLight("#606008", 1);
  scene.add(ambientLight);

  // add spotlight for the shadows
  // 这种光源有聚光的效果，类似台灯、天花板上的吊灯或者手电筒，这种光源可以投射阴影
  var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.position.set(-30, 40, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // PointLight 从特定的一点向所有方向发射光线
  // SpotLight 从特定的一点以锥形发射光线
  // DirectionLight 不是从单个点发射光线，而是从二维平面发射光线，光线彼此平行

  // add a simple scene
  addHouseAndTree(scene)

  // add controls
  var controls = setupControls();

  // call the render function
  render();

  function render() {
    stats.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function setupControls() {
    var controls = new function () {
      this.intensity = ambientLight.intensity;
      this.ambientColor = ambientLight.color.getStyle();
      this.disableSpotlight = false;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'intensity', 0, 3, 0.1).onChange(function (e) {
      ambientLight.color = new THREE.Color(controls.ambientColor);
      ambientLight.intensity = controls.intensity;
    });
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(controls.ambientColor);
      ambientLight.intensity = controls.intensity;
    });
    gui.add(controls, 'disableSpotlight').onChange(function (e) {
      spotLight.visible = !e;
    });

    return controls;
  }
}