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

function createImageTags({ images = [], }) {
  const imgArray = [];
  const targetParent = document.getElementById('tour-images');
  targetParent.innerHTML = '';
  for (let i = 0; i < images.length; i += 1) {
    const image = document.createElement('img');
    image.src = images[i];
    image.width = '100';
    image.height = '100';
    imgArray.push(image);
    targetParent.append(image);
  }
}

function displayData() {
  const tourMetaData = window.__tourData__.metaInfo;
  const universalImageArray = [];
  Object.keys(tourMetaData).map(item => {
    const { images = [], } = (tourMetaData || {})[item] || {};
    universalImageArray.push(...(images || []));
  });
  createImageTags({ images: universalImageArray, });
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