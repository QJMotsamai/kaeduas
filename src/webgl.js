// ==========================================================================
// KAEDUAS — Strata monolith. The mark, in 3D: four ember-lit layers
// floating in ink. Procedural — nothing to download, nothing to wait for.
// ==========================================================================

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';

export function initWebGL(canvas) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    canvas.remove();
    return { assemble() {}, setScroll() {} };
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0b, 0.05);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 0.6, 9.4);

  // Environment for PBR sheen
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;

  // Lights — bone key, ember rims
  const key = new THREE.DirectionalLight(0xf2f0eb, 1.1);
  key.position.set(4, 7, 6);
  scene.add(key);

  const rimA = new THREE.PointLight(0xd9612f, 90, 40, 2);
  rimA.position.set(-7, 2.5, -5);
  scene.add(rimA);

  const rimB = new THREE.PointLight(0xf07a45, 40, 30, 2);
  rimB.position.set(7, -3, -6);
  scene.add(rimB);

  scene.add(new THREE.HemisphereLight(0x26262b, 0x0a0a0b, 0.5));

  // The four layers of the mark
  const group = new THREE.Group();
  scene.add(group);

  const slabGeo = new RoundedBoxGeometry(5.6, 1.1, 2.2, 4, 0.16);
  const slabMat = new THREE.MeshPhysicalMaterial({
    color: 0x17171a,
    roughness: 0.3,
    metalness: 0.88,
    envMapIntensity: 1.15,
    clearcoat: 0.5,
    clearcoatRoughness: 0.28,
    transparent: true,
    opacity: 0
  });

  const SLABS = [
    { baseY: 1.86, x: 0.55, phase: 0.0 },
    { baseY: 0.62, x: -0.55, phase: 1.7 },
    { baseY: -0.62, x: 0.55, phase: 3.1 },
    { baseY: -1.86, x: -0.55, phase: 4.6 }
  ];

  const slabs = SLABS.map((s) => {
    const mesh = new THREE.Mesh(slabGeo, slabMat);
    mesh.position.set(s.x, s.baseY, 0);
    group.add(mesh);
    return mesh;
  });

  // Dust — cheap depth
  const dustCount = 240;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPos[i] = (Math.random() - 0.5) * 26;
    dustPos[i + 1] = (Math.random() - 0.5) * 16;
    dustPos[i + 2] = (Math.random() - 0.5) * 12 - 2;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0xc9c9cf,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      sizeAttenuation: true
    })
  );
  scene.add(dust);

  // Initial scattered state for the intro
  const introStart = slabs.map((mesh, i) => ({
    y: s2(i) * (2.4 + i * 0.9),
    rz: (i % 2 ? -1 : 1) * (0.35 + i * 0.12)
  }));
  function s2(i) { return i % 2 === 0 ? 1 : -1; }

  slabs.forEach((mesh, i) => {
    mesh.position.y = SLABS[i].baseY + introStart[i].y;
    mesh.rotation.z = introStart[i].rz;
  });
  group.rotation.y = -0.55;

  // Pointer parallax
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // Scroll
  let scrollP = 0;
  function setScroll(p) { scrollP = p; }

  // Sizing
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const dist = camera.position.z;
    const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
    const visW = visH * camera.aspect;
    const s = Math.min(1, Math.max(0.5, visW / 8.6));
    group.scale.setScalar(s);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Render loop
  let raf = 0;
  let running = false;
  const clock = new THREE.Clock();

  function frame() {
    const t = clock.getElapsedTime();
    const d = clock.getDelta();

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    const spread = scrollP * 2.6;
    slabs.forEach((mesh, i) => {
      const k = easeOut(introP[i].p);
      const assembledY = SLABS[i].baseY + Math.sin(t * 0.6 + SLABS[i].phase) * 0.055 * k + (i - 1.5) * spread;
      const scatteredY = SLABS[i].baseY + introStart[i].y;
      mesh.position.y = scatteredY + (assembledY - scatteredY) * k;
      mesh.rotation.z = introStart[i].rz * (1 - k);
      mesh.rotation.y = scrollP * 0.9 * (i % 2 ? -1 : 1) * k;
    });

    group.rotation.y = -0.55 + t * 0.07 + pointer.x * 0.28 + scrollP * 2.1;
    group.rotation.x = pointer.y * 0.1;
    group.position.y = Math.sin(t * 0.5) * 0.14;

    dust.rotation.y = t * 0.02;

    camera.position.x = pointer.x * 0.5;
    camera.position.y = 0.6 - pointer.y * 0.3 + scrollP * 1.2;
    camera.position.z = 9.4 + scrollP * 2.6;
    camera.lookAt(0, scrollP * -0.4, 0);

    rimA.intensity = 90 * (1 - scrollP * 0.55);
    canvas.style.opacity = String(1 - Math.min(scrollP * 1.15, 0.92));

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
    void d;
  }

  function start() {
    if (running || reduced) return;
    running = true;
    clock.start();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // Pause when hero is off-screen or tab hidden
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start(); else stop();
    }, { threshold: 0.02 }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Assemble intro
  function assemble() {
    if (reduced) {
      slabMat.opacity = 1;
      slabs.forEach((mesh, i) => {
        mesh.position.y = SLABS[i].baseY;
        mesh.rotation.z = 0;
      });
      renderer.render(scene, camera);
      return;
    }
    gsap.to(slabMat, {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out'
    });
    slabs.forEach((mesh, i) => {
      gsap.to(mesh.position, {
        y: SLABS[i].baseY,
        duration: 1.6,
        delay: 0.08 * i,
        ease: 'power3.out'
      });
      gsap.to(mesh.rotation, {
        z: 0,
        duration: 1.6,
        delay: 0.08 * i,
        ease: 'power3.out'
      });
    });
  }

  if (reduced) {
    // One static, fully-formed frame
    slabMat.opacity = 1;
    slabs.forEach((mesh, i) => {
      mesh.position.y = SLABS[i].baseY;
      mesh.rotation.z = 0;
    });
    renderer.render(scene, camera);
  }

  return { assemble, setScroll };
}
