// Ranuk Orbit — Photorealistic Globe v2 with arcs, sidebar, year filter, mobile timeline
const { useRef, useEffect, useState, useCallback, useMemo } = React;

const EARTH_TEX = 'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg';
const EARTH_BUMP = 'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png';
const EARTH_SPEC = 'https://unpkg.com/three-globe@2.31.0/example/img/earth-water.png';
const CLOUDS_TEX = 'https://unpkg.com/three-globe@2.31.0/example/img/clouds.png';

function latLngToVec3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Great-circle arc between two points on a sphere
function greatCircleCurve(start, end, segments = 64, lift = 0.4) {
  const points = [];
  const startN = start.clone().normalize();
  const endN = end.clone().normalize();
  const angle = startN.angleTo(endN);
  const sin = Math.sin(angle);
  const radius = start.length();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = Math.sin((1 - t) * angle) / sin;
    const b = Math.sin(t * angle) / sin;
    const p = startN.clone().multiplyScalar(a).add(endN.clone().multiplyScalar(b));
    // arc lift — peaks at t=0.5
    const altMul = 1 + Math.sin(Math.PI * t) * lift;
    p.multiplyScalar(radius * altMul);
    points.push(p);
  }
  return points;
}

function Globe({ locations, onLocationClick, highlightId }) {
  const mountRef = useRef();
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const stateRef = useRef({ pinMeshes: [], arcLines: [], pinGroup: null, locById: {}, pinByIdx: {} });

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    let cleanup = null;
    let cancelled = false;

    // Carga Three.js de forma diferida; solo arma el globo cuando el lib esté listo
    const loadAndInit = async () => {
      if (window.__loadThree) await window.__loadThree();
      if (cancelled || !mountRef.current) return;
      cleanup = initGlobe();
    };

    const initGlobe = () => {
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.42));
    const dl = new THREE.DirectionalLight(0xfff5e6, 1.2);
    dl.position.set(5, 3, 5);
    scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0x3b5998, 0.3);
    dl2.position.set(-5, -2, -3);
    scene.add(dl2);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    const earthGeo = new THREE.SphereGeometry(2, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_TEX),
      bumpMap: loader.load(EARTH_BUMP),
      bumpScale: 0.04,
      specularMap: loader.load(EARTH_SPEC),
      specular: new THREE.Color(0x1a3a5f),
      shininess: 18,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    const cloudsGeo = new THREE.SphereGeometry(2.024, 64, 64);
    const cloudsMat = new THREE.MeshLambertMaterial({
      map: loader.load(CLOUDS_TEX),
      transparent: true, opacity: 0.32, depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(clouds);

    const atmoMat = new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, depthWrite: false,
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float i = pow(0.62 - dot(vNormal, vec3(0,0,1.0)), 2.5); gl_FragColor = vec4(0.36, 0.62, 0.95, 1.0) * i; }`
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(2.16, 64, 64), atmoMat);
    scene.add(atmo);

    // Pins group
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    stateRef.current.pinGroup = pinGroup;
    stateRef.current.pinMeshes = [];
    stateRef.current.locById = {};
    stateRef.current.pinByIdx = {};

    locations.forEach((loc, i) => {
      const pos = latLngToVec3(loc.coords.lat, loc.coords.lng, 2.05);
      const color = new THREE.Color(loc.accentColor || '#ffd700');
      const grp = new THREE.Group();
      grp.position.copy(pos);
      grp.lookAt(0, 0, 0);
      grp.rotateX(Math.PI);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.16, 8),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 })
      );
      beam.position.y = 0.08;
      grp.add(beam);

      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      ball.userData = { idx: i, locId: loc.id, name: loc.name, country: loc.country };
      grp.add(ball);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.035, 0.05, 32),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2;
      ring.userData = { isRing: true, idx: i };
      grp.add(ring);

      pinGroup.add(grp);
      stateRef.current.pinMeshes.push(ball);
      stateRef.current.locById[loc.id] = { idx: i, group: grp, ring };
      stateRef.current.pinByIdx[i] = grp;
    });

    // ── Great-circle arcs between consecutive locations (oceanic, animated draw)
    const arcGroup = new THREE.Group();
    pinGroup.add(arcGroup);
    const arcLines = [];
    for (let i = 0; i < locations.length - 1; i++) {
      const a = latLngToVec3(locations[i].coords.lat, locations[i].coords.lng, 2.05);
      const b = latLngToVec3(locations[i+1].coords.lat, locations[i+1].coords.lng, 2.05);
      const pts = greatCircleCurve(a, b, 80, 0.18);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x1E6FA4,
        transparent: true,
        opacity: 0.0, // animated up
      });
      const line = new THREE.Line(geom, mat);
      line.userData = { totalPoints: pts.length, drawIndex: 0 };
      // hide all but first point initially
      geom.setDrawRange(0, 1);
      arcGroup.add(line);
      arcLines.push(line);
    }
    stateRef.current.arcLines = arcLines;

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredIdx = null;

    const onMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(stateRef.current.pinMeshes);
      if (hits.length > 0) {
        const idx = hits[0].object.userData.idx;
        if (idx !== hoveredIdx) {
          hoveredIdx = idx;
          setHovered(idx);
          document.body.style.cursor = 'pointer';
        }
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        if (hoveredIdx !== null) {
          hoveredIdx = null;
          setHovered(null);
          document.body.style.cursor = 'default';
        }
      }
    };
    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(stateRef.current.pinMeshes);
      if (hits.length > 0) onLocationClick(hits[0].object.userData.locId);
    };

    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('click', onClick);

    // Drag rotation
    let isDown = false, lastX = 0, lastY = 0, autoRotate = true;
    let rotX = 0, rotY = 0;
    const dist = 5.5;
    const updateCam = () => {
      camera.position.x = dist * Math.sin(rotY) * Math.cos(rotX);
      camera.position.y = dist * Math.sin(rotX);
      camera.position.z = dist * Math.cos(rotY) * Math.cos(rotX);
      camera.lookAt(0, 0, 0);
    };
    const onDown = (e) => { isDown = true; autoRotate = false; lastX = e.clientX; lastY = e.clientY; };
    const onUp = () => { isDown = false; };
    const onDrag = (e) => {
      if (!isDown) return;
      // Drag horizontal: arrastrar a la izquierda → globo gira a la derecha (estilo Google Earth)
      rotY -= (e.clientX - lastX) * 0.005;
      rotX = Math.max(-1.2, Math.min(1.2, rotX - (e.clientY - lastY) * 0.005));
      lastX = e.clientX; lastY = e.clientY;
      updateCam();
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onDrag);

    // Animate
    let t = 0, rafId;
    let arcAnimT = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.016;
      if (autoRotate) {
        earth.rotation.y += 0.0015;
        clouds.rotation.y += 0.002;
        pinGroup.rotation.y = earth.rotation.y;
      }
      // Pulse rings
      stateRef.current.pinGroup.children.forEach((grp, i) => {
        if (!grp.children) return;
        const ring = grp.children.find(c => c.userData?.isRing);
        if (ring) {
          const s = 1 + (Math.sin(t * 1.5 + i * 0.4) * 0.5 + 0.5) * 0.6;
          ring.scale.setScalar(s);
          ring.material.opacity = 1 - (s - 1) / 0.6;
        }
      });
      // Animate arc draw — staggered, looping
      arcAnimT += 0.01;
      arcLines.forEach((line, i) => {
        const total = line.userData.totalPoints;
        const localT = (arcAnimT - i * 0.4) % 8;
        if (localT < 0 || localT > 4) {
          line.material.opacity = 0;
          line.geometry.setDrawRange(0, 0);
        } else if (localT < 1.6) {
          // drawing
          const k = localT / 1.6;
          line.geometry.setDrawRange(0, Math.floor(k * total));
          line.material.opacity = 0.45;
        } else {
          // hold then fade
          const fade = Math.max(0, 1 - (localT - 1.6) / 2.4);
          line.material.opacity = 0.45 * fade;
          line.geometry.setDrawRange(0, total);
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Expose programmatic highlight for sidebar interaction
    stateRef.current.highlight = (locId) => {
      const target = stateRef.current.locById[locId];
      if (!target) return;
      const ring = target.ring;
      if (ring) {
        ring.material.color.setHex(0xffffff);
        setTimeout(() => {
          const loc = locations[target.idx];
          ring.material.color.set(loc.accentColor || '#ffd700');
        }, 900);
      }
      // Rotate to face the pin
      const loc = locations[target.idx];
      const targetLng = loc.coords.lng;
      const targetLat = loc.coords.lat;
      rotY = -((targetLng) * Math.PI / 180) - earth.rotation.y;
      rotX = Math.max(-1.2, Math.min(1.2, (targetLat) * Math.PI / 180 * 0.6));
      autoRotate = false;
      updateCam();
    };

    return () => {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onDrag);
      window.removeEventListener('resize', onResize);
      try { mount.removeChild(renderer.domElement); } catch (e) {}
      renderer.dispose();
    };
    }; // end initGlobe

    loadAndInit();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [locations, onLocationClick]);

  // External highlight via prop
  useEffect(() => {
    if (highlightId && stateRef.current.highlight) {
      stateRef.current.highlight(highlightId);
    }
  }, [highlightId]);

  return (
    <div className="globe-container" ref={mountRef} style={{ position: 'relative' }}>
      {hovered !== null && locations[hovered] && (
        <div className="globe-tooltip" style={{
          left: tooltipPos.x + 'px', top: tooltipPos.y + 'px',
        }}>
          <div className="globe-tt-name">{locations[hovered].name}</div>
          <div className="globe-tt-country">{locations[hovered].country}</div>
        </div>
      )}
    </div>
  );
}

// ── AtlasSection: globe + sidebar + year filter chips, mobile = vertical timeline
function AtlasSection() {
  const { lang, t } = useLang();
  const { open } = useLightbox();
  const [year, setYear] = useState(null); // null = all
  const [highlightId, setHighlightId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 900px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const locs = useMemo(() => {
    const all = window.LOCATIONS_V2 || [];
    return year ? all.filter(l => l.year === year) : all;
  }, [year]);

  const handleClick = useCallback((id) => {
    const loc = window.LOCATIONS_V2.find(l => l.id === id);
    if (loc) open(loc.media.map(m => ({ ...m, _displayTitle: pick(m.title, lang) })), 0);
  }, [open, lang]);

  const handleSidebarClick = useCallback((loc) => {
    setHighlightId(loc.id);
    setTimeout(() => setHighlightId(null), 50);
  }, []);

  const years = window.YEARS_V2 || [];

  return (
    <section className="section section-light" id="explore">
      <div className="container">
        <div className="atlas-head">
          <div>
            <span className="section-overline">{t.atlas.overline}</span>
            <h2 className="section-title">{t.atlas.title}</h2>
            <p className="section-subtitle">{t.atlas.sub}</p>
          </div>
          <div className="year-chips">
            <button className={`year-chip${year === null ? ' is-active' : ''}`} onClick={() => setYear(null)}>{t.atlas.year_all}</button>
            {years.map(y => (
              <button key={y} className={`year-chip${year === y ? ' is-active' : ''}`} onClick={() => setYear(y)}>{y}</button>
            ))}
          </div>
        </div>

        {!isMobile ? (
          <div className="atlas-grid">
            <div className="globe-wrap">
              <Globe
                locations={locs.map(l => ({ ...l, name: pick(l.name, lang), country: pick(l.country, lang) }))}
                onLocationClick={handleClick}
                highlightId={highlightId}
              />
              <div className="globe-hint">{t.atlas.hint}</div>
            </div>
            <aside className="atlas-sidebar">
              <h3 className="atlas-sidebar-title">{t.atlas.sidebar_title}</h3>
              <ul className="atlas-list">
                {locs.map(loc => (
                  <li
                    key={loc.id}
                    className="atlas-list-item"
                    onClick={() => handleSidebarClick(loc)}
                    onDoubleClick={() => handleClick(loc.id)}
                  >
                    <span className="atlas-list-flag">{loc.flag}</span>
                    <div className="atlas-list-text">
                      <div className="atlas-list-name">{pick(loc.name, lang)}</div>
                      <div className="atlas-list-country">{pick(loc.country, lang)} · {loc.year}</div>
                    </div>
                    <span className="atlas-list-dot" style={{ background: loc.accentColor }} />
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        ) : (
          // Mobile: vertical timeline with flag + thumb
          <div className="atlas-timeline">
            {locs.map((loc, i) => (
              <div key={loc.id} className="timeline-item" onClick={() => handleClick(loc.id)}>
                <div className="timeline-rail">
                  <span className="timeline-dot" style={{ background: loc.accentColor }} />
                  {i < locs.length - 1 && <span className="timeline-line" />}
                </div>
                <div className="timeline-card">
                  <div className="timeline-thumb" style={{ backgroundImage: `url('${loc.cover}')` }} />
                  <div className="timeline-body">
                    <div className="timeline-meta">
                      <span className="timeline-flag">{loc.flag}</span>
                      <span className="timeline-year">{loc.year}</span>
                    </div>
                    <h4 className="timeline-name">{pick(loc.name, lang)}</h4>
                    <p className="timeline-country">{pick(loc.country, lang)}</p>
                    <p className="timeline-desc">{pick(loc.description, lang)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { Globe, AtlasSection });
