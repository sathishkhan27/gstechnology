/**
 * GS Technology India Pvt Ltd - 3D Scroll Showcase
 * Real-time Three.js WebGL 3D Scroll Animation for RO Membrane Housing Assembly
 * Grounded precisely in /images/2.JPG:
 *   1. Blue FRP Composite Pressure Vessel (with flared bell housing & inner groove)
 *   2. Corrugated / Fluted Aluminum Thrust Collar (18-flute scalloped cylinder)
 *   3. Main Vessel Head Sealing O-Ring (EPDM Elastomer)
 *   4. Machined End Cap Assembly (Permeate Pipe with inner bore, Hex Plug, Rear Shaft)
 *   5. Flat Split Retaining Ring (with alignment pin holes & expansion split)
 *   6. Beveled Solid Retaining Outer Ring (SS 316 with 3 countersunk bolt holes)
 *   7. Three Stainless Steel Hex Socket Cap Screws (DIN 912)
 *   8. Hydrodynamic Water Pressure Stream Particles
 *
 * Core Features:
 *   - Scroll-Driven 3D Exploded / Assemble Animation via GSAP ScrollTrigger
 *   - FULL FRONT VIEW when parts assemble at Stage 01 (level, centered, and unobstructed)
 *   - Smooth 3-axis rotation into the diagonal isometric perspective of 2.JPG on scroll
 *   - 100% Transparent WebGL Canvas (ZERO white background)
 *   - 360° Free Orbit & Zoom Inspection mode
 */

