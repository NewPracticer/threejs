function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  // create a render and set the size
  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x000000));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;
  
  var canvasRenderer = new THREE.CanvasRenderer();
  canvasRenderer.setSize(window.innerWidth, window.innerHeight);
  renderer = webGLRenderer;

  var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
  var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({
    color: 0x777777
  }));
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -20;
  scene.add(groundMesh);

  var sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
  var cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
  var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

  //材质结合Three.Geometry对象，可以构成Three.Mesh对象
  //材质就像物体的皮肤，决定了几何体的外表
  // MeshBasicMaterial 网络基础材质 用于给几何体赋予一种简单的颜色 可显示几何体的线框
  // MeshDepthMaterial 网络深度材质 使用从摄像机到网格的距离来决定如何给网格上色
  // MeshNormalMaterial 网络法向材质 根据法向量计算物体表面的颜色
  // MeshLamberMaterial 网络Lambert材质 这是一种考虑光照影响的材质，用于创建暗淡的、不光亮的物体
  // MeshPhongMaterial 网络Phong材质 这是一种考虑光照影响的材质，用于创建光亮的物体
  // MeshStandardMaterial 网络标准材质 它能够计算出表面与光线的正确互动关系，从而使渲染出的物体看起来更加真实
  // MeshPhysicalMaterial 网络物理材质 它为光线反射计算模型提供了更多的控制
  // MeshToonMaterial 网络卡通材质 这是MeshPhongMaterial的扩展材质，它使得物体渲染更加卡通化
  // shadowMaterial 阴影材质 这是一个专门用于接收阴影图的特殊材质。
  // shaderMaterial 着色器材质 这种材质允许使用自定义的着色器程序，直接控制顶点的放置凡是以及像素的着色方式
  // lineBasicMaterial 直线基础材质 用来创建着色的直线
  // LineDashMaterial 虚线材质 允许创建出一种虚线的效果
  // Material 的基础属性
  // id : 标识符 
  // uuid : 这是生成的唯一ID 
  // name : 可以通过这个属性赋予材质名称
  // opacity: 定义物体的透明度。与transparent属性一起使用。从0到1
  // transparent 是否透明。overdraw 过度描绘。 visible 是否可见
  // side： 侧面 。 可以定义几何体的哪一面使用材质
  // needsupdate: 是否更新。
  // colorwrite： 是否输出颜色。 该物体实际不可见，其他物体被它挡住的部分也不可见
  // flatshading: 平面着色。为true时，在两个相邻但不共面的三角形之间，光照会因为生硬过度而产生棱角。为false时，则会产生非常平滑的过渡效果
  
  var meshMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    name: 'Basic Material',
    flatShading: true
  });

  var sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
  var cube = new THREE.Mesh(cubeGeometry, meshMaterial);
  var plane = new THREE.Mesh(planeGeometry, meshMaterial);

  // position the sphere
  sphere.position.x = 0;
  sphere.position.y = 3;
  sphere.position.z = 2;


  cube.position = sphere.position;
  plane.position = sphere.position;


  // add the sphere to the scene
  scene.add(cube);

  // position and point the camera to the center of the scene
  camera.position.x = -20;
  camera.position.y = 50;
  camera.position.z = 40;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function
  var step = 0;
  var oldContext = null;

  var controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;

    this.color = meshMaterial.color.getStyle();
    this.selectedMesh = "cube";

    this.switchRenderer = function () {
      if (renderer instanceof THREE.WebGLRenderer) {
        renderer = canvasRenderer;
        document.getElementById("webgl-output").innerHTML = "";
        document.getElementById("webgl-output").appendChild(renderer.domElement);
      } else {
        renderer = webGLRenderer;
        document.getElementById("webgl-output").innerHTML = "";
        document.getElementById("webgl-output").appendChild(renderer.domElement);
      }
    }
  };

  var gui = new dat.GUI();
  var selectedMesh = cube;
  
  addBasicMaterialSettings(gui, controls, meshMaterial);

  var spGui = gui.addFolder("THREE.MeshBasicMaterial");
  spGui.addColor(controls, 'color').onChange(function (e) {
    meshMaterial.color.setStyle(e)
  });
  spGui.add(meshMaterial, 'wireframe');
  spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);
  spGui.add(meshMaterial, 'wireframeLinejoin', ['round', 'bevel', 'miter']).onChange(function (e) {
    meshMaterial.wireframeLinejoin = e
  });
  spGui.add(meshMaterial, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(function (e) {
    meshMaterial.wireframeLinecap = e
  });

  loadGopher(meshMaterial).then(function(gopher) {
    gopher.scale.x = 4;
    gopher.scale.y = 4;
    gopher.scale.z = 4;
    gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher"]).onChange(function (e) {

      scene.remove(plane);
      scene.remove(cube);
      scene.remove(sphere);
      scene.remove(gopher);
  
      switch (e) {
        case "cube":
          scene.add(cube);
          selectedMesh = cube;
          break;
        case "sphere":
          scene.add(sphere);
          selectedMesh = sphere;
          break;
        case "plane":
          scene.add(plane);
          selectedMesh = plane;
          break;
        case "gopher":
          scene.add(gopher);
          selectedMesh = gopher;
          break;
      }
    });
  });


  gui.add(controls, 'switchRenderer');

  render();

  function render() {
    stats.update();

    selectedMesh.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}