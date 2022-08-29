function returnZValue(event) {
  var vec = new THREE.Vector3(); // create once and reuse
  var pos = new THREE.Vector3(); // create once and reuse

  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    - (event.clientY / window.innerHeight) * 2 + 1,
    0.5);

  vec.unproject(camera);

  vec.sub(camera.position).normalize();

  var distance = - camera.position.z / vec.z;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));
}

// The variable pos is the position of the point in 3D space, "under the mouse", and in the plane z=0.

// If you need the point "under the mouse" and in the plane z = targetZ, replace the distance computation with:

// var distance = ( targetZ - camera.position.z ) / vec.z;