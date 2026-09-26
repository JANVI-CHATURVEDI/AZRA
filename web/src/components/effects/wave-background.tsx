"use client";

import { useEffect, useRef } from "react";

const PALETTE = {
  baseWarmBlack: "#0c0c0b",
  elevated: "#161614",
  softLift: "#1f1f1c",
  highlightCrest: "#2a2a26",
  deepShadow: "#121211",
};

const WAVE_ALPHA = 1;

const VERTEX_SHADER = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float elev = snoise(vec2(pos.x * 0.28 + uTime * 0.08, pos.y * 0.22 + uTime * 0.06)) * 0.55;
    elev += snoise(vec2(pos.x * 0.6 - uTime * 0.04, pos.y * 0.5 + uTime * 0.07)) * 0.28;
    elev += snoise(vec2(pos.x * 1.3 + uTime * 0.025, pos.y * 1.1)) * 0.12;

    pos.z += elev;
    vElevation = elev;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float m1 = smoothstep(-0.2, 0.6, vElevation);
    float m2 = smoothstep(0.1, 0.8, vUv.y + vElevation * 0.3);

    vec3 color = mix(uColor1, uColor2, m1 * 0.7);
    color = mix(color, uColor3, m2 * 0.5);
    color = mix(color, uColor4, max(vElevation, 0.0) * 0.6);
    color = mix(color, uColor5, (1.0 - m1) * 0.4);

    color += max(vElevation, 0.0) * 0.18;

    float vignette = 1.0 - length(vUv - 0.5) * 0.65;
    color *= vignette;

    gl_FragColor = vec4(color, ${WAVE_ALPHA.toFixed(1)});
  }
`;

export function WaveBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let dispose: (() => void) | null = null;

    void (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      const renderer = (() => {
        try {
          return new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          });
        } catch {
          return null;
        }
      })();
      if (!renderer) return;

      const gl = renderer.getContext();
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const rendererName = String(
        debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : gl.getParameter(gl.RENDERER),
      );
      const softwareGl = /swiftshader|llvmpipe|softwar|basic render/i.test(rendererName);

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(softwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.display = "block";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
      );
      camera.position.z = 5.2;

      const segments = Math.min(window.innerWidth, window.innerHeight) < 700 ? 120 : 180;
      const geometry = new THREE.PlaneGeometry(12, 9, segments, segments);

      const swatch = (hex: string) =>
        new THREE.Color().setHex(parseInt(hex.slice(1), 16), THREE.LinearSRGBColorSpace);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: swatch(PALETTE.baseWarmBlack) },
          uColor2: { value: swatch(PALETTE.elevated) },
          uColor3: { value: swatch(PALETTE.softLift) },
          uColor4: { value: swatch(PALETTE.highlightCrest) },
          uColor5: { value: swatch(PALETTE.deepShadow) },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        side: THREE.DoubleSide,
      });

      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -0.25;
      scene.add(plane);

      let elapsed = 0;
      let lastFrame = performance.now();
      let frame = 0;

      const draw = () => {
        material.uniforms.uTime.value = elapsed;
        plane.rotation.z = Math.sin(elapsed * 0.06) * 0.03;
        renderer.render(scene, camera);
      };

      const tick = (now: number) => {
        elapsed += Math.min((now - lastFrame) / 1000, 0.1);
        lastFrame = now;
        draw();
        frame = requestAnimationFrame(tick);
      };

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      const sync = () => {
        const animate = !reducedMotion.matches && document.visibilityState === "visible";
        if (animate) {
          if (!frame) {
            lastFrame = performance.now();
            frame = requestAnimationFrame(tick);
          }
        } else {
          if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
          }
          if (reducedMotion.matches) elapsed = 0;
          draw();
        }
      };

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!frame) draw();
      };

      sync();
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);
      document.addEventListener("visibilitychange", sync);
      reducedMotion.addEventListener("change", sync);

      dispose = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
        document.removeEventListener("visibilitychange", sync);
        reducedMotion.removeEventListener("change", sync);
        renderer.domElement.remove();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      };
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-wave-bg
      data-wave-alpha={WAVE_ALPHA}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.9]"
    />
  );
}
