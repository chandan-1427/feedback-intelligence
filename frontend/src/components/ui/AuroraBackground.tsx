import React, { useEffect, useRef, useMemo } from "react";

/**
 * AuroraBackground
 * Adjusted for higher visibility while maintaining HiDPI clarity and 
 * delta-time consistency.
 */
const AuroraBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const layers = useMemo(
    () => [
      {
        color: "90, 0, 145",   // Brand Primary
        amplitudeX: 0.12,
        amplitudeY: 90,
        speed: 0.00025,
        phase: 0,
        opacity: 0.22,         // Increased from 0.14
        yBase: 0.35,
        radiusX: 1.1,
        radiusY: 0.3,
      },
      {
        color: "168, 85, 247", // Logic Violet
        amplitudeX: 0.08,
        amplitudeY: 120,
        speed: 0.00018,
        phase: Math.PI * 0.65,
        opacity: 0.18,         // Increased from 0.10
        yBase: 0.45,
        radiusX: 0.9,
        radiusY: 0.35,
      },
      {
        color: "58, 0, 110",   // Depth Indigo
        amplitudeX: 0.15,
        amplitudeY: 70,
        speed: 0.00032,
        phase: Math.PI * 1.25,
        opacity: 0.14,         // Increased from 0.08
        yBase: 0.55,
        radiusX: 1.3,
        radiusY: 0.25,
      },
    ],
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let lastTime = performance.now();
    let totalElapsed = 0;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = motionQuery.matches;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const render = (timestamp: number) => {
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!prefersReducedMotion) {
        totalElapsed += delta;
      }

      const { width, height } = canvas.getBoundingClientRect();

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      layers.forEach((layer) => {
        const timeFactor = totalElapsed * layer.speed;
        
        const waveX = Math.cos(timeFactor + layer.phase) * (width * layer.amplitudeX);
        const waveY = Math.sin(timeFactor + layer.phase) * layer.amplitudeY;
        
        const centerX = width * 0.5 + waveX;
        const centerY = height * layer.yBase + waveY;

        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, width * 0.8
        );

        // Gradient stops adjusted for a "fuller" color falloff
        gradient.addColorStop(0, `rgba(${layer.color}, ${layer.opacity})`);
        gradient.addColorStop(0.4, `rgba(${layer.color}, ${layer.opacity * 0.6})`); 
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          width * layer.radiusX,
          height * layer.radiusY,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    if (prefersReducedMotion) {
      render(performance.now());
    } else {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [layers]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#0D0E0E]">
      <canvas
        ref={canvasRef}
        // Increased master opacity from 60 to 90
        className="block w-full h-full opacity-90 transition-opacity duration-1000"
        aria-hidden="true"
      />

      {/* Masking adjusted slightly (80%) to let more color breathe through the edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0E0E] via-transparent to-[#0D0E0E] opacity-80" />
      
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AuroraBackground;