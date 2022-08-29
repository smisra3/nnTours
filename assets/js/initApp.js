
let scene, camera, renderer;
var raycaster, mouse = { x: 0, y: 0 };
let tweenOutside;
const porchImages = ['outdoor_posx.jpg', 'outdoor_negx.jpg', 'outdoor_posy.jpg', 'outdoor_negy.jpg', 'outdoor_posz.jpg', 'outdoor_negz.jpg'];
const porchCloseUpImages = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'];

const officeTourStart = ['1-posx.jpeg', '1-negx.jpeg', '1-posy.jpeg', '1-negy.jpeg', '1-posz.jpeg', '1-negz.jpeg'];
const officeTourNextStep = ['2-posx.jpeg', '2-negx.jpeg', '2-posy.jpeg', '2-negy.jpeg', '2-posz.jpeg', '2-negz.jpeg'];

const homeTourStart = ['3-posx.jpeg', '3-negx.jpg', '3-posy.jpg', '3-negy.jpg', '3-posz.jpg', '3-negz.jpg'];
const homeTourNextStep = ['4-posx.jpg', '4-negx.jpg', '4-posy.jpg', '4-negy.jpg', '4-posz.jpg', '4-negz.jpg'];

const progressUpdateHandler = {
  start: { time: 1, parmas: { opacity: 0, duration: 0.6, }, },
  justBeforeFinish: { time: 0.1, params: {}, },
  finish: { params: { delay: 0.3, opacity: 1, duration: 0.4, ease: Sine.easeInOut, }, },
};

const createNewMeshBasicMaterial = ({ images = [], }) => {
  const textureArray = [];
  const assetArray = [];
  for (let i = 0; i < images.length; i += 1) textureArray.push(new THREE.TextureLoader().load(images[i]));
  for (let j = 0; j < textureArray.length; j += 1) {
    assetArray.push(new THREE.MeshBasicMaterial({ map: textureArray[j], }));
    assetArray[j].side = THREE.BackSide;
  }
  return assetArray;
};

window.init = function initateView() {

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const mouse = new THREE.Vector2();
  const target = new THREE.Vector2();
  const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

  // const onMouseMove = (event) => {
  //   mouse.x = (event.clientX - windowHalf.x);
  //   mouse.y = (event.clientY - windowHalf.x);
  // };
  // window.addEventListener('mousemove', onMouseMove, false);

  scene = new THREE.Scene;
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 45, 30000); //we need a camera. (fov, aspect, near, far)
  camera.position.set(3900, 1200, 50);

  renderer = new THREE.WebGLRenderer({ antialias: true, });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); //If you don't pass a canvas into three.js it will create one for you but then you have to add it to your document.

  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

  let controls = new THREE.OrbitControls(camera);
  controls.minDistance = 1500;
  controls.maxDistance = 2500;
  controls.keyPanSpeed = 10;

  const geometry = new THREE.SphereBufferGeometry(100, 100, 100);
  const sphere = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
    }),
  );
  sphere.position.set(-999.999999999999, 0, 0);
  let finalBox;
  let canvas1To0Started = false;
  let meshCreated = false;
  let canvasOTo1Started = false;

  const assetsArray = createNewMeshBasicMaterial({ images: homeTourNextStep, });
  let boxGeometry2 = new THREE.BoxGeometry(8000, 8000, 8000);
  finalBox = new THREE.Mesh(boxGeometry2, assetsArray, sphere);

  domEvents.addEventListener(sphere, 'click', event => {
    const { point = {}, } = event.intersect || {};
    tweenOutside = gsap.to(camera.position, {
      z: point.z,
      y: point.y + 1000,
      x: point.x + 1000,
      duration: 1,
      ease: Sine.easeInOut,
      onUpdate: () => {
        const progress = tweenOutside.progress();
        if (progress >= 0.1) {
          gsap.to('canvas', { ...progressUpdateHandler.start.parmas, });
          scene.remove(sphere);
        }
        if (progress >= 0.1 && progress <= 0.2) {
          const assetsArray = createNewMeshBasicMaterial({ images: homeTourNextStep, });
          let boxGeometry = new THREE.BoxGeometry(8000, 8000, 8000);
          finalBox = new THREE.Mesh(boxGeometry, assetsArray, sphere);
        }
        if (progress > 0.6) {
          gsap.to('canvas', { delay: 0.3, opacity: 1, duration: 0.4, ease: Sine.easeInOut, },);
        }
      },
      onComplete: () => {
        gsap.to('canvas', { ...progressUpdateHandler.finish.params });
        scene.add(finalBox);
      },
    });
  });
  scene.add(sphere);

  const dir = new THREE.Vector3(1, 2, 0);
  dir.normalize();
  const origin = new THREE.Vector3(0, 0, 0);
  const length = 1;
  const hex = 0xffff00;
  const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
  scene.add(arrowHelper);

  const imgArray = [...homeTourStart];
  const assetArray = createNewMeshBasicMaterial({ images: imgArray, });
  let boxGeometry = new THREE.BoxGeometry(8000, 8000, 8000);
  let box = new THREE.Mesh(boxGeometry, assetArray, sphere);
  scene.add(box);

  const group = new THREE.Group();
  // group.add(sphere);
  scene.add(group);

  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    const materialList = intersects[i].object.material;
    for (let j = 0; j < 1; j++) {
      const currentEdge = intersects[i].object.material[j];
      console.log(intersects[i])
      // currentEdge.color.set(0xff0000);
    }
  }

  function animate() {
    // target.x = (1 - mouse.x) * 0.002;
    // target.y = (1 - mouse.y) * 0.002;
    // camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
    // camera.rotation.y += 0.05 * (target.x - camera.rotation.y);
    // raycaster.setFromCamera(pointer, camera);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  function raycast(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i]);
      const { face, point } = intersects[i];
      const materialIndex = face.materialIndex;
      if (materialIndex === 1) {
        gsap.to(camera.position, {
          z: point.z,
          y: point.y,
          x: point.x,
          duration: 1,
          onComplete: () => loadBedroom(),
          onUpdate: () => {

          },
        });
      }
    }
  }
  animate();
  // renderer.domElement.addEventListener('click', raycast, false);
  // winsdow.addEventListener('keydown', (e) => {});
};

