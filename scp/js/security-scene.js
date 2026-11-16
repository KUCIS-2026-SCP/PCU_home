(function () {
  "use strict";
  function init() {
    var mount = document.getElementById("security-canvas");
    if (!mount || !window.THREE) return;
    var THREE = window.THREE;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(48, 1, .1, 100);
    camera.position.set(2.8, 0, 9);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    var network = new THREE.Group();
    network.position.x = 2.5;
    network.scale.setScalar(1.12);
    scene.add(network);
    var coreMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: .72 });
    var core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 2), coreMaterial);
    network.add(core);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, .018, 8, 150), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: .5 }));
    ring.rotation.set(1.1, .25, .35);
    network.add(ring);
    var ringTwo = ring.clone();
    ringTwo.scale.setScalar(1.3);
    ringTwo.rotation.set(.25, 1.2, .1);
    ringTwo.material = ring.material.clone();
    ringTwo.material.opacity = .2;
    network.add(ringTwo);

    var count = 84;
    var positions = new Float32Array(count * 3);
    var points = [];
    for (var i = 0; i < count; i++) {
      var radius = 2 + Math.random() * 2.1;
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var p = { x: radius * Math.sin(phi) * Math.cos(theta), y: radius * Math.sin(phi) * Math.sin(theta), z: radius * Math.cos(phi) };
      points.push(p); positions.set([p.x, p.y, p.z], i * 3);
    }
    var pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    network.add(new THREE.Points(pointGeometry, new THREE.PointsMaterial({ color: 0x8beaff, size: .052, transparent: true, opacity: .9 })));
    var connections = [];
    for (var a = 0; a < count; a++) for (var b = a + 1; b < count; b++) {
      var dx = points[a].x - points[b].x, dy = points[a].y - points[b].y, dz = points[a].z - points[b].z;
      if (dx * dx + dy * dy + dz * dz < 1.15) connections.push(points[a].x, points[a].y, points[a].z, points[b].x, points[b].y, points[b].z);
    }
    var connectionGeometry = new THREE.BufferGeometry();
    connectionGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connections, 3));
    network.add(new THREE.LineSegments(connectionGeometry, new THREE.LineBasicMaterial({ color: 0x00bce8, transparent: true, opacity: .16 })));

    var dustData = [];
    for (var d = 0; d < 320; d++) dustData.push((Math.random() - .5) * 17, (Math.random() - .5) * 10, (Math.random() - .5) * 8 - 1);
    var dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dustData, 3));
    var dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x246b80, size: .025, transparent: true, opacity: .62 }));
    scene.add(dust);

    var target = { x: 0, y: 0 }, pointer = { x: 0, y: 0 }, pulse = 0;
    var hero = mount.parentElement;
    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width - .5;
      target.y = (event.clientY - rect.top) / rect.height - .5;
    });
    hero.addEventListener("pointerleave", function () { target.x = target.y = 0; });
    hero.addEventListener("pointerdown", function () { pulse = 1; });
    function resize() {
      var rect = mount.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize, { passive: true }); resize();
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var clock = new THREE.Clock();
    function draw() {
      var time = clock.getElapsedTime();
      pointer.x += (target.x - pointer.x) * .04; pointer.y += (target.y - pointer.y) * .04;
      network.rotation.y = time * .07 + pointer.x * .55; network.rotation.x = time * .02 + pointer.y * .35;
      core.rotation.y = -time * .18; core.rotation.z = time * .07; ring.rotation.z = time * .11; ringTwo.rotation.y = -time * .08; dust.rotation.y = time * .006;
      if (pulse > .002) { pulse *= .91; core.scale.setScalar(1 + pulse * .18); } else core.scale.setScalar(1);
      renderer.render(scene, camera);
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
