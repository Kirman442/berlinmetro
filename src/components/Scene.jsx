import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Tubes, Stations, Shafts, Transfers, SurfaceTraces } from './Metro';
import Guides from './Guides';
import Surface from './Surface';
import Labels from './Labels';

// Плавный перелёт камеры к ракурсу
function CameraRig({ api }) {
  const { camera, controls } = useThree();
  const anim = useRef(null);
  api.current = (pos, target, ms = 900) => {
    if (!controls) return;
    anim.current = { t0: performance.now(), ms, p0: camera.position.clone(), p1: new THREE.Vector3(...pos), q0: controls.target.clone(), q1: new THREE.Vector3(...target) };
  };
  useFrame(() => {
    const a = anim.current;
    if (!a || !controls) return;
    const t = Math.min(1, (performance.now() - a.t0) / a.ms);
    const k = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    camera.position.lerpVectors(a.p0, a.p1, k);
    controls.target.lerpVectors(a.q0, a.q1, k);
    controls.update();
    if (t >= 1) anim.current = null;
  });
  return null;
}

const Scene = forwardRef(function Scene(props, ref) {
  const { data, view, Y, SY, opts, focusLine, selectedId, labelItems, onHover, onPick, extent, bg } = props;
  const overlay = useRef();
  const fly = useRef(null);

  const views = useMemo(() => {
    const { x0, x1, z0, z1 } = extent;
    const cx = (x0 + x1) / 2; const cz = (z0 + z1) / 2; const k = Math.max(x1 - x0, z1 - z0) / 470;
    const ty = -8 * opts.exag;
    return {
      iso: [[cx - 120 * k, 120 * k, cz + 200 * k], [cx, ty, cz + 10 * k]],
      top: [[cx, 560 * k, cz + 0.1], [cx, 0, cz]],
      side: [[cx, ty, cz + 520 * k], [cx, ty, cz]],
      below: [[cx - 160 * k, -300 * k, cz + 230 * k], [cx, ty, cz]],
    };
  }, [extent, opts.exag]);

  useImperativeHandle(ref, () => ({
    view(v) { const [p, t] = views[v]; fly.current?.(p, t); },
    focus(x, y, z, dist = 3500) { fly.current?.([x - dist * 0.5, y + dist * 0.6, z + dist * 0.8], [x, y, z]); },
  }), [views]);

  const [p0, t0] = views.iso;

  return (
    <div className="scene">
      <Canvas
        camera={{ position: p0, fov: 42, near: 20, far: 400000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        onPointerMissed={(e) => { if (e.type === 'click') onPick(null); }}
      >
        <color attach="background" args={[bg]} />
        <hemisphereLight args={['#ffffff', '#445060', 1.6]} />
        <directionalLight position={[-20000, 40000, 15000]} intensity={1.4} />
        <directionalLight position={[15000, -30000, -10000]} intensity={0.5} />
        <Surface extent={extent} kind={opts.surface} opacity={opts.surfOp} depthBottom={(opts.mode === 'abs' ? 15 - 35 : -25) * opts.exag} />
        <Guides extent={extent} mode={opts.mode} exag={opts.exag} showGrid={opts.grid} showLevels={opts.levels} />
        {opts.mode === 'abs' && opts.grid && <SurfaceTraces sections={data.sections} visible={view.sectionVisible} SY={SY} />}
        {opts.shafts && <Shafts stations={view.stations} Y={Y} SY={SY} />}
        <Tubes sections={data.sections} visible={view.sectionVisible} Y={Y} colorMode={opts.color} focusLine={focusLine} onHover={onHover} onPick={onPick} />
        <Stations stations={view.stations} Y={Y} colorMode={opts.color} focusLine={focusLine} selectedId={selectedId} onHover={onHover} onPick={onPick} />
        {opts.transfers && <Transfers pairs={view.transfers} byId={view.byId} Y={Y} />}
        <Labels items={labelItems} overlay={overlay} />
        <CameraRig api={fly} />
        <OrbitControls makeDefault target={t0} enableDamping dampingFactor={0.08} minDistance={300} maxDistance={150000} />
      </Canvas>
      <div className="labels" ref={overlay} />
    </div>
  );
});

export default Scene;
