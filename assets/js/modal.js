var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
const modalContent = document.getElementById('modal-content');

const openEditor = () => {
  modalContent.innerHTML = '';

  let dragStartX = '';
  let dragStartY = '';

  const { src, roomName, tourName, } = window.currentImage;
  const h1 = document.createElement('h1');
  h1.innerHTML = `Tour name: ${tourName}`;

  const h3 = document.createElement('h3');
  h3.innerHTML = `Room name: ${roomName}`;

  const img = document.createElement('div');
  img.style.background = `url(${src}) no-repeat`;
  img.style.backgroundSize = 'contain';
  img.style.height = '400px';
  img.style.position = 'relative';

  const hotspotWrapper = document.createElement('div');

  const hotspot = document.createElement('div');
  hotspot.id = 'hotspotId';
  hotspot.className = 'hotspot';
  hotspot.ondragstart = e => {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  };
  hotspot.ondragend = e => {
    const clientRect = e.currentTarget.getBoundingClientRect();
    const x = clientRect.left + e.clientX - dragStartX;
    const y = clientRect.top + e.clientY - dragStartY;
    window.dropPosition = { x, y };
    e.target.style.position = 'absolute';
    e.target.style.top = y + 'px';
    e.target.style.left = x + 'px';
  };

  const hotspotHeading = document.createElement('h5');
  hotspotHeading.innerHTML = `Drag this hotspot to connect to another/ same room`

  hotspotWrapper.append(hotspotHeading);
  hotspotWrapper.append(hotspot);

  modalContent.append(h1);
  modalContent.append(h3);
  modalContent.append(img);
  modalContent.append(hotspotWrapper);
};

window.openModal = ({ action = 'imageEditor', } = {}) => {
  modal.style.display = "block";
  document.body.style.overflow = 'hidden';
  if (action === 'imageEditor') {
    openEditor();
  }
}

span.onclick = function () {
  modal.style.display = "none";
  document.body.style.overflow = '';
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.style.overflow = '';
  }
}