(function () {
  'use strict';

  function hasWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-canvas-container');
    const section = document.getElementById('scroll3dShowcase');
    if (!container || !section) return;

    if (!hasWebGL() || typeof THREE === 'undefined') {
      console.warn('WebGL or Three.js unavailable');
      section.classList.add('no-webgl');
      return;
    }

    initScroll3DAnimation(container, section);
  });

  function initScroll3DAnimation(container, section) {
    // -------------------------------------------------------------
    // 1. Scene, Camera & Transparent WebGL Renderer
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    // Transparent background: blends seamlessly with the dark website background (#0a0f1d)
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.024);

    const isMobile = window.innerWidth <= 768;
    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Transparent canvas: ZERO white background
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0); // Transparent clear color
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // 2. Studio Lighting Setup (Calibrated CAD KeyShot Style)
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Primary Key Light (Top-Left Bright Studio Light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(-5, 8, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Front-Right Fill Light for Metallic Specular & Contrast
    const fillLight = new THREE.DirectionalLight(0xbfdbfe, 0.9);
    fillLight.position.set(6, 2, 6);
    scene.add(fillLight);

    // Top Rim Light for Vessel Edge Definition
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(0, 7, -5);
    scene.add(rimLight);

    // Subtle Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(32, 32);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.25;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(26, 26, 0x1e3a8a, 0x1e293b);
    grid.position.y = -2.26;
    scene.add(grid);

    // -------------------------------------------------------------
    // 3. Materials Tuned to 2.JPG CAD Render
    // -------------------------------------------------------------
    // Deep Industrial Cobalt Blue FRP Composite Pressure Vessel (matching 2.JPG)
    const frpVesselMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x075985,
      emissive: 0x022538,
      roughness: 0.16,
      metalness: 0.12,
      clearcoat: 0.92,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95
    });

    const vesselInnerMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.2
    });

    // Extruded Corrugated Aluminum Fluted Collar (Machined silver alloy)
    const flutedAluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.32,
      metalness: 0.88
    });

    // High Polish Marine Grade Stainless Steel (SS 316 for Beveled Ring & Screws)
    const polishedSteelMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.16,
      metalness: 0.94
    });

    // Brushed Aluminum / Steel End Cap Face Plate
    const brushedPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.36,
      metalness: 0.82
    });

    // Deep Black Elastomer EPDM O-Ring
    const epdmRubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.04
    });

    // -------------------------------------------------------------
    // 4. Procedural 3D Construction of the Exact 2.JPG Spare Parts
    // -------------------------------------------------------------
    const rootAssemblyGroup = new THREE.Group();
    scene.add(rootAssemblyGroup);

    // 1. Blue FRP Pressure Vessel Tube (Right Side Anchor)
    const vesselComponent = new THREE.Group();
    {
      const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 6.5, 64, 1, true);
      tubeGeo.rotateX(Math.PI / 2);
      const tubeMesh = new THREE.Mesh(tubeGeo, frpVesselMaterial);
      tubeMesh.castShadow = true;
      tubeMesh.receiveShadow = true;
      vesselComponent.add(tubeMesh);

      // Flared Bell Housing Collar at Mouth
      const bellGeo = new THREE.CylinderGeometry(1.68, 1.5, 1.2, 64, 1, false);
      bellGeo.rotateX(Math.PI / 2);
      const bellMesh = new THREE.Mesh(bellGeo, frpVesselMaterial);
      bellMesh.position.z = -2.6;
      bellMesh.castShadow = true;
      vesselComponent.add(bellMesh);

      // Inner Retaining Ring Groove Lip
      const lipGeo = new THREE.CylinderGeometry(1.52, 1.52, 0.4, 64, 1, true);
      lipGeo.rotateX(Math.PI / 2);
      const lipMesh = new THREE.Mesh(lipGeo, vesselInnerMaterial);
      lipMesh.position.z = -2.9;
      vesselComponent.add(lipMesh);

      // Internal Membrane Element Core simulation inside vessel
      const innerCoreGeo = new THREE.CylinderGeometry(1.36, 1.36, 4.5, 48);
      innerCoreGeo.rotateX(Math.PI / 2);
      const innerCoreMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.6,
        metalness: 0.3
      });
      const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
      innerCoreMesh.position.z = 0.5;
      vesselComponent.add(innerCoreMesh);
    }
    rootAssemblyGroup.add(vesselComponent);

    // 2. Corrugated / Fluted Scalloped Aluminum Thrust Collar
    const flutedCollarComponent = new THREE.Group();
    {
      const numFlutes = 18;
      const innerRadius = 1.15;
      const baseOuterRadius = 1.36;
      const fluteAmplitude = 0.12;

      const fluteShape = new THREE.Shape();
      for (let i = 0; i <= 72; i++) {
        const theta = (i / 72) * Math.PI * 2;
        const r = baseOuterRadius + fluteAmplitude * Math.sin(theta * numFlutes);
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (i === 0) fluteShape.moveTo(x, y);
        else fluteShape.lineTo(x, y);
      }
      fluteShape.closePath();

      const holePath = new THREE.Path();
      for (let i = 0; i <= 48; i++) {
        const theta = (i / 48) * Math.PI * 2;
        const x = Math.cos(theta) * innerRadius;
        const y = Math.sin(theta) * innerRadius;
        if (i === 0) holePath.moveTo(x, y);
        else holePath.lineTo(x, y);
      }
      fluteShape.holes.push(holePath);

      const extrudeSettings = {
        depth: 1.25,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025
      };

      const flutedGeo = new THREE.ExtrudeGeometry(fluteShape, extrudeSettings);
      const flutedMesh = new THREE.Mesh(flutedGeo, flutedAluminumMaterial);
      flutedMesh.position.z = -0.62;
      flutedMesh.castShadow = true;
      flutedMesh.receiveShadow = true;
      flutedCollarComponent.add(flutedMesh);
    }
    rootAssemblyGroup.add(flutedCollarComponent);

    // 3. Main Vessel Head Sealing O-Ring (EPDM Rubber)
    const oRingComponent = new THREE.Group();
    {
      const oRingGeo = new THREE.TorusGeometry(1.44, 0.055, 24, 64);
      const oRingMesh = new THREE.Mesh(oRingGeo, epdmRubberMaterial);
      oRingMesh.castShadow = true;
      oRingComponent.add(oRingMesh);
    }
    rootAssemblyGroup.add(oRingComponent);

    // 4. Machined End Cap Assembly (Core Bearing Unit)
    const endCapComponent = new THREE.Group();
    {
      // Main Machined Outer Disc with Beveled Sealing Rim
      const capBodyGeo = new THREE.CylinderGeometry(1.44, 1.44, 0.65, 64);
      capBodyGeo.rotateX(Math.PI / 2);
      const capBodyMesh = new THREE.Mesh(capBodyGeo, polishedSteelMaterial);
      capBodyMesh.castShadow = true;
      endCapComponent.add(capBodyMesh);

      // Front Face Recessed Plate
      const facePlateGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.06, 64);
      facePlateGeo.rotateX(Math.PI / 2);
      const facePlateMesh = new THREE.Mesh(facePlateGeo, brushedPlateMaterial);
      facePlateMesh.position.z = -0.34;
      endCapComponent.add(facePlateMesh);

      // Blue Manufacturer Emblem Disc (Matching 2.JPG)
      const emblemGeo = new THREE.RingGeometry(0.2, 0.45, 32);
      const emblemMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide });
      const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
      emblemMesh.position.set(-0.25, -0.2, -0.38);
      endCapComponent.add(emblemMesh);

      // Stainless Steel Permeate Port Pipe (Extending outwards toward viewer)
      const pipeOuterGeo = new THREE.CylinderGeometry(0.26, 0.26, 1.35, 32);
      pipeOuterGeo.rotateX(Math.PI / 2);
      const pipeMesh = new THREE.Mesh(pipeOuterGeo, polishedSteelMaterial);
      pipeMesh.position.set(-0.48, 0.35, -0.95);
      pipeMesh.castShadow = true;
      endCapComponent.add(pipeMesh);

      // Permeate Pipe Inner Bore
      const pipeBoreGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.1, 32);
      pipeBoreGeo.rotateX(Math.PI / 2);
      const boreMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const pipeBoreMesh = new THREE.Mesh(pipeBoreGeo, boreMat);
      pipeBoreMesh.position.set(-0.48, 0.35, -1.63);
      endCapComponent.add(pipeBoreMesh);

      // Center Hex Socket Plug / Retaining Nut
      const plugGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.22, 32);
      plugGeo.rotateX(Math.PI / 2);
      const plugMesh = new THREE.Mesh(plugGeo, polishedSteelMaterial);
      plugMesh.position.set(0.12, -0.05, -0.42);
      plugMesh.castShadow = true;
      endCapComponent.add(plugMesh);

      // Hex Socket Recess
      const hexGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 6);
      hexGeo.rotateX(Math.PI / 2);
      const hexMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
      const hexMesh = new THREE.Mesh(hexGeo, hexMat);
      hexMesh.position.set(0.12, -0.05, -0.52);
      endCapComponent.add(hexMesh);

      // Rear Stepped Shaft Extension
      const rearShaftGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.4, 32);
      rearShaftGeo.rotateX(Math.PI / 2);
      const rearShaftMesh = new THREE.Mesh(rearShaftGeo, polishedSteelMaterial);
      rearShaftMesh.position.z = 0.95;
      rearShaftMesh.castShadow = true;
      endCapComponent.add(rearShaftMesh);

      // Secondary O-Ring on Rear Shaft
      const shaftORingGeo = new THREE.TorusGeometry(0.42, 0.04, 16, 32);
      const shaftORingMesh = new THREE.Mesh(shaftORingGeo, epdmRubberMaterial);
      shaftORingMesh.position.z = 1.35;
      endCapComponent.add(shaftORingMesh);
    }
    rootAssemblyGroup.add(endCapComponent);

    // 5. Flat Split Retaining Ring (Stainless Steel Backing Ring)
    const splitRingComponent = new THREE.Group();
    {
      const outerR = 1.48;
      const innerR = 1.28;
      const arcAngle = Math.PI * 2 * 0.975;

      const splitShape = new THREE.Shape();
      splitShape.absarc(0, 0, outerR, 0, arcAngle, false);
      splitShape.absarc(0, 0, innerR, arcAngle, 0, true);
      splitShape.closePath();

      const splitGeo = new THREE.ExtrudeGeometry(splitShape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015
      });
      const splitMesh = new THREE.Mesh(splitGeo, brushedPlateMaterial);
      splitMesh.position.z = -0.04;
      splitMesh.castShadow = true;
      splitRingComponent.add(splitMesh);

      // Alignment pin holes
      for (let p = 0; p < 2; p++) {
        const pinAngle = Math.PI * 0.35 + p * Math.PI * 0.8;
        const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 16);
        pinGeo.rotateX(Math.PI / 2);
        const pinMesh = new THREE.Mesh(pinGeo, new THREE.MeshBasicMaterial({ color: 0x0f172a }));
        pinMesh.position.set(Math.cos(pinAngle) * 1.38, Math.sin(pinAngle) * 1.38, 0);
        splitRingComponent.add(pinMesh);
      }
    }
    rootAssemblyGroup.add(splitRingComponent);

    // 6. Beveled Solid Retaining Outer Ring
    const beveledRingComponent = new THREE.Group();
    {
      const beveledShape = new THREE.Shape();
      beveledShape.absarc(0, 0, 1.49, 0, Math.PI * 2, false);
      const innerHole = new THREE.Path();
      innerHole.absarc(0, 0, 1.26, 0, Math.PI * 2, true);
      beveledShape.holes.push(innerHole);

      const beveledGeo = new THREE.ExtrudeGeometry(beveledShape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.05,
        bevelThickness: 0.06
      });
      const beveledMesh = new THREE.Mesh(beveledGeo, polishedSteelMaterial);
      beveledMesh.position.z = -0.11;
      beveledMesh.castShadow = true;
      beveledRingComponent.add(beveledMesh);

      // 3 Countersunk Bolt Holes around perimeter
      for (let b = 0; b < 3; b++) {
        const bAngle = (b / 3) * Math.PI * 2 + 0.3;
        const bHoleGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 16);
        bHoleGeo.rotateX(Math.PI / 2);
        const bHoleMesh = new THREE.Mesh(bHoleGeo, new THREE.MeshBasicMaterial({ color: 0x0a0f1d }));
        bHoleMesh.position.set(Math.cos(bAngle) * 1.38, Math.sin(bAngle) * 1.38, 0);
        beveledRingComponent.add(bHoleMesh);
      }
    }
    rootAssemblyGroup.add(beveledRingComponent);

    // 7. Three Stainless Steel Hex Socket Cap Screws
    const screwsComponent = new THREE.Group();
    {
      for (let s = 0; s < 3; s++) {
        const sAngle = (s / 3) * Math.PI * 2 + 0.3;
        const screwUnit = new THREE.Group();

        // Screw Head
        const headGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.16, 24);
        headGeo.rotateX(Math.PI / 2);
        const headMesh = new THREE.Mesh(headGeo, polishedSteelMaterial);
        headMesh.castShadow = true;
        screwUnit.add(headMesh);

        // Hex Socket Recess
        const hexSocketGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.06, 6);
        hexSocketGeo.rotateX(Math.PI / 2);
        const hexSocketMesh = new THREE.Mesh(hexSocketGeo, new THREE.MeshBasicMaterial({ color: 0x090d16 }));
        hexSocketMesh.position.z = -0.07;
        screwUnit.add(hexSocketMesh);

        // Threaded Shank
        const shankGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.35, 16);
        shankGeo.rotateX(Math.PI / 2);
        const shankMesh = new THREE.Mesh(shankGeo, polishedSteelMaterial);
        shankMesh.position.z = 0.22;
        screwUnit.add(shankMesh);

        screwUnit.position.set(Math.cos(sAngle) * 1.38, Math.sin(sAngle) * 1.38, 0);
        screwsComponent.add(screwUnit);
      }
    }
    rootAssemblyGroup.add(screwsComponent);

    // 8. Water Pressure Flow Stream Particles
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 0.45 - 0.48;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.45 + 0.35;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
      particleSpeeds[i] = 0.035 + Math.random() * 0.04;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootAssemblyGroup.add(particleSystem);

    // -------------------------------------------------------------
    // 5. Exploded Positions along the 3D Z-Axis
    // -------------------------------------------------------------
    const assembledPositions = {
      vesselZ: 1.8,
      flutedZ: -0.2,
      oRingZ: -0.7,
      endCapZ: -0.85,
      splitRingZ: -1.2,
      beveledRingZ: -1.35,
      screwsZ: -1.45
    };

    const explodedPositions = {
      vesselZ: 3.2,
      flutedZ: 1.6,
      oRingZ: 0.55,
      endCapZ: -0.85,
      splitRingZ: -2.3,
      beveledRingZ: -3.5,
      screwsZ: -4.8
    };

    // -------------------------------------------------------------
    // 6. Interactive Controls & Preset Views
    // -------------------------------------------------------------
    let isFreeOrbitMode = false;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Target transformation state for smooth damping
    let targetRotationX = 0.03;
    let targetRotationY = Math.PI - 0.05; // Full Front View at start
    let targetRotationZ = 0.0;
    let targetPositionX = isMobile ? 0 : 1.25; // Shifted right on desktop so left card doesn't obscure
    let targetCameraZ = 8.0;
    let currentProgress = 0;

    const modeToggleBtn = document.getElementById('toggle3DMode');
    const viewFrontBtn = document.getElementById('viewFrontBtn');
    const viewExplodedBtn = document.getElementById('viewExplodedBtn');
    const modeStatusText = document.getElementById('modeStatusText');
    const resetViewBtn = document.getElementById('reset3DView');
    const stepButtons = document.querySelectorAll('.step-nav-btn');
    const storyCards = document.querySelectorAll('.scroll-3d-card');
    const progressBar = document.getElementById('scroll3DProgressBar');

    function lerp(start, end, t) {
      return start + (end - start) * t;
    }

    // Front View Button Preset
    if (viewFrontBtn) {
      viewFrontBtn.addEventListener('click', () => {
        isFreeOrbitMode = false;
        container.classList.remove('orbit-active');
        if (modeToggleBtn) modeToggleBtn.classList.remove('active');
        if (modeStatusText) modeStatusText.textContent = 'Full Front View';
        if (resetViewBtn) resetViewBtn.style.display = 'inline-flex';

        applyScrollFrame(0.0);
        window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
      });
    }

    // Exploded View Button Preset
    if (viewExplodedBtn) {
      viewExplodedBtn.addEventListener('click', () => {
        isFreeOrbitMode = false;
        container.classList.remove('orbit-active');
        if (modeToggleBtn) modeToggleBtn.classList.remove('active');
        if (modeStatusText) modeStatusText.textContent = '3D Exploded View (2.JPG)';
        if (resetViewBtn) resetViewBtn.style.display = 'inline-flex';

        applyScrollFrame(1.0);
        const totalHeight = section.offsetHeight - window.innerHeight;
        window.scrollTo({ top: section.offsetTop + totalHeight, behavior: 'smooth' });
      });
    }

    // 360° Free Orbit Toggle
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener('click', () => {
        isFreeOrbitMode = !isFreeOrbitMode;
        if (isFreeOrbitMode) {
          container.classList.add('orbit-active');
          modeToggleBtn.classList.add('active');
          if (modeStatusText) modeStatusText.textContent = '360° Free Orbit Mode (Drag & Zoom)';
          if (resetViewBtn) resetViewBtn.style.display = 'inline-flex';
        } else {
          container.classList.remove('orbit-active');
          modeToggleBtn.classList.remove('active');
          if (modeStatusText) modeStatusText.textContent = 'Scroll-Driven 3D Mode';
          if (resetViewBtn) resetViewBtn.style.display = 'none';
          applyScrollFrame(currentProgress);
        }
      });
    }

    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        isFreeOrbitMode = false;
        container.classList.remove('orbit-active');
        if (modeToggleBtn) modeToggleBtn.classList.remove('active');
        if (modeStatusText) modeStatusText.textContent = 'Scroll-Driven 3D Mode';
        resetViewBtn.style.display = 'none';
        applyScrollFrame(currentProgress);
      });
    }

    // Mouse & Touch Gestures in Free Orbit Mode (Non-blocking during standard scroll)
    container.addEventListener('mousedown', (e) => {
      if (!isFreeOrbitMode) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isFreeOrbitMode || !isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotationX));
    });

    container.addEventListener('wheel', (e) => {
      if (!isFreeOrbitMode) return;
      e.preventDefault();
      targetCameraZ += e.deltaY * 0.005;
      targetCameraZ = Math.max(5.0, Math.min(13.0, targetCameraZ));
    }, { passive: false });

    // Step Nav Buttons: Smooth scroll to each stage
    stepButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stageIndex = parseInt(btn.getAttribute('data-stage'), 10) || 0;
        const totalHeight = section.offsetHeight - window.innerHeight;
        const targetScroll = section.offsetTop + (stageIndex / 3) * totalHeight;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      });
    });

    // -------------------------------------------------------------
    // 7. Core 3D Scroll Driver: Smooth Transformation from Full Front View
    //    into Diagonal Exploded 2.JPG View
    // -------------------------------------------------------------
    function applyScrollFrame(progress) {
      currentProgress = progress;

      if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
      }

      const p = Math.max(0, Math.min(1, progress));

      // 1. Separate 3D meshes along their local Z axis in 3D space
      const pScrews = Math.min(1, p * 1.5);
      const pBeveled = Math.min(1, Math.max(0, (p - 0.1) * 1.4));
      const pSplit = Math.min(1, Math.max(0, (p - 0.2) * 1.35));
      const pEndCap = Math.min(1, Math.max(0, (p - 0.3) * 1.3));
      const pORing = Math.min(1, Math.max(0, (p - 0.4) * 1.3));
      const pFluted = Math.min(1, Math.max(0, (p - 0.5) * 1.3));
      const pVessel = Math.min(1, Math.max(0, (p - 0.35) * 1.2));

      screwsComponent.position.z = lerp(assembledPositions.screwsZ, explodedPositions.screwsZ, pScrews);
      beveledRingComponent.position.z = lerp(assembledPositions.beveledRingZ, explodedPositions.beveledRingZ, pBeveled);
      splitRingComponent.position.z = lerp(assembledPositions.splitRingZ, explodedPositions.splitRingZ, pSplit);
      endCapComponent.position.z = lerp(assembledPositions.endCapZ, explodedPositions.endCapZ, pEndCap);
      oRingComponent.position.z = lerp(assembledPositions.oRingZ, explodedPositions.oRingZ, pORing);
      flutedCollarComponent.position.z = lerp(assembledPositions.flutedZ, explodedPositions.flutedZ, pFluted);
      vesselComponent.position.z = lerp(assembledPositions.vesselZ, explodedPositions.vesselZ, pVessel);

      // 2. Full Front View (p=0) -> Isometric 2.JPG Angle (p=1)
      if (!isFreeOrbitMode) {
        const isNarrow = window.innerWidth <= 768;

        // Front View Angles (Direct head-on face view at Stage 01)
        const frontRotX = 0.03;
        const frontRotY = Math.PI - 0.05;
        const frontRotZ = 0.0;
        const frontPosX = isNarrow ? 0 : 1.25;
        const frontCamZ = isNarrow ? 9.5 : 8.0;

        // Diagonal Exploded 2.JPG Angles (Oriented precisely matching /images/2.JPG)
        // Vessel extends up-right, components explode down-left toward viewer
        const diagRotX = 0.38;
        const diagRotY = Math.PI - 0.72; // ~2.42 rad
        const diagRotZ = 0.44;
        const diagPosX = isNarrow ? 0 : 0.6;
        const diagCamZ = isNarrow ? 12.0 : 10.5;

        // Smooth cubic ease between Front View and 2.JPG View
        const easeP = p * p * (3 - 2 * p);

        targetRotationX = lerp(frontRotX, diagRotX, easeP);
        targetRotationY = lerp(frontRotY, diagRotY, easeP);
        targetRotationZ = lerp(frontRotZ, diagRotZ, easeP);
        targetPositionX = lerp(frontPosX, diagPosX, easeP);
        targetCameraZ = lerp(frontCamZ, diagCamZ, easeP);
      }

      // 3. Synchronize Narrative Story Cards & Active Step Buttons
      let activeIndex = 0;
      if (progress >= 0.75) activeIndex = 3;
      else if (progress >= 0.50) activeIndex = 2;
      else if (progress >= 0.22) activeIndex = 1;
      else activeIndex = 0;

      storyCards.forEach((card, idx) => {
        if (idx === activeIndex) card.classList.add('active');
        else card.classList.remove('active');
      });

      stepButtons.forEach((btn, idx) => {
        if (idx === activeIndex) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      // Synchronize bottom WhatsApp button with the active spare part
      const dynamicWaBtn = document.getElementById('stageDynamicWaBtn');
      if (dynamicWaBtn) {
        const stageInquiries = [
          { label: 'Inquire Full Assembly', msg: 'Hi GS Technology, I would like to inquire about the complete RO Pressure Vessel & End Cap System.' },
          { label: 'Inquire Screws & Ring', msg: 'Hi GS Technology, I would like to inquire about the SS 316 Beveled Retaining Ring and Hex Cap Screws.' },
          { label: 'Inquire End Cap & Split Ring', msg: 'Hi GS Technology, I would like to inquire about the Machined End Cap Hub (with Permeate Port) and Split Ring.' },
          { label: 'Inquire O-Ring & Thrust Spares', msg: 'Hi GS Technology, I would like to inquire about the EPDM O-Ring, Fluted Thrust Collar, and Blue FRP Vessel.' }
        ];
        const item = stageInquiries[activeIndex] || stageInquiries[0];
        dynamicWaBtn.href = `https://wa.me/919994211913?text=${encodeURIComponent(item.msg)}`;
        const textSpan = dynamicWaBtn.querySelector('span');
        if (textSpan) {
          textSpan.textContent = item.label;
        }
      }
    }

    // -------------------------------------------------------------
    // 8. GSAP ScrollTrigger Binding & Scroll Synchronization
    // -------------------------------------------------------------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          applyScrollFrame(self.progress);
        }
      });

      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
      });
      window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
      });
    } else {
      window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const totalDist = section.offsetHeight - window.innerHeight;
        if (totalDist <= 0) return;
        const progress = Math.max(0, Math.min(1, -rect.top / totalDist));
        applyScrollFrame(progress);
      }, { passive: true });
    }

    // Initial frame: start at assembled Full Front View!
    applyScrollFrame(0.0);

    // -------------------------------------------------------------
    // 9. Render Loop with Complete 3-Axis Dampening
    // -------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth damping across all 3 rotation axes and horizontal position
      rootAssemblyGroup.rotation.x += (targetRotationX - rootAssemblyGroup.rotation.x) * 0.08;
      rootAssemblyGroup.rotation.y += (targetRotationY - rootAssemblyGroup.rotation.y) * 0.08;
      rootAssemblyGroup.rotation.z += (targetRotationZ - rootAssemblyGroup.rotation.z) * 0.08;
      rootAssemblyGroup.position.x += (targetPositionX - rootAssemblyGroup.position.x) * 0.08;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.08;

      // Animate Water Flow Particles through Permeate Port
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 2] -= particleSpeeds[i];
        if (pos[i * 3 + 2] < -3.5) {
          pos[i * 3 + 2] = 2.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle metallic light sweep across polished SS 316 rings
      rimLight.position.x = -3 + Math.sin(time * 0.6) * 1.5;
      rimLight.position.y = 5 + Math.cos(time * 0.6) * 1.2;

      renderer.render(scene, camera);
    }

    animate();

    // -------------------------------------------------------------
    // 10. Responsive Viewport Handler
    // -------------------------------------------------------------
    function handleResize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      applyScrollFrame(currentProgress);

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }

    window.addEventListener('resize', handleResize);
  }
})();
