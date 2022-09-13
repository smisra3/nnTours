window.createHotspot = ({
  color = '0xffffff',
  position = { x: -999.999999999999, y: 0, z: 0, },
  geometry,
  scene,
} = {}) => {
  const hotspot = new THREE.Mesh(
    geometry || new THREE.SphereBufferGeometry(100, 100, 100),
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
    }),
  );
  const xpos = -2000 + 100;
  const ypos = 1351.4196584763467;
  const zpos = -1000;
  hotspot.position.set(xpos || position.x, ypos || position.y, zpos || position.z);
  return hotspot;
};

window.createNewMeshBasicMaterial = ({ images = [], }) => {
  const textureArray = [];
  const assetArray = [];
  for (let i = 0; i < images.length; i += 1) textureArray.push(new THREE.TextureLoader().load(images[i]));
  for (let j = 0; j < textureArray.length; j += 1) {
    assetArray.push(new THREE.MeshBasicMaterial({ map: textureArray[j], }));
    assetArray[j].side = THREE.BackSide;
  }
  return assetArray;
};

window.initCamera = ({
  fov = 80,
  aspect = window.innerWidth / window.innerHeight,
  near = 45,
  far = 30000,
  position = { x: 3900, y: 1200, z: 50 },
} = {},
) => {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //we need a camera. (fov, aspect, near, far)
  camera.position.set(position.x, position.y, position.z);
  return camera;
};

window.createElements = () => {
  const scene = new THREE.Scene;
  const camera = initCamera();
  const renderer = new THREE.WebGLRenderer({ antialias: true, });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); //If you don't pass a canvas into three.js it will create one for you but then you have to add it to your document.
  return { scene, camera, renderer, };
};

window.initControls = (camera, { minDistance = 1500, maxDistance = 2500, keyPanSpeed = 10, } = {}) => {
  let controls = new THREE.OrbitControls(camera);
  controls.minDistance = minDistance;
  controls.maxDistance = maxDistance;
  controls.keyPanSpeed = keyPanSpeed;
  return controls;
};

window.changeHotspotLocation = ({ domEvents, element, hotspot, }) => {
  domEvents.addEventListener(element, 'dblclick', e => {
    e.stopPropagation();
    const { x, y, z } = (e.intersect || {}).point || {};
    hotspot.position.set(x + 100, y, z);
  })
};

window.createMesh = ({ images = [], }) => {
  const assetArray = createNewMeshBasicMaterial({ images, });
  let boxGeometry = new THREE.BoxGeometry(8000, 8000, 8000);
  return new THREE.Mesh(boxGeometry, assetArray);
};

window.updateCurrentAndNextCubes = () => {
  window.currentCube = { ...window.nextCube, };
  const nextCubeName = (window.currentCube.hotspot || {}).name || '';
  window.nextCube = {
    ...window.nextCube,
    name: (window.currentCube.hotspot || {}).name || '',
    hotspot: (tourData.metaInfo[nextCubeName] || {}).hotspot || {},
    images: (tourData.metaInfo[nextCubeName] || {}).images || [],
  };
};