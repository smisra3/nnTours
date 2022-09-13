const progressUpdateHandler = {
  start: { time: 1, parmas: { opacity: 0, duration: 0.6, }, },
  justBeforeFinish: { time: 0.1, params: {}, },
  finish: { params: { delay: 0.3, opacity: 1, duration: 0.4, ease: Sine.easeInOut, }, },
};
const { tourData = {}, } = window;

// At the boot time, currentCube will contain the value of entry point of the app. After that, as user will
// navigate to other cubes, and currentCube value will be updated accordingly.
window.currentCube = {};
window.nextCube = {};

const updateCurrentAndNextCubes = () => {
  window.currentCube = { ...window.nextCube, };
  const nextCubeName = (window.currentCube.hotspot || {}).name || '';
  window.nextCube = {
    ...window.nextCube,
    name: (window.currentCube.hotspot || {}).name || '',
    hotspot: (tourData.metaInfo[nextCubeName] || {}).hotspot || {},
    images: (tourData.metaInfo[nextCubeName] || {}).images || [],
  };
};

const handleHotspotClick = (event, { camera, scene, hotspot, }) => {
  let finalBox;
  const { point = {}, } = event.intersect || {};
  let tweenOutside = gsap.to(camera.position, {
    z: point.z,
    y: point.y + 1000,
    x: point.x + 1000,
    duration: 1,
    ease: Sine.easeInOut,
    onUpdate: () => {
      // Tour next stop images uploaded here
      const images = [...nextCube.images];
      const progress = tweenOutside.progress();
      if (progress >= 0.1) gsap.to('canvas', { ...progressUpdateHandler.start.parmas, });
      if (progress >= 0.1 && progress <= 0.2) finalBox = createMesh({ images })
      if (progress > 0.6) gsap.to('canvas', { delay: 0.3, opacity: 1, duration: 0.4, ease: Sine.easeInOut, },);
    },
    onComplete: () => {
      updateCurrentAndNextCubes();
      gsap.to('canvas', { ...progressUpdateHandler.finish.params });
      scene.add(finalBox);
    },
  });
};

function initApp() {
  // Create the basic elements for a 3-D scene.
  const { camera, scene, renderer } = createElements();

  // Cube data which is to be used for creating current view
  const { hotspot: currentHotspot = {}, images: currentImages = [], } = window.currentCube || {};

  // create DOM eveents using camera and canvas;
  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

  // Create basic camera controls
  const controls = initControls(camera);

  // creating the hotspot. You can pass in the custom geometry else it will use a default white sphere.
  const hotspot = createHotspot({ scene, position: { x: currentHotspot.x, y: currentHotspot.y, z: currentHotspot.z || 0, } });

  // Adding the click handler for hotspot
  domEvents.addEventListener(hotspot, 'click', event => handleHotspotClick(event, { camera, scene, hotspot, }));

  // Tour Start images uploaded here
  const box = createMesh({ images: currentImages, });

  scene.add(hotspot);
  scene.add(box);
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
};

function bootApp() {
  // for new renders follow process: 
  // 1- Update current and next cube window variables
  // 2- call initApp

  const tourStartName = window.tourData.tourStart.tagName;
  window.currentCube = {
    ...(window.currentCube || {}),
    name: tourStartName,
    hotspot: tourData.metaInfo[tourStartName].hotspot,
    images: (((window.tourData || {}).metaInfo || {})[tourStartName] || {}).images || [],
  };
  const nextCubeName = (window.currentCube.hotspot || {}).name || '';
  window.nextCube = {
    ...window.nextCube,
    name: window.currentCube.hotspot.name,
    hotspot: (tourData.metaInfo[nextCubeName] || {}).hotspot || {},
    images: (tourData.metaInfo[nextCubeName] || {}).images || [],
  };
  initApp();
};

bootApp();
