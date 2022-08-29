function addHotSpot(scene) {
  THREE.ImageUtils.crossOrigin = '';
  
  var loader = new THREE.TextureLoader();
  loader.load('https://i.imgur.com/vU163P4.png', function (texture) {
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 1,
      side: THREE.DoubleSide,
      transparent: false  // Note, I also set this to false.
    });

    var sprite = new THREE.Mesh(geometry, material);


    // Offset the hotspot so it is below the view origin
    sprite.position.set(0, -5, 0);

    // Compute the rotation for the hotspot, 90deg around the x-axis
    var rotation = new THREE.Matrix4()
      .makeRotationAxis(new THREE.Vector3(1, 0, 0), 1.57);

    // Apply rotation to the hotspot so it "sits flat below the camera"
    sprite.rotation.setFromRotationMatrix(rotation);

    scene.add(sprite);
  });
}

window.addHotspot = addHotSpot;