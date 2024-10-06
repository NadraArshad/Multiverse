
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for transparency
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Set clear color to black with 0 opacity for transparency
document.querySelector('.container').appendChild(renderer.domElement); // Append to the container
renderer.shadowMap.enabled = true; // Enable shadows




    renderer.shadowMap.enabled = true; // Enable shadows

    // Create the Sun with realistic lighting
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffff00, 
      emissive: 0xffff00, 
      emissiveIntensity: 7, // Increase emissive intensity for glowing effect
      metalness: 1.0,
      roughness: 0.5,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.castShadow = true; // Enable shadow for the sun
    scene.add(sun);

    // Add point light to simulate sunlight
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true; // Enable shadow for the point light
    scene.add(pointLight);
    
    // Create Planets with their properties
    const planets = [
      { name: 'Mercury', radius: 0.2, color: 0xaaaaaa, orbitRadius: 5, orbitSpeed: 0.24 },
      { name: 'Venus', radius: 0.4, color: 0xffcc00, orbitRadius: 8, orbitSpeed: 0.615 },
      { name: 'Earth', radius: 0.5, color: 0x0000ff, orbitRadius: 10, orbitSpeed: 1 },
      { name: 'Mars', radius: 0.3, color: 0xff0000, orbitRadius: 15, orbitSpeed: 0.53 },
      { name: 'Jupiter', radius: 0.7, color: 0xffa500, orbitRadius: 20, orbitSpeed: 0.084 },
      { name: 'Saturn', radius: 0.6, color: 0xf6b93b, orbitRadius: 25, orbitSpeed: 0.034 },
      { name: 'Uranus', radius: 0.5, color: 0x00ffff, orbitRadius: 30, orbitSpeed: 0.011 },
      { name: 'Neptune', radius: 0.5, color: 0x00008b, orbitRadius: 35, orbitSpeed: 0.006 },
    ];

    const orbitColors = [
      0xff0000, // Mercury
      0xff7f00, // Venus
      0xffff00, // Earth
      0x00ff00, // Mars
      0x0000ff, // Jupiter
      0x4b0082, // Saturn
      0x9400d3, // Uranus
      0xff7f00, // Neptune
    ];

    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
      planets.forEach((planet, index) => {
        // Create the 3D text for the planet name
        const textGeometry = new THREE.TextGeometry(planet.name, {
          font: font,
          size: 0.9,
          height: 0.1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);
        planet.textMesh = textMesh; // Store reference to the text mesh for later use
      });
    });

    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: planet.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true; // Enable shadows for planets
      scene.add(mesh);

      // Add elliptical orbit for each planet
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,  // ax, aY
        planet.orbitRadius, planet.orbitRadius,  // xRadius, yRadius
        0, 2 * Math.PI,  // StartAngle, EndAngle
        false,  // Clockwise
        0  // Rotation
      );

      const points = orbitCurve.getPoints(100);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMaterial = new THREE.LineBasicMaterial({ color: orbitColors[i], linewidth: 2, opacity: 0.8, transparent: true }); // Colorful orbit
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);
      
      // Assign the mesh to the planet object for easier animation
      planet.mesh = mesh;
      planet.angle = 0; // Initial angle for rotation
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // OrbitControls for camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Set zoom limits
controls.minDistance = 5; // Minimum distance from the camera
controls.maxDistance = 100; // Maximum distance from the camera

// Position camera
camera.position.set(50, 50, 50);
controls.update();

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // Rotate planets around the Sun
  const time = clock.getElapsedTime();
  for (const planet of planets) {
    const mesh = planet.mesh;
    planet.angle += planet.orbitSpeed * 0.01; // Increment the angle based on orbit speed
    mesh.position.x = planet.orbitRadius * Math.cos(planet.angle);
    mesh.position.z = planet.orbitRadius * Math.sin(planet.angle);

    // Update position of the planet text above it
    if (planet.textMesh) {
      planet.textMesh.position.x = mesh.position.x;
      planet.textMesh.position.y = mesh.position.y + 0.5; // Adjust the height above the planet
      planet.textMesh.position.z = mesh.position.z;
    }
  }

  // Calculate background parallax effect based on camera position
  const parallaxFactor = 0.1; // Control the intensity of the parallax effect
  const parallaxX = camera.position.x * parallaxFactor;
  const parallaxY = camera.position.y * parallaxFactor;

  // Apply the calculated values to the background-position
  document.querySelector('.main').style.backgroundPosition = `${50 + parallaxX}% ${50 + parallaxY}%`;

  // Update camera and render the scene
  controls.update(); // Ensure controls are updated
  renderer.render(scene, camera);
}
animate();


document.querySelector('.zoom-in').addEventListener('click', () => {
    controls.zoomIn(); // This method will be available with OrbitControls
});

document.querySelector('.zoom-out').addEventListener('click', () => {
    controls.zoomOut(); // This method will be available with OrbitControls
});


// Select zoom buttons
const zoomInButton = document.getElementById('plus');
const zoomOutButton = document.getElementById('minus');

// Event listeners for zoom in and zoom out buttons
zoomInButton.addEventListener('click', () => {
    camera.zoom = camera.zoom * 1.1; // Increase zoom level by 10%
    camera.updateProjectionMatrix(); // Update camera matrix after changing zoom
});

zoomOutButton.addEventListener('click', () => {
    camera.zoom = camera.zoom / 1.1; // Decrease zoom level by 10%
    camera.updateProjectionMatrix(); // Update camera matrix after changing zoom
});

// Ensure OrbitControls are updated to reflect changes
controls.update();


zoomOutButton.addEventListener('click', () => {
    controls.dollyOut(1.1); // Use dollyOut to zoom out (1.1 controls zoom intensity)
    controls.update(); // Ensure the controls are updated after zooming
});


zoomOutButton.addEventListener('click', () => {
    // Move the camera farther for zooming out
    camera.position.set(
        camera.position.x / zoomFactor,
        camera.position.y / zoomFactor,
        camera.position.z / zoomFactor
    );
    camera.updateProjectionMatrix(); // Update camera's projection matrix
    controls.update(); // Ensure the controls are updated after zooming
});





    // Update window on resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

