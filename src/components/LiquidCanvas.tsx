"use client";
import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

// Domain-warped simplex noise, tinted in the brand palette, pushed around by the pointer.
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform vec2 uVel;uniform float uHover;
varying vec2 vUv;
vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}
float noise(vec2 p){const float K1=.366025404;const float K2=.211324865;vec2 i=floor(p+(p.x+p.y)*K1);vec2 a=p-i+(i.x+i.y)*K2;float m=step(a.y,a.x);vec2 o=vec2(m,1.-m);vec2 b=a-o+K2;vec2 c=a-1.+2.*K2;vec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.);vec3 n=h*h*h*h*vec3(dot(a,hash(i)),dot(b,hash(i+o)),dot(c,hash(i+1.)));return dot(n,vec3(70.));}
float fbm(vec2 p){float f=0.;float a=.5;for(int i=0;i<4;i++){f+=a*noise(p);p*=2.02;a*=.5;}return f;}
void main(){
  float asp=uRes.x/uRes.y;
  vec2 p=(vUv-.5)*vec2(asp,1.);
  vec2 m=(uMouse-.5)*vec2(asp,1.);
  float d=length(p-m);
  float infl=exp(-d*d*5.)*uHover;
  p-=uVel*infl*.9;
  p+=normalize(p-m+1e-4)*infl*.035*sin(uTime*3.-d*22.);
  float t=uTime*.045;
  vec2 s=p*.62;
  vec2 q=vec2(fbm(s+t),fbm(s+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(s+1.3*q+vec2(1.7,9.2)+t*1.2),fbm(s+1.3*q+vec2(8.3,2.8)-t));
  float f=fbm(s+1.1*r);
  vec3 cream=vec3(.984,.972,.955);
  vec3 blush=vec3(.957,.878,.855);
  vec3 rose=vec3(.914,.792,.757);
  vec3 sage=vec3(.855,.894,.843);
  vec3 sky=vec3(.890,.933,.953);
  vec3 col=mix(cream,blush,smoothstep(-.2,.7,f)*.85);
  col=mix(col,sage,smoothstep(.3,1.,length(q))*.4);
  col=mix(col,sky,smoothstep(.2,.9,r.y)*.35);
  col=mix(col,rose,smoothstep(.45,1.,f+r.x*.25)*.35);
  float sheen=pow(1.-abs(sin(f*3.2+r.x*1.6)),14.);
  col+=sheen*.045;
  col+=vec3(1.,.97,.95)*exp(-d*d*9.)*.1*uHover;
  float g=fract(sin(dot(vUv*uRes,vec2(12.9898,78.233))+uTime)*43758.5453);
  col+=(g-.5)*.02;
  gl_FragColor=vec4(col,1.);
}`;

export default function LiquidCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // the field is soft enough to render well below native resolution
    const scale = coarse ? 0.35 : 0.55;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uVel = u("uVel"), uHover = u("uHover");

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, vx: 0, vy: 0, hover: 0, target: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
      mouse.target = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, running = false, last = performance.now(), time = Math.random() * 100;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      const px = mouse.x, py = mouse.y;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.vx += ((mouse.x - px) * 6 - mouse.vx) * 0.12;
      mouse.vy += ((mouse.y - py) * 6 - mouse.vy) * 0.12;
      mouse.hover += (mouse.target - mouse.hover) * 0.04;
      mouse.target *= 0.985;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform2f(uVel, mouse.vx, mouse.vy);
      gl.uniform1f(uHover, 0.25 + mouse.hover * 0.75);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!canvas.dataset.ready) canvas.dataset.ready = "1";
      if (running) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    frame(performance.now());

    // only animate while on screen and the tab is visible
    let inView = false;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) start(); else stop(); });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : inView && start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`opacity-0 transition-opacity duration-1000 data-[ready]:opacity-100 ${className}`} />;
}
