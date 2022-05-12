function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var cubeAndSphere = addDefaultCubeAndSphere(scene);
  var cube = cubeAndSphere.cube;
  var sphere = cubeAndSphere.sphere;
  var plane = addGroundPlane(scene);
  

  // add subtle ambient lighting
  var ambiColor = "#1c1c1c";
  var ambientLight = new THREE.AmbientLight(ambiColor);
  scene.add(ambientLight);

  // add spotlight for a bit of light
  var spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 30, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);

  // add target and light
  var target = new THREE.Object3D();
  target.position = new THREE.Vector3(5, 0, 0);

  var spotLight = new THREE.SpotLight("#ffffff");
  // decay 衰减 光源强度随着离开光源的距离而衰减的速度。该值为2时更接近现实世界中的效果，默认值为1.
  // 只有当webGLRender的属性physicallyCorrectLights被设置为启用时，decay属性才有效
  spotLight.position.set(-40, 60, -10);
  // 设置为true,这个光源就会生成阴影
  spotLight.castShadow = true;
  // 从距离光源的哪一个位置开始生成阴影。默认值为50
  spotLight.shadow.camera.near = 1;
  // 到距离光源的哪一个位置可以生成阴影，默认值为5000
  spotLight.shadow.camera.far = 100;
  spotLight.target = plane;
  // 光源照射的距离。默认值为0，这意味着光线强度不会随着距离增加而减弱
  spotLight.distance = 0;
  // 光源发射出的光束的宽度，单位是弧度，默认位置为Math.PI/3
  spotLight.angle = 0.4;
  // 用于生成阴影的视场大小，默认值为50
  spotLight.shadow.camera.fov = 120;
  scene.add(spotLight);
  var debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);

  var pp = new THREE.SpotLightHelper(spotLight)
  scene.add(pp)

  // add a small sphere simulating the pointlight
  var sphereLight = new THREE.SphereGeometry(0.2);
  var sphereLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xac6c25
  });
  var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;

  sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
  scene.add(sphereLightMesh);

  // for controlling the rendering
  var step = 0;
  var invert = 1;
  var phase = 0;

  var controls = setupControls();
  render();

  function render() {
    stats.update();
    // rotate the cube around its axes
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    // bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    // move the light simulation
    if (!controls.stopMovingLight) {
      if (phase > 2 * Math.PI) {
        invert = invert * -1;
        phase -= 2 * Math.PI;
      } else {
        phase += controls.rotationSpeed;
      }
      sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
      sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
      sphereLightMesh.position.y = 15;

      if (invert < 0) {
        var pivot = 14;
        sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
      }
      // 光源在场景中的位置
      spotLight.position.copy(sphereLightMesh.position);
    }

    pp.update();
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function setupControls() {
    var controls = new function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.pointColor = spotLight.color.getStyle();
      // 设置光源照射的强度。默认值为1
      this.intensity = 1;
      this.distance = 0;
      this.angle = 0.1;
      this.shadowDebug = false;
      this.castShadow = true;
      // 目标。使用点光源时，它的指向很重要。使用target属性，你可以将three.spotlight光源只想场景中
      //特定对象或位置。注意，此属性需要一个three.object3d对象。
      this.target = "Plane";
      this.stopMovingLight = false;
      // 半影区 该属性设置聚光灯的锥形照明区域在其他区域边缘附近的平滑衰减速度。
      // 取值范围在0到1之间，默认值为0
      this.penumbra = 0;
    };

    var gui = new dat.GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function (e) {
      spotLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
      spotLight.angle = e;
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
      spotLight.intensity = e;
    });

    gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
      spotLight.penumbra = e;
    });

    gui.add(controls, 'distance', 0, 200).onChange(function (e) {
      spotLight.distance = e;
    });

    gui.add(controls, 'shadowDebug').onChange(function (e) {
      if (e) {
        scene.add(debugCamera);
      } else {
        scene.remove(debugCamera);
      }
    });

    gui.add(controls, 'castShadow').onChange(function (e) {
      spotLight.castShadow = e;
    });

    gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
      switch (e) {
        case "Plane":
          spotLight.target = plane;
          break;
        case "Sphere":
          spotLight.target = sphere;
          break;
        case "Cube":
          spotLight.target = cube;
          break;
      }

    });

    gui.add(controls, 'stopMovingLight').onChange(function (e) {
      stopMovingLight = e;
    });

    return controls;
  }

}