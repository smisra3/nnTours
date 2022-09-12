var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
const modalContent = document.getElementById('modal-content');

const openEditor = () => {
  const { src, roomName, tourName, } = window.currentImage;
  const h1 = document.createElement('h1');
  h1.innerHTML = `Tour name: ${tourName}`;

  const h3 = document.createElement('h3');
  h3.innerHTML = `Room name: ${roomName}`;

  const img = document.createElement('img');
  img.src = src;
  img.width = '400';
  img.height = '400';

  const hotspotWrapper = document.createElement('div');
  const hotspot = document.createElement('div');
  const hotspotHeading = document.createElement('h5');

  hotspotHeading.innerHTML = `Drag this hotspot to connect to another/ same room`
  hotspot.className = 'hotspot';
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