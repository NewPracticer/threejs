function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();


  var cubeGeometry = new THREE.BoxGeometry(20, 20, 20);

  var meshMaterial1 = createMaterial("vertex-shader",
    "fragment-shader-1");
  var meshMaterial2 = createMaterial("vertex-shader",
    "fragment-shader-2");
  var meshMaterial3 = createMaterial("vertex-shader",
    "fragment-shader-3");
  var meshMaterial4 = createMaterial("vertex-shader",
    "fragment-shader-4");
  var meshMaterial5 = createMaterial("vertex-shader",
    "fragment-shader-5");
  var meshMaterial6 = createMaterial("vertex-shader",
    "fragment-shader-6");


  var material = [meshMaterial1, meshMaterial2, meshMaterial3, meshMaterial4, meshMaterial5, meshMaterial6];
  var cube = new THREE.Mesh(cubeGeometry, material);

  // add the sphere to the scene
  scene.add(cube);

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // call the render function
  var step = 0;
  var oldContext = null;

  var controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;

    this.opacity = meshMaterial1.opacity;
    this.transparent = meshMaterial1.transparent;

    this.visible = meshMaterial1.visible;
    this.side = "front";

    this.wireframe = meshMaterial1.wireframe;
    this.wireframeLinewidth = meshMaterial1.wireframeLinewidth;

    this.selectedMesh = "cube";

    this.shadow = "flat";

  };


  render();

  function render() {
    stats.update();

    cube.rotation.y = step += 0.01;
    cube.rotation.x = step;
    cube.rotation.z = step;

    cube.material.forEach(function (e) {
      e.uniforms.time.value += 0.01;
    });


    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function createMaterial(vertexShader, fragmentShader) {
    var vertShader = document.getElementById(vertexShader).innerHTML;
    var fragShader = document.getElementById(fragmentShader).innerHTML;

    var attributes = {};
    // 统一值
    var uniforms = {
      time: {
        type: 'f',
        value: 0.2
      },
      scale: {
        type: 'f',
        value: 0.2
      },
      alpha: {
        type: 'f',
        value: 0.6
      },
      resolution: {
        type: "v2",
        value: new THREE.Vector2()
      }
    };

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;

    var meshMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      // 它会在几何体的每一个顶点上执行。可以用这个着色器通过改变顶点的位置来对几何体进行变换
      vertexShader: vertShader,
      // 它会在几何体的每一个片段上执行。在vertexShader里，我们会返回这个特定片段应该显示的颜色
      fragmentShader: fragShader,
      
      transparent: true

    });


    return meshMaterial;
  }
}