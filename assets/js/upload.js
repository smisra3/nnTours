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

    try {
        let response = await fetch(`/tour/${tourName.value}`);
        response = await response.json();
    } catch (error) {
        console.log(error);
    }

    alert('The file has been uploaded successfully.');
}