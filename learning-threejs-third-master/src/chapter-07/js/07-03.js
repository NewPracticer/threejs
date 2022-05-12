function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var scene = new THREE.Scene();

  camera.position.set(20, 0, 150);

  var cloud;

  var controls = new function () {
    //map属性
    // 通过该属性可以在粒子上应用某种材质
    // size  指定粒子的大小
    this.size = 4;
    // 如果该属性为true,那么粒子在渲染时会根据opacity属性的值来确定其透明度
    this.transparent = true;
    // 该属性与transparent属性一起使用，用来设置粒子的不透明度，默认值为1
    this.opacity = 0.6;
    this.vertexColors = true;
    // 粒子系统中所有粒子的颜色。
    // 将vertexColors属性设置为true,并且通过颜色属性
    // 指定了几何体的颜色来覆盖该属性
    this.color = 0xffffff;
    //几何体的颜色数组也有值，那么使用颜色数组中的值。默认值为NoColors
    this.vertexColor = 0x00ff00;
    // 如果该属性设置为false，那么所有粒子都将拥有相同的尺寸
    // 无论它们距离摄像机有多远，如果设置为true，粒子的大小取决鳄鱼漆距离摄像机的远近，默认值为true
    this.sizeAttenuation = true;
    this.rotate = true;
    // blending 该属性指定渲染粒子时的融合模式
    // fog 该属性决定粒子是否受场景中的雾化效果影响，默认为true
    this.redraw = function () {

      console.log(controls.color)

      if (scene.getObjectByName("particles")) {
        scene.remove(scene.getObjectByName("particles"));
      }
      createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors,
        controls.sizeAttenuation, controls.color, controls.vertexColor);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.add(controls, 'vertexColors').onChange(controls.redraw);
  
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.addColor(controls, 'vertexColor').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
  gui.add(controls, 'rotate');

  controls.redraw();
  render();

  function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, colorValue, vertexColorValue) {
    
    var geom = new THREE.Geometry();
    var material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      vertexColors: vertexColors,

      sizeAttenuation: sizeAttenuation,
      color: new THREE.Color(colorValue)
    });


    var range = 500;
    for (var i = 0; i < 15000; i++) {
      var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2,
        Math.random() * range - range / 2);
      geom.vertices.push(particle);
      var color = new THREE.Color(vertexColorValue);
      var asHSL = {};
      color.getHSL(asHSL);
      color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
      geom.colors.push(color);

    }

    cloud = new THREE.Points(geom, material);
    cloud.name = "particles";
    scene.add(cloud);
  }

  var step = 0;

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    if (controls.rotate) {
      step += 0.01;
      cloud.rotation.x = step;
      cloud.rotation.z = step;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}