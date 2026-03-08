import { useEffect, useRef } from "react";

interface GraphNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  type: "normal" | "suspicious" | "fraud";
  label: string;
  phase: number;
}

interface GraphEdge {
  from: number;
  to: number;
  suspicious: boolean;
}

export default function HeroNetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Create nodes in a structured layout
    const nodeData: Omit<GraphNode, "x" | "y" | "baseX" | "baseY" | "phase">[] = [
      { r: 8, type: "normal", label: "A001" },
      { r: 6, type: "normal", label: "A002" },
      { r: 10, type: "suspicious", label: "A003" },
      { r: 7, type: "normal", label: "A004" },
      { r: 9, type: "fraud", label: "A005" },
      { r: 6, type: "normal", label: "A006" },
      { r: 7, type: "suspicious", label: "A007" },
      { r: 5, type: "normal", label: "A008" },
      { r: 8, type: "normal", label: "A009" },
      { r: 6, type: "fraud", label: "A010" },
      { r: 5, type: "normal", label: "A011" },
      { r: 7, type: "normal", label: "A012" },
      { r: 6, type: "suspicious", label: "A013" },
      { r: 5, type: "normal", label: "A014" },
      { r: 8, type: "normal", label: "A015" },
    ];

    const positions = [
      [0.15, 0.2], [0.3, 0.12], [0.5, 0.18], [0.72, 0.15], [0.85, 0.25],
      [0.1, 0.5], [0.32, 0.45], [0.55, 0.42], [0.75, 0.5], [0.9, 0.55],
      [0.2, 0.78], [0.4, 0.72], [0.58, 0.75], [0.78, 0.8], [0.5, 0.55],
    ];

    const nodes: GraphNode[] = nodeData.map((nd, i) => ({
      ...nd,
      baseX: positions[i][0],
      baseY: positions[i][1],
      x: positions[i][0],
      y: positions[i][1],
      phase: Math.random() * Math.PI * 2,
    }));

    const edges: GraphEdge[] = [
      { from: 0, to: 1, suspicious: false },
      { from: 1, to: 2, suspicious: true },
      { from: 2, to: 4, suspicious: true },
      { from: 2, to: 7, suspicious: false },
      { from: 3, to: 4, suspicious: true },
      { from: 4, to: 9, suspicious: true },
      { from: 5, to: 6, suspicious: false },
      { from: 6, to: 2, suspicious: true },
      { from: 6, to: 11, suspicious: false },
      { from: 7, to: 8, suspicious: false },
      { from: 8, to: 9, suspicious: true },
      { from: 9, to: 13, suspicious: true },
      { from: 10, to: 11, suspicious: false },
      { from: 11, to: 12, suspicious: true },
      { from: 12, to: 9, suspicious: true },
      { from: 13, to: 3, suspicious: false },
      { from: 14, to: 2, suspicious: true },
      { from: 14, to: 8, suspicious: false },
      { from: 0, to: 5, suspicious: false },
      { from: 1, to: 6, suspicious: false },
    ];

    const getColor = (type: string, alpha = 1) => {
      if (type === "fraud") return `rgba(239, 68, 68, ${alpha})`;
      if (type === "suspicious") return `rgba(245, 158, 11, ${alpha})`;
      return `rgba(96, 165, 250, ${alpha})`;
    };

    const draw = () => {
      time += 0.008;
      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      // Update floating positions
      for (const node of nodes) {
        node.x = node.baseX + Math.sin(time + node.phase) * 0.008;
        node.y = node.baseY + Math.cos(time * 0.7 + node.phase) * 0.01;
      }

      // Draw edges
      for (const edge of edges) {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const fx = from.x * cw, fy = from.y * ch;
        const tx = to.x * cw, ty = to.y * ch;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);

        if (edge.suspicious) {
          // Animated pulse on suspicious edges
          const pulse = (Math.sin(time * 2 + edge.from) + 1) / 2;
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 + pulse * 0.2})`;
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = "rgba(96, 165, 250, 0.12)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Arrow
        const angle = Math.atan2(ty - fy, tx - fx);
        const arrowLen = 6;
        const arrowX = tx - Math.cos(angle) * (to.r + 4);
        const arrowY = ty - Math.sin(angle) * (to.r + 4);
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - Math.cos(angle - 0.4) * arrowLen, arrowY - Math.sin(angle - 0.4) * arrowLen);
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - Math.cos(angle + 0.4) * arrowLen, arrowY - Math.sin(angle + 0.4) * arrowLen);
        ctx.strokeStyle = edge.suspicious ? "rgba(245, 158, 11, 0.3)" : "rgba(96, 165, 250, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const nx = node.x * cw;
        const ny = node.y * ch;

        // Glow for suspicious/fraud
        if (node.type !== "normal") {
          const glowPulse = (Math.sin(time * 1.5 + node.phase) + 1) / 2;
          const glowR = node.r + 8 + glowPulse * 6;
          const gradient = ctx.createRadialGradient(nx, ny, node.r, nx, ny, glowR);
          gradient.addColorStop(0, getColor(node.type, 0.2));
          gradient.addColorStop(1, getColor(node.type, 0));
          ctx.beginPath();
          ctx.arc(nx, ny, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, node.r, 0, Math.PI * 2);
        ctx.fillStyle = getColor(node.type, node.type === "normal" ? 0.6 : 0.85);
        ctx.fill();
        ctx.strokeStyle = getColor(node.type, 0.4);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "9px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, nx, ny + node.r + 12);
      }

      // Animated data packet on a suspicious edge
      const packetEdge = edges[4]; // A003 → A005
      const pFrom = nodes[packetEdge.from];
      const pTo = nodes[packetEdge.to];
      const t = (time * 0.3) % 1;
      const px = (pFrom.x + (pTo.x - pFrom.x) * t) * cw;
      const py = (pFrom.y + (pTo.y - pFrom.y) * t) * ch;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
      ctx.fill();

      // Second packet on another edge
      const packetEdge2 = edges[11]; // A009 → A013
      const p2From = nodes[packetEdge2.from];
      const p2To = nodes[packetEdge2.to];
      const t2 = ((time * 0.25) + 0.5) % 1;
      const p2x = (p2From.x + (p2To.x - p2From.x) * t2) * cw;
      const p2y = (p2From.y + (p2To.y - p2From.y) * t2) * ch;
      ctx.beginPath();
      ctx.arc(p2x, p2y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Overlay badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur border border-border/60 text-[10px] font-medium text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
        Live Network Analysis
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur border border-border/60 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-safe" />Normal</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-suspicious" />Suspicious</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Fraud</span>
      </div>
    </div>
  );
}
