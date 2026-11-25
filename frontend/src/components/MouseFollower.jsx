import React, { useEffect, useRef, useState } from "react";

const MouseFollowerCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles.current = [];
      for (let i = 0; i < 6; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawHexagon = (ctx, x, y, size, opacity) => {
      ctx.strokeStyle = `rgba(0, 255, 209, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const xPos = x + size * Math.cos(angle);
        const yPos = y + size * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    };

    const drawConnections = (ctx) => {
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.3;
            ctx.strokeStyle = `rgba(107, 70, 193, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
        
        // Connect to mouse
        const dx = particles.current[i].x - mouse.current.x;
        const dy = particles.current[i].y - mouse.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const opacity = (100 - distance) / 100 * 0.5;
          ctx.strokeStyle = `rgba(0, 255, 209, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(particles.current[i].x, particles.current[i].y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach((particle) => {
        // Move towards mouse gently
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        particle.x += dx * 0.01 + particle.speedX;
        particle.y += dy * 0.01 + particle.speedY;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Draw hexagon
        drawHexagon(ctx, particle.x, particle.y, particle.size * 3, particle.opacity);
      });
      
      // Draw connections
      drawConnections(ctx);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    resizeCanvas();
    createParticles();
    animate();
    
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="mouse-follower"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.6,
      }}
    />
  );
};

// Só é ativado em desktop (tela larga com mouse) e quando o usuário não pediu menos movimento.
export const MouseFollower = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 769px) and (hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(desktop.matches && !reduced.matches);

    update();
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return enabled ? <MouseFollowerCanvas /> : null;
};
