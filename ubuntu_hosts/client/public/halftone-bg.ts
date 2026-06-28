interface Dot {
  ox: number;
  oy: number;
  col: number;
  row: number;
}

type WaveMode = "diagonal" | "radial" | "serpentine";

interface HalftoneBgOptions {
  color?: string;
  spacing?: number;
  maxRadius?: number;
  minRadius?: number;
  speed?: number;
  mode?: WaveMode;
}

export function initHalftoneBg(
  canvas: HTMLCanvasElement,
  options: HalftoneBgOptions = {}
): () => void {
  const {
    color = "180,140,255",
    spacing = 28,
    maxRadius = 7,
    minRadius = 1.2,
    speed = 0.1,
    mode = "diagonal",
  } = options;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) throw new Error("Canvas 2D context not available");

  let W = 0;
  let H = 0;
  let dots: Dot[] = [];
  let t = 0;
  let animFrameId: number;

  function resize(): void {
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;

    const sp = spacing * devicePixelRatio;
    const cols = Math.ceil(W / sp) + 2;
    const rows = Math.ceil(H / sp) + 2;

    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ ox: c * sp, oy: r * sp, col: c, row: r });
      }
    }
  }

  function getDotParams(d: Dot): { r: number; ox: number; oy: number } {
    const sp = spacing * devicePixelRatio;

    if (mode === "radial") {
      const cols = Math.ceil(W / sp) + 2;
      const rows = Math.ceil(H / sp) + 2;
      const cx = (cols / 2) * sp;
      const cy = (rows / 2) * sp;
      const dist = Math.sqrt((d.ox - cx) ** 2 + (d.oy - cy) ** 2);
      const wave = Math.sin(dist * 0.018 - t * 2.2);
      const r = (minRadius + (maxRadius - minRadius) * (0.5 + 0.5 * wave)) * devicePixelRatio;
      const angle = Math.atan2(d.oy - cy, d.ox - cx);
      const push = Math.sin(dist * 0.02 - t * 2) * 4 * devicePixelRatio;
      return { r, ox: Math.cos(angle) * push, oy: Math.sin(angle) * push };
    }

    if (mode === "serpentine") {
      const amp = Math.sin(d.row * 0.4 + t * 0.5);
      const wave = Math.sin((d.col * 0.5 + t * 1.4) * 0.8 + amp);
      const r = (minRadius + (maxRadius - minRadius) * (0.5 + 0.5 * wave)) * devicePixelRatio;
      const oy = Math.sin(d.col * 0.3 + t * 1.1) * 5 * devicePixelRatio;
      return { r, ox: 0, oy };
    }

    // default: diagonal
    const wave =
      Math.sin((d.col * 0.35 + d.row * 0.2 + t * 0.9) * 0.7) +
      Math.cos((d.col * 0.2 - d.row * 0.3 + t * 0.6) * 0.6);
    const r = (minRadius + (maxRadius - minRadius) * (0.5 + 0.25 * wave)) * devicePixelRatio;
    const ox = Math.sin(d.row * 0.3 + t * 0.7) * 3 * devicePixelRatio;
    const oy = Math.cos(d.col * 0.3 + t * 0.5) * 3 * devicePixelRatio;
    return { r, ox, oy };
  }

  function draw(): void {
    ctx.clearRect(0, 0, W, H);
    t += speed;

    for (const d of dots) {
      const { r, ox, oy } = getDotParams(d);
      const clampedR = Math.max(0.5, r);
      const alpha = (
        0.15 + 0.85 * ((clampedR / devicePixelRatio - minRadius) / (maxRadius - minRadius))
      ).toFixed(2);

      ctx.beginPath();
      ctx.arc(d.ox + ox, d.oy + oy, clampedR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.fill();
    }

    animFrameId = requestAnimationFrame(draw);
  }

  const onResize = (): void => resize();
  window.addEventListener("resize", onResize);

  resize();
  draw();

  // Returns a cleanup function — call it in useEffect's return
  return () => {
    cancelAnimationFrame(animFrameId);
    window.removeEventListener("resize", onResize);
  };
}