window.initateView2 = function initateView2() {
  let scene, camera, renderer;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  scene = new THREE.Scene;

  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 45, 30000); //we need a camera. (fov, aspect, near, far)
  camera.position.set(-100, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); //If you don't pass a canvas into three.js it will create one for you but then you have to add it to your document.

  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);
  controls.minDistance = 1500;
  controls.maxDistance = 2500;
  controls.keyPanSpeed = 10;

  let assetArray = [];

  let t_one = new THREE.TextureLoader().load('posx.jpg'); // front
  let t_two = new THREE.TextureLoader().load('negx.jpg'); // back
  let t_three = new THREE.TextureLoader().load('posy.jpg'); // top
  let t_four = new THREE.TextureLoader().load('negy.jpg'); // bottom
  let t_five = new THREE.TextureLoader().load('posz.jpg'); // left
  let t_six = new THREE.TextureLoader().load('negz.jpg'); // right

  assetArray.push(new THREE.MeshBasicMaterial({ map: t_one, }));
  assetArray.push(new THREE.MeshBasicMaterial({ map: t_two, }));
  assetArray.push(new THREE.MeshBasicMaterial({ map: t_three, }));
  assetArray.push(new THREE.MeshBasicMaterial({ map: t_four, }));
  assetArray.push(new THREE.MeshBasicMaterial({ map: t_five, }));
  assetArray.push(new THREE.MeshBasicMaterial({ map: t_six, }));

  for (let i = 0; i < 6; i += 1) assetArray[i].side = THREE.BackSide;

  let boxGeometry = new THREE.BoxGeometry(5500, 5500, 5500);
  let box = new THREE.Mesh(boxGeometry, assetArray);
  scene.add(box);

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  const raycast = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i]);
      const materialIndex = intersects[i].face.materialIndex;
      if (materialIndex === 0) {
        gsap.to(camera.position, {
          z: intersects[i].point.z,
          y: intersects[i].point.y,
          x: intersects[i].point.x,
          duration: 1,
          onComplete: () => loadMusicRoom(),
        })
      } else if (materialIndex === 1) {
        gsap.to(camera.position, {
          z: intersects[i].point.z,
          y: intersects[i].point.y,
          x: intersects[i].point.x,
          duration: 1,
          onComplete: () => loadEntrance(),
        })
      }
    }
  };
  renderer.domElement.addEventListener('click', raycast, false);
  animate();
}

const loadMusicRoom = () => {
  const raycaster = new THREE.Raycaster();
  document.body.removeChild(document.getElementsByTagName('canvas')[0]);
  let scene, camera, renderer;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 45, 30000); //we need a camera. (fov, aspect, near, far)
  camera.position.set(3900, 1200, 900);

  renderer = new THREE.WebGLRenderer({ antialias: true, });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); //If you don't pass a canvas into three.js it will create one for you but then you have to add it to your document.

  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);
  controls.minDistance = 900;
  controls.maxDistance = 3900;

  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0, },
      resolution: { value: new THREE.Vector4(), }
    }
  });
  const geometry = new THREE.SphereBufferGeometry(10000, 300, 300);
  const sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('https://images.prismic.io/2021-lp5/2723cbfa-1f46-4610-b34d-54f45445fa41_boule-bleue.jpg'),
    side: THREE.BackSide,
  }))
  scene.add(sphere);
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  const raycast = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
      // console.log(intersects[i]);
      const materialIndex = intersects[i].face.materialIndex;
      if (materialIndex === 0) {
        // gsap.effects.explode("canvas", {
        //   direction: "up", //can reference any properties that the author decides - in this case "direction".
        //   duration: 3
        // });
        gsap.to(camera.position, {
          z: intersects[i].point.z - 1000,
          y: intersects[i].point.y - 1000,
          x: intersects[i].point.x - 1000,
          duration: 1,
          onComplete: () => loadBedroom(),
        })
      }
    }
  };
  renderer.domElement.addEventListener('click', raycast, false);
  animate();
};

const loadBedroom = () => {
  document.body.removeChild(document.getElementsByTagName('canvas')[0]);
  initateView2();
};

const loadEntrance = () => {
  const canvas = document.getElementsByTagName('canvas')[0];
  if (canvas) document.body.removeChild(canvas);
  window.init();
};

init(); // load initial view

// then move the canvas element inside the nested div.
const canvas = document.getElementsByTagName('canvas')[0];
document.getElementById('demo').appendChild(canvas);


// use pipes and timelines for better code.