function init() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // 创建一个three.js的场景,里面包含物体，摄像头，灯光
    // 场景是一个容器，主要用于保存、跟踪所要渲染的物体和使用的光源
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    // 创建一个摄像头，决定我们从哪里看
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    // 创建一个绘图层，并设置大小
    // 使用电脑显卡来绘制场景
    var renderer = new THREE.WebGLRenderer();
    // 设置场景的背景色
    renderer.setClearColor(new THREE.Color(0x000000));
    // 设置场景的大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    // show axes in the screen
    // 创建一个三角坐标系，并这是轴线的粗细值为20
    var axes = new THREE.AxesHelper(20);
    // 将轴添加到场景中
    scene.add(axes);

    // create the ground plane
    // 创建一个平面几何  以及 基础网格材质
    // 定义平面的大小 宽度60 高度20 
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    // 设置基本材质 以及颜色
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    // 将大小和外观组合进Mesh对象并赋值给平面变量
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    // 旋转并设置到平面
    // 先将平面围绕X轴旋转90度
    plane.rotation.x = -0.5 * Math.PI;
    // 使用position属性定义其在场景中的位置
    plane.position.set(15, 0, 0);

    // add the plane to the scene
    // 添加平面对象到平面
    scene.add(plane);

    // create a cube
    // 创建一个立方体
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    // 设置几何体的位置
    cube.position.set(-4, 3, 0);

    // add the cube to the scene
    // 添加几何体到这个屏幕
    scene.add(cube);

    // create a sphere
    // 创建一个圆柱体
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777FF,
        wireframe: true
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    // 设置圆柱体的位置
    sphere.position.set(20, 4, 2);

    // add the sphere to the scene
    // 添加圆柱体到这个屏幕
    scene.add(sphere);

    // position and point the camera to the center of the scene
    // 设置并指出摄像头到这个屏幕的中心
    camera.position.set(-30, 40, 30);
    //指向场景中心，默认指向（0，0，0）位置。
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    // 添加外层以及绘制
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // render the scene
    // 绘制页面
    renderer.render(scene, camera);
}