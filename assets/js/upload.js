async function uploadFile(e) {
  let formData = new FormData();
  const fileupload = document.getElementById('upload');
  const tourName = document.getElementById('name');
  const roomType = document.getElementById('room-type');
  const isTourStart = document.getElementById('default').checked;

  formData.append('Tour Name', tourName.value);
  formData.append('Room type', roomType.value);
  for (let file = 0; file < fileupload.files.length; file += 1) {
    formData.append(fileupload.files[file].name, fileupload.files[file]);
  }
  if (isTourStart) {
    formData.append('Tour Start', roomType.value);
  }
  await fetch('/upload', {
    method: "POST",
    body: formData
  });
  fetchImages();
  alert('The file has been uploaded successfully.');
}

function createImageTags({ images = [], tourMetaData = {}, }) {
  const imgArray = [];
  const targetParent = document.getElementById('tour-images');

  const rooms = Object.keys(tourMetaData || []);
  const roomCount = rooms.length;

  targetParent.innerHTML = '';

  for (let i = 0; i < roomCount; i += 1) {
    const h1 = document.createElement('h1');
    const innerDiv = document.createElement('div');
    innerDiv.style = "display: flex;";
    h1.innerHTML = `<span>${rooms[i]}</span>`;
    h1.append(innerDiv);
    targetParent.append(h1);
    const imageArray = tourMetaData[rooms[i]].images;
    for (let j = 0; j < imageArray.length; j += 1) {
      const image = document.createElement('img');
      image.src = imageArray[j];
      image.width = '100';
      image.height = '100';
      image.addEventListener('click', e => {
        window.currentImage = {
          src: imageArray[j],
          roomName: rooms[i],
          tourName: window.__tourData__.tourName,
        };
        window.openModal();
      });
      innerDiv.append(image);
    }
  }
  return true;
}

function displayData() {
  createImageTags({ tourMetaData: window.__tourData__.metaInfo, });
  return true;
}

async function fetchImages() {
  try {
    const tourName = document.getElementById('name');
    let response = await fetch(`/tour/${tourName.value}`);
    response = await response.json();
    window.__tourData__ = response;
    displayData();
  } catch (error) {
    console.log(error);
  }
}