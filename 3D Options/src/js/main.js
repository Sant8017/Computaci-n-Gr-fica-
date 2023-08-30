var scene = null,
    camera = null,
    renderer = null,
    control = null;

const size = 10;
const divisions = 10;

function generateObject(objectType) {
    switch (objectType) {
        case 'cube':
            createObject(new THREE.BoxGeometry(2, 2, 2), 0x00ff00);
            break;
        case 'torus':
            createObject(new THREE.TorusGeometry(1.1, 0.5, 5, 10), 0xffff00);
            break;
        case 'cone':
            createObject(new THREE.ConeGeometry(1, 5, 8), 0x0000ff);
            break;

    }
}

function createObject(geometry, color) { // crear el objeto (la figura con la geometría y el color seleccionado)
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true }); // se crea el material con el color y el efecto de alambre (wireframe)
    const newObject = new THREE.Mesh(geometry, material); // se crrea el objeto 3D teniendo en ceunta la geomtria y el material.

    // se crean las coodernadas aleatorias para la posición del objeto en la escena / crear
    const X = Math.random() * 10 - 5;
    const Y = Math.random() * 10 - 5;
    const Z = Math.random() * 10 - 5;

    newObject.position.set(X, Y, Z); // se establece la posición del objeto en la escena 

    // se crean las velocidades de rotación aleatorias.
    const rotationSpeedX = Math.random() * 0.05 - 0.025;
    const rotationSpeedY = Math.random() * 0.05 - 0.025;
    const rotationSpeedZ = Math.random() * 0.05 - 0.025;

    newObject.rotationSpeed = {rotationSpeedX, rotationSpeedY, rotationSpeedZ}; // se guardan dichas velocidades para ser utilizadas en la animación

    scene.add(newObject); // se agrega dicho objeto a la escena
}

function clearObjects() { 
    const objectsToRemove = []; // se crea el areglo vacio para agregar los objetos a borrar
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) { // este if permite que, si son instancias de (intanceof) los objetos 3D (THREE.Mesh) los agrega en el arreglo objectsToRemove
            objectsToRemove.push(object);
        }
    });

    objectsToRemove.forEach((object) => { //permite borar todos los objetos de la escena.
        scene.remove(object);
    });
}

function startScene(){
    scene = new THREE.Scene(); // se crea la escena
    scene.background = new THREE.Color(0x2E3239); // se le da color al fondo de la escena
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // perspectiva de la camara

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('app')}); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    control = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 7, 3);
    control.update();

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    animate(); // se llama la funcion animate para hacer la animación
}

function animate(){
    requestAnimationFrame(animate); 
    control.update();
    renderer.render(scene, camera);

    scene.traverse((object) => { //recorre (travers) todos los objetos de la escena
        if (object instanceof THREE.Mesh && object.rotationSpeed) { // si un objeto es THREE.Mesh y tiene datos de userData (el arreglo anterior), se le aplican las rotaciones establecidas en userData.
            object.rotation.x += object.rotationSpeed.rotationSpeedX;
            object.rotation.y += object.rotationSpeed.rotationSpeedY;
            object.rotation.z += object.rotationSpeed.rotationSpeedZ;
        }
    });
}

window.onload = startScene; // al mommento de abrir la ventana, se crea la escena
