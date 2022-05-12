function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;
  initDefaultLighting(scene);

  // setup the control parts of the ui
  var controls = new function () {
    var self = this;
    this.curveSegments = 12;

    // the start geometry and material. Used as the base for the settings in the control UI
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        // 用来创建网格的几何体
        return new THREE.ShapeGeometry(drawShape(), self.curveSegments).center();
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'curveSegments', 1, 100, 1).onChange(controls.redraw);
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

function drawShape() {

  // create a basic shape
  // 可以创建一个或多个Three.shape对象。
  // 可以传入单个three.shape对象或者一个three.shape对象数组
  // options 
  // -- curveSegments 确定从图形创建的曲线的平滑程度
  // -- material 用于为指定图形创建的面的materialIndex属性 
  // ----当把three.meshFaceMaterial 和此几何体一起使用时，materialIndex属性决定传入的材质中的哪些材质用于传入图形的面
  // -- UVGenerator
  // ----当对材质使用纹理时，UV映射决定纹理的哪个部分用于特定的面
  // ---- 使用UVGenerator属性，可以传入自己的对象，这将为传入的图形创建的面创建UV设置
  var shape = new THREE.Shape();

  // startpoint
  // 该函数将绘图点移动到指定的x,y坐标处
  shape.moveTo(10, 10);

  // straight line upwards
  // 该函数从当前位置绘制一条线知道指定的x和y坐标处
  shape.lineTo(10, 40);

  // the top of the figure, curve to the right
  // 根据提供的参数绘制一条曲线。该曲线的绘制基于两个定义曲线的坐标
  // 起始点是路径的当前位置
  shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

  // spline back down
  // 该函数沿着提供的坐标集合绘制一条光滑曲线，这个参数应该是
  // 一个three.vetor2对象数组。起始点是路径的当前位置
  shape.splineThru(
    [new THREE.Vector2(32, 30),
      new THREE.Vector2(28, 20),
      new THREE.Vector2(30, 10),
    ]);
  // arc 函数
  // 该函数用来画圆。圆弧起始于路径的当前位置。
  // aX 和 aY用来指定与当前位置的偏移量。
  // aRadius设置圆的大小，而aStartAngle 和 aEndAngel用来定义欢呼要画多长
  // 布尔属性 aClockwise决定这段圆弧是顺时针画还是逆时针画

  // curve at the bottom
  shape.quadraticCurveTo(20, 15, 10, 10);

  // add 'eye' hole one
  var hole1 = new THREE.Path();
  // ellipse 函数
  // 参考arc函数。通过ellipse函数，可以分别制定x轴和y轴半径
  // absEllipse
  // 参数ellipse函数。其位置是绝对位置，而不是相对于当前的位置
  hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
  shape.holes.push(hole1);

  // add 'eye hole 2'
  var hole2 = new THREE.Path();
  hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
  // holes
  // holes属性包含一个Three.shape对象数组。这个数组中的每一个对象会渲染为一个孔
  shape.holes.push(hole2);

  // add 'mouth'
  var hole3 = new THREE.Path();
  // 参数arc函数  其位置是绝对位置，而不是相当于当前的位置
  hole3.absarc(20, 16, 2, 0, Math.PI, true);
  shape.holes.push(hole3);

  // return the shape
  return shape;
}
