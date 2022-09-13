const progressUpdateHandler = {
  start: { time: 1, parmas: { opacity: 0, duration: 0.6, }, },
  justBeforeFinish: { time: 0.1, params: {}, },
  finish: { params: { delay: 0.3, opacity: 1, duration: 0.4, ease: Sine.easeInOut, }, },
};
const { tourData = {}, } = window;
const tourStartName = tourData.tourStart.tagName;
const tourStartHotspot = tourData.metaInfo[tourStartName].hotspot;

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
      const tourStartName = tourData.tourStart.tagName
      const nextStop = tourData.metaInfo[tourStartName].hotspot.name;
      const images = tourData.metaInfo[nextStop].images;

      const progress = tweenOutside.progress();
      if (progress >= 0.1) {
        gsap.to('canvas', { ...progressUpdateHandler.start.parmas, });
        scene.remove(hotspot);
      }
      if (progress >= 0.1 && progress <= 0.2) {
        finalBox = createMesh({ images })
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
};

function init() {
  // Create the basic elements for a 3-D scene.
  const elements = createElements();
  const camera = elements.camera;
  const scene = elements.scene;
  const renderer = elements.renderer;

  // create DOM eveents using camera and canvas;
  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

  // Create basic camera controls
  const controls = initControls(camera);

  // creating the hotspot. You can pass in the custom geometry else it will use a default white sphere.
  const hotspot = createHotspot({ scene, position: { x: tourStartHotspot.x, y: tourStartHotspot.y, z: 0, } });

  // Adding the click handler for hotspot
  domEvents.addEventListener(hotspot, 'click', event => handleHotspotClick(event, { camera, scene, hotspot, }));

  // Tour Start images uploaded here
  const box = createMesh({ images: (((window.tourData || {}).metaInfo || {})[tourStartName] || {}).images || [], });

  scene.add(hotspot);
  scene.add(box);
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
};

init();
