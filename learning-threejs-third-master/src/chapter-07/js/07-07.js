function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(20, 40, 110));
  camera.lookAt(new THREE.Vector3(20, 30, 0));

  var system1;
  var cloud;

  var controls = new function () {
    this.size = 3;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;

    this.sizeAttenuation = true;

    this.redraw = function () {
      scene.remove(scene.getObjectByName("particles1"));

      createPointCloud(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation,
        controls.color);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

  controls.redraw();
  render();

  function createPointCloud(size, transparent, opacity, sizeAttenuation, color) {

    // 加载外部雨滴纹理
    var texture = new THREE.TextureLoader().load("../../assets/textures/particles/raindrop-3.png");
    var geom = new THREE.Geometry();

    var material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      map: texture,
      // 在画新像素时背景像素的颜色会被添加到新像素上
      // 对于我们的雨滴纹理来说，这意味着黑色背景不会显示出来
      // 另一种合理的方式是将纹理的黑色背景定义成透明的背景
      blending: THREE.AdditiveBlending,
      sizeAttenuation: sizeAttenuation,
      color: color
    });


    var range = 40;
    for (var i = 0; i < 1500; i++) {
      var particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        // Math.random() * range - range / 2
        1 + (i/100)
      )
      // 第二个属性定义雨滴以多快的速度落下
      particle.velocityY = 0.1 + Math.random() / 5;
      // 第一个属性定义粒子如何水平移动
      particle.velocityX = (Math.random() - 0.5) / 3;
      geom.vertices.push(particle);
    }

    cloud = new THREE.Points(geom, material);
    cloud.sortParticles = true;
    cloud.name = "particles1"

    scene.add(cloud);
  }

  function render() {
    stats.update();
    var vertices = cloud.geometry.vertices;
    vertices.forEach(function (v) {
      v.y = v.y - (v.velocityY);
      v.x = v.x - (v.velocityX);
      // 对于每个粒子，我们用velocityX 和 velocityY来改变它们的当前位置。
      // 最后两行代码用来保证粒子处于我们定义的范围内
      // 如果v.y的位置低于0，我们就把雨滴放回顶部
      if (v.y <= 0) v.y = 60;
      // 如果v.x位置到达任何一条边界，我们就反转横向速度，让雨滴反弹
      if (v.x <= -20 || v.x >= 40) v.velocityX = v.velocityX * -1;
    });
    cloud.geometry.verticesNeedUpdate = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}