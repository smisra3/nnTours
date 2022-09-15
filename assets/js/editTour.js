const loadScripts = (scripts) => {
  for (let i = 0; i < scripts.length; i += 1) {
    const script = document.createElement('script');
    script.defer = 'defer';
    script.src = scripts[i];
    document.head.append(script);
  }
};

async function getMetaInfo() {
  const tourName = location.pathname.split('/')[3];
  const res = await fetch(`/tour/${tourName}`);
  const data = await res.json();
  window.tourData = data;
  loadScripts([
    '/js/tourUtils.js',
    '/js/boot.js',
  ]);
}
getMetaInfo();
