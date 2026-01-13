'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    alpha: number;
}

export default function AntigravityPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationRef = useRef<number>(0);

    // Initialize particles
    const initParticles = useCallback((width: number, height: number) => {
        const particles: Particle[] = [];
        const colors = [
            'rgba(139, 92, 246, alpha)', // violet
            'rgba(99, 102, 241, alpha)',  // indigo
            'rgba(236, 72, 153, alpha)',  // pink
            'rgba(59, 130, 246, alpha)',  // blue
            'rgba(16, 185, 129, alpha)',  // emerald
        ];

        for (let i = 0; i < 150; i++) {
            const alpha = Math.random() * 0.5 + 0.3;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -(Math.random() * 1 + 0.5), // Negative = upward (anti-gravity)
                radius: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)].replace('alpha', alpha.toString()),
                alpha,
            });
        }
        particlesRef.current = particles;
    }, []);

    // Animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas with trail effect
        ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
        ctx.fillRect(0, 0, width, height);

        const mouse = mouseRef.current;
        const repelRadius = 120;
        const repelStrength = 8;

        particlesRef.current.forEach((particle) => {
            // Calculate distance from mouse
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Repel particles from mouse/touch
            if (distance < repelRadius && distance > 0) {
                const force = (repelRadius - distance) / repelRadius;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * force * repelStrength * 0.1;
                particle.vy += Math.sin(angle) * force * repelStrength * 0.1;
            }

            // Apply anti-gravity (upward force)
            particle.vy -= 0.02;

            // Apply slight drag
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.y < -particle.radius) {
                particle.y = height + particle.radius;
                particle.x = Math.random() * width;
                particle.vy = -(Math.random() * 1 + 0.5);
            }
            if (particle.y > height + particle.radius) {
                particle.y = -particle.radius;
            }
            if (particle.x < -particle.radius) {
                particle.x = width + particle.radius;
            }
            if (particle.x > width + particle.radius) {
                particle.x = -particle.radius;
            }

            // Draw particle with glow
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = particle.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Draw connections between nearby particles
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particlesRef.current.length; i++) {
            for (let j = i + 1; j < particlesRef.current.length; j++) {
                const dx = particlesRef.current[i].x - particlesRef.current[j].x;
                const dy = particlesRef.current[i].y - particlesRef.current[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    ctx.beginPath();
                    ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
                    ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
                    ctx.globalAlpha = (80 - distance) / 80 * 0.3;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    // Handle resize
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Reinitialize particles on resize
        initParticles(canvas.width, canvas.height);
    }, [initParticles]);

    // Handle mouse/touch movement
    const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            mouseRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        } else {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY,
            };
        }
    }, []);

    const handlePointerLeave = useCallback(() => {
        mouseRef.current = { x: -1000, y: -1000 };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set initial size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Initialize particles
        initParticles(canvas.width, canvas.height);

        // Start animation
        animationRef.current = requestAnimationFrame(animate);

        // Event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('touchmove', handlePointerMove);
        window.addEventListener('mouseleave', handlePointerLeave);
        window.addEventListener('touchend', handlePointerLeave);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('mouseleave', handlePointerLeave);
            window.removeEventListener('touchend', handlePointerLeave);
        };
    }, [animate, handleResize, handlePointerMove, handlePointerLeave, initParticles]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950">
            {/* Full-screen canvas - z-0 background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
                style={{ background: 'rgb(2, 6, 23)' }}
            />

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Content overlay - z-20 */}
            <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 py-24">
                {/* Main content */}
                <motion.div
                    className="text-center max-w-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-mono mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                        Interactive Canvas Experiment
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            Antigravity
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8 select-text">
                        A visual exploration of particles defying physics. Watch as luminous orbs float upward,
                        connecting and dancing in an ethereal display. Move your cursor (or touch) to interact
                        with the simulation and repel the particles.
                    </p>

                    {/* Instructions */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-8 h-px bg-gradient-to-r from-transparent to-violet-500/50" />
                            Move cursor to repel particles
                            <span className="w-8 h-px bg-gradient-to-l from-transparent to-violet-500/50" />
                        </span>
                    </motion.div>
                </motion.div>

                {/* Stats/Info cards */}
                <motion.div
                    className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    {[
                        { label: 'Particles', value: '150' },
                        { label: 'Physics', value: 'Anti-G' },
                        { label: 'Canvas', value: '2D' },
                        { label: 'FPS', value: '60' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm text-center"
                        >
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Navbar test notice */}
                <motion.p
                    className="mt-16 text-xs text-slate-600 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    ↓ The floating dock navigation below should remain clickable ↓
                </motion.p>
            </div>

            {/* Gradient overlay at bottom for dock visibility */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-30" />
        </div>
    );
}
