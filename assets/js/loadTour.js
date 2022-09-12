const loadInitScript = () => {
  const script = document.createElement('script');
  script.defer = 'defer';
  script.src = '/js/boot.js';
  document.head.append(script);
}; 

async function getMetaInfo() {
  const tourName = location.pathname.split('/')[3];
  const res = await fetch(`/tour/${tourName}`);
  const data = await res.json();
  window.tourData = data;
  loadInitScript();
}
getMetaInfo();