import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CinematicIntroProps {
  onComplete: () => void;
  isTransitioning?: boolean;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, isTransitioning = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  const [showBrandText, setShowBrandText] = useState(false);

  const skipIntro = () => {
    if (doneRef.current) return;
    doneRef.current = true;

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    onComplete();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b3d2e, 8, 18);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.1, 9);

    // Lights
    const hemi = new THREE.HemisphereLight(0xddeeff, 0x223322, 0.6);
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0x88ffcc, 0.9);
    rim.position.set(-4, 2, -3);
    const fill = new THREE.PointLight(0xfff0d0, 0.5, 15);
    fill.position.set(0, 0.5, 4);
    scene.add(hemi, key, rim, fill);

    // Ground
    const groundGeo = new THREE.CircleGeometry(30, 32);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x0a3328,
      transparent: true,
      opacity: 0.55,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.1;
    ground.matrixAutoUpdate = false;
    ground.updateMatrix();
    scene.add(ground);

    // Dust (lightweight)
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3 + 0] = (Math.random() - 0.5) * 18;
      dustPos[i * 3 + 1] = Math.random() * 6 - 1;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Timing
    const start = performance.now();
    const DURATION = 3800; // camera move duration
    const HOLD_AFTER_MS = 1200; // keep brand text visible before skip

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    let frameCount = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = start;

    const animate = () => {
      if (doneRef.current) return;

      const now = performance.now();
      if (now - lastFrameTime < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const t = Math.min(1, (now - start) / DURATION);
      frameCount++;

      if (frameCount % 2 === 0) {
        dust.rotation.y += 0.0008;
      }

      const arc = easeInOutQuad(t);
      const dolly = easeOutCubic(t);

      const radius = 9 - dolly * 4.8;
      const theta = (1.15 - arc * 0.75) * Math.PI;
      const yLift = 1.6 - arc * 0.8;

      camera.position.x = Math.cos(theta) * radius * 0.22;
      camera.position.z = radius;
      camera.position.y = yLift;
      camera.lookAt(0, 0.1, 0);

      // Stagger brand text in a touch later for smoother feel
      if (t > 0.42 && !showBrandText) setShowBrandText(true);

      renderer.render(scene, camera);
      lastFrameTime = now;

      if (t >= 1 && !doneRef.current) {
        // Hold a bit so the user registers the brand before skipping
        timeoutIdRef.current = window.setTimeout(skipIntro, HOLD_AFTER_MS);
        return;
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        skipIntro();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      doneRef.current = true;
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      // Proper Three.js cleanup
      if (rendererRef.current) {
        // Dispose of geometries and materials
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
          if (object instanceof THREE.Points) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
          }
        });
        
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [onComplete]); // Removed showBrandText dependency to prevent re-initialization

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full block"
        style={{
          background:
            'radial-gradient(1200px 800px at 50% 60%, #174c3a, #0b3d2e 60%)',
        }}
      />

      {/* Grain (define keyframes below) */}
      <div
        className="pointer-events-none fixed inset-0 mix-blend-soft-light"
        style={{
          opacity: 0.1,
          background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.6"/></svg>')`,
          animation: 'grain 2s steps(2) infinite',
          willChange: 'transform',
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 mix-blend-soft-light"
        style={{ boxShadow: 'inset 0 0 200px 80px rgba(0,0,0,.65)' }}
      />

      {/* Brand Text (no inline transform that overrides translate classes) */}
      <div className="fixed inset-0 grid place-items-center text-center text-[#f5f5dc]">
        <div
          className={`brand-wrap ${showBrandText ? 'show' : ''}`}
          aria-hidden={!showBrandText}
        >
          <h1 className="brand-title">
            The 90 Minute Drip
          </h1>
          <p className="brand-sub">Soccer Jerseys &amp; Sports Gear</p>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={skipIntro}
        className="fixed right-4 bottom-4 z-10 px-4 py-2 rounded-full border border-white/25 bg-black/25 text-white text-sm backdrop-blur-sm cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
        title="Skip (Space)"
        aria-label="Skip intro"
      >
        Skip
      </button>

      {/* Animations */}
      <style>{`
        @keyframes reveal {
          0% { opacity: 0; transform: translateY(16px) scale(0.985); filter: blur(6px); }
          60% { filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes grain {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-10%, -10%, 0); }
        }
        .brand-wrap {
          opacity: 0;
          will-change: opacity, transform, filter;
        }
        .brand-wrap.show {
          opacity: 1;
        }
        .brand-wrap.show .brand-title {
          animation: reveal 900ms cubic-bezier(.22,.61,.36,1) forwards;
        }
        .brand-wrap.show .brand-sub {
          animation: reveal 1100ms cubic-bezier(.22,.61,.36,1) forwards;
          animation-delay: 120ms;
        }
        .brand-title {
          margin: 0;
          font-weight: 800;
          letter-spacing: 0.02em;
          text-shadow: 0 6px 24px rgba(0,0,0,.65);
          font-size: clamp(28px, 6vw, 72px);
          line-height: 1.05;
        }
        .brand-sub {
          margin-top: 8px;
          opacity: 0.92;
          font-size: clamp(14px, 2.1vw, 20px);
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .brand-wrap.show .brand-title,
          .brand-wrap.show .brand-sub {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CinematicIntro;
