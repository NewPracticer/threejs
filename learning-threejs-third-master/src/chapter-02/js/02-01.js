function init() {

    var stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // three.scene对象有时被称为场景图，可以用来保存所有图形场景的必须信息
    // 在three.js中，three.scene保存所有对象，光源和渲染所需的其他对象
    // 场景图顾名思义，不仅仅是一个对象数组，还包含了场景图树形结构中的所有节点
    // 每个你添加到three.js场景的对象，包括three.scene本身，都是继承自一个名为three.object3d的对象
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    // 摄像机决定屏幕上哪些东西需要渲染
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    // create a render and set the size
    // 基于摄像机和场景提供的信息，调用底层图形API执行真正的场景绘制工作
    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create the ground plane
    // 添加一个平面
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    // 添加一个环境光
    var ambientLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    // 光源决定材质如何显示以及用于产生阴影
    // 添加一个聚光灯光源
    var spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // call the render function
    var step = 0;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;
        // 移除立方体
        this.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            // three.js将子对象保存在数组中，最新的对象保存在数组的最后
            // 我们可以使用Three.scene对象的children属性来获取最后一个添加到场景中的对象
            // children属性将场景中的所有对象存储为数组
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };
        // 添加立方体
        this.addCube = function () {

            var cubeSize = Math.ceil((Math.random() * 3));
            // 一个新的 BoxGeometry 对象就会被创建，它的长、宽和高都是一个从1到3的随机数
            // 除了尺寸都是随机的，这个方块的颜色和位置也是随机
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            // 方块的名字是在cube后面加上当前场景中对象的数量，给对象命名
            cube.name = "cube-" + scene.children.length;


            // position the cube randomly in the scene

            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };

        this.outputObjects = function () {
            console.log(scene.children);
        }
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    // attach them here, since appendChild needs to be called first
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    render();
    
    function render() {

        trackballControls.update(clock.getDelta());
        stats.update();

        // rotate the cubes around its axes
        // 可以将一个方法作为参数传递traverse()方法
        // 这个传递来的方法将会在每个子对象上执行，对象存储的对象树
        // 直到遍历完场景树中的所有对象为止
        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}