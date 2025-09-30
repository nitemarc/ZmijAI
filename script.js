// ULTRA Background Effects - Matrix + Constellation + Neon
class BackgroundParticles {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.matrixColumns = [];
        this.neonLines = [];
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        this.resize();
        this.createParticles();
        this.createMatrixRain();
        this.createNeonLines();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = this.isMobile ? 60 : 150;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                opacity: Math.random() * 0.6 + 0.2,
                hue: Math.random() * 60 + 180 // cyan/blue hues
            });
        }
    }

    createMatrixRain() {
        const fontSize = 14;
        const columns = Math.floor(this.canvas.width / fontSize);
        const chars = "I♥AI";

        for (let i = 0; i < columns; i++) {
            this.matrixColumns.push({
                x: i * fontSize,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 2,
                char: chars[Math.floor(Math.random() * chars.length)], // Each column gets one fixed char
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    createNeonLines() {
        const lineCount = this.isMobile ? 8 : 15;
        for (let i = 0; i < lineCount; i++) {
            this.neonLines.push({
                x1: Math.random() * this.canvas.width,
                y1: Math.random() * this.canvas.height,
                x2: Math.random() * this.canvas.width,
                y2: Math.random() * this.canvas.height,
                speed: (Math.random() - 0.5) * 0.5,
                hue: Math.random() * 60 + 280, // pink/purple
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    drawMatrixRain() {
        // Each column displays its assigned character
        this.ctx.font = '14px monospace';

        this.matrixColumns.forEach(column => {
            this.ctx.fillStyle = `rgba(0, 255, 150, ${column.opacity})`;
            this.ctx.fillText(column.char, column.x, column.y);

            column.y += column.speed;

            if (column.y > this.canvas.height) {
                column.y = 0;
                column.opacity = Math.random() * 0.3 + 0.1;
            }
        });
    }

    drawConstellations() {
        // Skip constellations on mobile for performance
        if (this.isMobile) return;

        const maxDistance = 150;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawNeonLines() {
        this.neonLines.forEach(line => {
            const gradient = this.ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
            gradient.addColorStop(0, `hsla(${line.hue}, 100%, 50%, 0)`);
            gradient.addColorStop(0.5, `hsla(${line.hue}, 100%, 50%, ${line.opacity})`);
            gradient.addColorStop(1, `hsla(${line.hue}, 100%, 50%, 0)`);

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
            this.ctx.stroke();

            line.x1 += line.speed;
            line.x2 += line.speed;

            if (line.x1 < 0 || line.x1 > this.canvas.width) {
                line.x1 = Math.random() * this.canvas.width;
                line.y1 = Math.random() * this.canvas.height;
                line.x2 = Math.random() * this.canvas.width;
                line.y2 = Math.random() * this.canvas.height;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Matrix rain
        this.drawMatrixRain();

        // Neon lines
        this.drawNeonLines();

        // Particles
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${particle.opacity})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 60%, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Constellations
        this.drawConstellations();

        requestAnimationFrame(() => this.animate());
    }
}

// ULTRA Particle effect system with Fireworks, Lightning, God Rays
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.fireworks = [];
        this.godRays = [];
        this.lightning = [];
    }

    createExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 4 + 3;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.015,
                size: Math.random() * 5 + 2,
                color: color,
                type: 'explosion',
                glow: true
            });
        }
    }

    createTrail(x, y, color) {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            decay: 0.03,
            size: Math.random() * 4 + 1,
            color: color,
            type: 'trail',
            glow: true
        });
    }

    createFirework(x, y) {
        const colors = ['#FFD700', '#FF6347', '#DC143C', '#FF1493', '#00CED1'];
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        const burstCount = isMobile ? 30 : 50;

        for (let i = 0; i < burstCount; i++) {
            const angle = (Math.PI * 2 * i) / burstCount;
            const speed = Math.random() * 5 + 3;
            const color = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                life: 1,
                decay: 0.01,
                size: Math.random() * 6 + 3,
                color: color,
                type: 'firework',
                glow: true,
                sparkle: true
            });
        }
    }

    createGodRays(x, y, count = 12) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        const rayCount = isMobile ? 8 : count;

        for (let i = 0; i < rayCount; i++) {
            const angle = (Math.PI * 2 * i) / count;
            this.godRays.push({
                x: x,
                y: y,
                angle: angle,
                length: 0,
                maxLength: 80,
                speed: 4,
                life: 1,
                decay: 0.02,
                width: 3
            });
        }
    }

    createLightning(x1, y1, x2, y2) {
        this.lightning.push({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            life: 1,
            decay: 0.1,
            segments: this.generateLightningPath(x1, y1, x2, y2)
        });
    }

    generateLightningPath(x1, y1, x2, y2) {
        const segments = [];
        const steps = 10;
        let currentX = x1;
        let currentY = y1;

        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const targetX = x1 + (x2 - x1) * progress;
            const targetY = y1 + (y2 - y1) * progress;

            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;

            segments.push({
                x: targetX + offsetX,
                y: targetY + offsetY
            });
        }

        segments.push({ x: x2, y: y2 });
        return segments;
    }

    update(ctx) {
        // Update regular particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.type === 'firework') {
                p.vy += 0.15; // more gravity for fireworks
            } else {
                p.vy += 0.08;
            }

            p.life -= p.decay;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.life;

            if (p.glow) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.sparkle && Math.random() < 0.3) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
            }

            ctx.restore();
        }

        // Update god rays
        for (let i = this.godRays.length - 1; i >= 0; i--) {
            const ray = this.godRays[i];
            ray.length += ray.speed;
            ray.life -= ray.decay;

            if (ray.life <= 0 || ray.length > ray.maxLength) {
                this.godRays.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = ray.life * 0.6;

            const gradient = ctx.createLinearGradient(
                ray.x,
                ray.y,
                ray.x + Math.cos(ray.angle) * ray.length,
                ray.y + Math.sin(ray.angle) * ray.length
            );

            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 100, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = ray.width;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(ray.x, ray.y);
            ctx.lineTo(
                ray.x + Math.cos(ray.angle) * ray.length,
                ray.y + Math.sin(ray.angle) * ray.length
            );
            ctx.stroke();

            ctx.restore();
        }

        // Update lightning
        for (let i = this.lightning.length - 1; i >= 0; i--) {
            const bolt = this.lightning[i];
            bolt.life -= bolt.decay;

            if (bolt.life <= 0) {
                this.lightning.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = bolt.life;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFD700';
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(bolt.x1, bolt.y1);

            bolt.segments.forEach(seg => {
                ctx.lineTo(seg.x, seg.y);
            });

            ctx.stroke();

            // Secondary glow
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
        }
    }
}

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('bestScore');
        this.finalScoreElement = document.getElementById('finalScore');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');

        // Detect mobile
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

        // Detect orientation
        this.currentOrientation = this.detectOrientation();

        // Resize canvas for mobile
        this.resizeCanvas();

        // Game settings
        this.gridSize = this.isMobile ? 20 : 22; // Mobile: 20px, Desktop: 22px for better visibility
        this.tileCount = {
            x: Math.floor(this.canvas.width / this.gridSize),
            y: Math.floor(this.canvas.height / this.gridSize)
        };

        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'gameOver'
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameSpeed = this.isMobile ? 200 : 150; // Slower on mobile for better control
        this.lastMoveTime = 0;

        // Message to display on snake segments
        this.MESSAGE = "I ♥ MARKETING & TECHNOLOGY, POZNAN 30.10.2025, I ♥ AI, ";

        // Snake properties - start at left center, moving right
        const startY = Math.floor(this.tileCount.y / 2);
        this.snake = [
            { x: 2, y: startY }
        ];
        this.dx = 1; // Start moving right immediately
        this.dy = 0;
        this.nextDirection = null;

        // Food properties
        this.food = { x: 15, y: 15 };
        this.heartImage = null;
        this.foodPulse = 0;

        // Particle system
        this.particleSystem = new ParticleSystem();

        // Screen shake
        this.shakeAmount = 0;
        this.shakeDuration = 0;

        // COMBO SYSTEM
        this.combo = 0;
        this.maxCombo = 0;
        this.lastEatTime = 0;
        this.comboTimeout = 3000; // 3 seconds
        this.multiplier = 1;

        // Camera effects
        this.cameraZoom = 1;
        this.targetZoom = 1;
        this.cameraShakeX = 0;
        this.cameraShakeY = 0;

        // Achievement popups
        this.achievements = [];

        // Glitch effect
        this.glitchActive = false;
        this.glitchDuration = 0;

        // Rainbow trail
        this.rainbowTrail = [];

        // Touch controls
        this.touchStartX = 0;
        this.touchStartY = 0;

        // Best score tracking
        this.recordBroken = false;

        this.init();
    }

    detectOrientation() {
        return window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';
    }

    handleOrientationChange() {
        const newOrientation = this.detectOrientation();

        if (newOrientation !== this.currentOrientation) {
            this.currentOrientation = newOrientation;

            if (this.isMobile) {
                // Show warning in landscape, hide in portrait
                if (newOrientation === 'landscape') {
                    this.showLandscapeWarning();
                } else {
                    this.hideLandscapeWarning();
                }

                this.resizeCanvas();
                this.tileCount = {
                    x: Math.floor(this.canvas.width / this.gridSize),
                    y: Math.floor(this.canvas.height / this.gridSize)
                };

                // Regenerate food if outside new bounds
                if (this.food.x >= this.tileCount.x || this.food.y >= this.tileCount.y) {
                    this.generateFood();
                }
            }
        }
    }

    resizeCanvas() {
        if (this.isMobile) {
            // Square canvas: 360x360px (18x18 tiles at 20px each)
            const canvasSize = Math.min(window.innerWidth - 40, 360);
            this.canvas.width = canvasSize;
            this.canvas.height = canvasSize;
        } else {
            // Desktop: 660x440px (30x20 tiles at 22px each)
            this.canvas.width = 660;
            this.canvas.height = 440;
        }
    }

    showLandscapeWarning() {
        const warning = document.getElementById('landscapeWarning');
        if (warning) {
            warning.style.display = 'flex';
        }
        // Hide D-Pad
        const dpad = document.getElementById('virtualDPad');
        if (dpad) {
            dpad.style.display = 'none';
        }
    }

    hideLandscapeWarning() {
        const warning = document.getElementById('landscapeWarning');
        if (warning) {
            warning.style.display = 'none';
        }
        // Show D-Pad only on mobile
        const dpad = document.getElementById('virtualDPad');
        if (dpad && this.isMobile) {
            dpad.style.display = 'block';
        }
    }

    init() {
        this.loadHeartImage();
        this.bindEvents();
        this.bindTouchControls();
        this.bindVirtualDPad();
        this.generateFood();
        this.updateBestScoreDisplay();
        this.gameLoop();

        // Resize on orientation change
        window.addEventListener('resize', () => {
            this.handleOrientationChange();
        });

        // Orientation change event (mobile specific)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Detect orientation change via matchMedia
        const orientationQuery = window.matchMedia('(orientation: landscape)');
        orientationQuery.addEventListener('change', () => {
            this.handleOrientationChange();
        });
    }

    loadBestScore() {
        const saved = localStorage.getItem('zmijAI_bestScore');
        return saved ? parseInt(saved, 10) : 0;
    }

    saveBestScore() {
        localStorage.setItem('zmijAI_bestScore', this.bestScore.toString());
    }

    updateBestScoreDisplay() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    checkAndUpdateBestScore() {
        if (this.score > this.bestScore) {
            // Only show achievement ONCE when record is first broken
            if (!this.recordBroken) {
                this.showAchievement('🏆 NOWY REKORD! 🏆', `${this.score} PUNKTÓW`);
                this.recordBroken = true;
            }

            this.bestScore = this.score;
            this.saveBestScore();
            this.updateBestScoreDisplay();

            // Animation for best score display
            this.bestScoreElement.parentElement.classList.add('score-animate');
            setTimeout(() => {
                this.bestScoreElement.parentElement.classList.remove('score-animate');
            }, 400);
        }
    }

    bindTouchControls() {
        // Swipe gestures
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.gameState !== 'playing') return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;

            const minSwipeDistance = 30;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        // Right
                        if (this.dx === 0) {
                            this.nextDirection = { dx: 1, dy: 0 };
                        }
                    } else {
                        // Left
                        if (this.dx === 0) {
                            this.nextDirection = { dx: -1, dy: 0 };
                        }
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        // Down
                        if (this.dy === 0) {
                            this.nextDirection = { dx: 0, dy: 1 };
                        }
                    } else {
                        // Up
                        if (this.dy === 0) {
                            this.nextDirection = { dx: 0, dy: -1 };
                        }
                    }
                }
            }
        }, { passive: false });
    }

    bindVirtualDPad() {
        const dpadButtons = document.querySelectorAll('.dpad-btn');

        dpadButtons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameState !== 'playing') return;

                const direction = btn.dataset.direction;

                switch(direction) {
                    case 'up':
                        if (this.dy === 0) this.nextDirection = { dx: 0, dy: -1 };
                        break;
                    case 'down':
                        if (this.dy === 0) this.nextDirection = { dx: 0, dy: 1 };
                        break;
                    case 'left':
                        if (this.dx === 0) this.nextDirection = { dx: -1, dy: 0 };
                        break;
                    case 'right':
                        if (this.dx === 0) this.nextDirection = { dx: 1, dy: 0 };
                        break;
                }
            }, { passive: false });
        });
    }
    
    loadHeartImage() {
        this.heartImage = new Image();
        this.heartImage.onload = () => {
            this.draw();
        };
        this.heartImage.src = 'serce.png';
    }
    
    bindEvents() {
        // Start and restart buttons
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Prevent arrow keys from scrolling the page
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }
    
    handleKeyPress(e) {
        if (this.gameState !== 'playing') return;
        
        const keyMap = {
            'ArrowUp': { dx: 0, dy: -1 },
            'ArrowDown': { dx: 0, dy: 1 },
            'ArrowLeft': { dx: -1, dy: 0 },
            'ArrowRight': { dx: 1, dy: 0 },
            'KeyW': { dx: 0, dy: -1 },
            'KeyS': { dx: 0, dy: 1 },
            'KeyA': { dx: -1, dy: 0 },
            'KeyD': { dx: 1, dy: 0 }
        };
        
        const direction = keyMap[e.code];
        if (direction) {
            // Prevent reversing into itself
            if (this.snake.length > 1) {
                if (direction.dx === -this.dx && direction.dy === -this.dy) {
                    return;
                }
            }
            
            this.nextDirection = direction;
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameOverlay.style.display = 'none';
        this.score = 0;
        this.recordBroken = false; // Reset record broken flag
        this.updateScore();

        // Start at left center, moving right
        const startY = Math.floor(this.tileCount.y / 2);
        this.snake = [{ x: 2, y: startY }];
        this.dx = 1;
        this.dy = 0;
        this.nextDirection = null;
        this.generateFood();
        this.gameSpeed = this.isMobile ? 200 : 150; // Slower on mobile
    }
    
    restartGame() {
        this.gameOverScreen.style.display = 'none';
        this.startScreen.style.display = 'block';
        this.gameState = 'start';
        this.gameOverlay.style.display = 'flex';
    }
    
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount.x),
                y: Math.floor(Math.random() * this.tileCount.y)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        this.food = newFood;
    }
    
    moveSnake() {
        if (this.nextDirection) {
            this.dx = this.nextDirection.dx;
            this.dy = this.nextDirection.dy;
            this.nextDirection = null;
        }

        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount.x || head.y < 0 || head.y >= this.tileCount.y) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            // Update combo
            this.updateCombo();

            // Calculate score with multiplier
            const points = 10 * this.multiplier;
            this.score += points;
            this.updateScore();
            this.checkMilestones();

            // Create MASSIVE explosion effect at food location
            const centerX = this.food.x * this.gridSize + this.gridSize / 2;
            const centerY = this.food.y * this.gridSize + this.gridSize / 2;

            // GOD RAYS!
            this.particleSystem.createGodRays(centerX, centerY, 16);

            // Explosion
            this.particleSystem.createExplosion(centerX, centerY, '#DC143C', 40);

            // Lightning between snake head and food
            const headX = this.snake[0].x * this.gridSize + this.gridSize / 2;
            const headY = this.snake[0].y * this.gridSize + this.gridSize / 2;
            this.particleSystem.createLightning(headX, headY, centerX, centerY);

            // Create rainbow sparkles
            const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
            for (let i = 0; i < 20; i++) {
                const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
                this.particleSystem.createTrail(centerX, centerY, color);
            }

            // Camera zoom effect
            this.targetZoom = 1.1;
            setTimeout(() => { this.targetZoom = 1; }, 200);

            // Screen shake
            this.shakeAmount = 5;
            this.shakeDuration = 150;

            this.generateFood();

            // Increase speed slightly (slower max on mobile)
            const minSpeed = this.isMobile ? 120 : 80;
            this.gameSpeed = Math.max(minSpeed, this.gameSpeed - 2);
        } else {
            this.snake.pop();
        }

        // Create rainbow trail effect behind head
        if (this.gameState === 'playing') {
            const headCenterX = this.snake[0].x * this.gridSize + this.gridSize / 2;
            const headCenterY = this.snake[0].y * this.gridSize + this.gridSize / 2;

            // Rainbow trail based on combo
            if (this.combo >= 5 && Math.random() < 0.5) {
                const hue = (Date.now() / 10) % 360;
                const color = `hsl(${hue}, 100%, 50%)`;
                this.particleSystem.createTrail(headCenterX, headCenterY, color);
            } else if (Math.random() < 0.3) {
                this.particleSystem.createTrail(headCenterX, headCenterY, '#FFD700');
            }
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        this.scoreElement.parentElement.classList.add('score-animate');
        setTimeout(() => {
            this.scoreElement.parentElement.classList.remove('score-animate');
        }, 300);

        // Check for new best score
        this.checkAndUpdateBestScore();
    }

    updateCombo() {
        const currentTime = Date.now();

        if (currentTime - this.lastEatTime < this.comboTimeout) {
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            // Update multiplier
            if (this.combo >= 10) this.multiplier = 5;
            else if (this.combo >= 7) this.multiplier = 3;
            else if (this.combo >= 5) this.multiplier = 2;
            else this.multiplier = 1;

            // Show combo popup
            if (this.combo >= 3) {
                this.showAchievement(`COMBO x${this.combo}!`, `${this.multiplier}x MULTIPLIER`);
            }
        } else {
            this.combo = 1;
            this.multiplier = 1;
        }

        this.lastEatTime = currentTime;
    }

    showAchievement(title, subtitle = '') {
        this.achievements.push({
            title: title,
            subtitle: subtitle,
            life: 1,
            decay: 0.01,
            y: -50,
            targetY: 50
        });
    }

    checkMilestones() {
        if (this.score === 50) {
            this.showAchievement('🔥 GETTING HOT! 🔥', '50 POINTS');
            this.particleSystem.createFirework(this.canvas.width / 2, this.canvas.height / 2);
        } else if (this.score === 100) {
            this.showAchievement('💎 CENTURY! 💎', '100 POINTS');
            this.particleSystem.createFirework(this.canvas.width / 2, this.canvas.height / 3);
            this.particleSystem.createFirework(this.canvas.width / 3, this.canvas.height / 2);
            this.glitchEffect();
        } else if (this.score === 200) {
            this.showAchievement('👑 MASTER! 👑', '200 POINTS');
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.particleSystem.createFirework(
                        Math.random() * this.canvas.width,
                        Math.random() * this.canvas.height / 2
                    );
                }, i * 200);
            }
        } else if (this.score === 250) {
            this.showAchievement('🐐 WELCOME TO POZNAN! 🐐', '250 POINTS');
            // Special fireworks for Poznan!
            for (let i = 0; i < 7; i++) {
                setTimeout(() => {
                    this.particleSystem.createFirework(
                        Math.random() * this.canvas.width,
                        Math.random() * this.canvas.height
                    );
                }, i * 150);
            }
        }
    }

    glitchEffect() {
        this.glitchActive = true;
        this.glitchDuration = 300;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.finalScoreElement.textContent = this.score;
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'block';
        this.gameOverlay.style.display = 'flex';

        // MASSIVE Screen shake effect
        this.shakeAmount = 20;
        this.shakeDuration = 800;

        // Screen crack effect
        this.canvas.classList.add('screen-crack');

        // Multiple flash effects
        this.canvas.style.filter = 'brightness(3) saturate(0)';
        setTimeout(() => {
            this.canvas.style.filter = 'brightness(0.5)';
        }, 100);
        setTimeout(() => {
            this.canvas.style.filter = 'brightness(2)';
        }, 200);
        setTimeout(() => {
            this.canvas.style.filter = 'brightness(1)';
        }, 300);

        // Create massive explosion at snake head
        if (this.snake.length > 0) {
            const headX = this.snake[0].x * this.gridSize + this.gridSize / 2;
            const headY = this.snake[0].y * this.gridSize + this.gridSize / 2;

            // Multiple explosions
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.particleSystem.createExplosion(headX, headY, '#DC143C', 60);
                    this.particleSystem.createExplosion(headX, headY, '#FFD700', 40);
                }, i * 100);
            }
        }

        // Glitch effect
        this.glitchEffect();
    }
    
    draw() {
        this.ctx.save();

        // Smooth camera zoom
        this.cameraZoom += (this.targetZoom - this.cameraZoom) * 0.1;

        // Apply camera zoom
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.cameraZoom, this.cameraZoom);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);

        // Apply screen shake if active
        if (this.shakeDuration > 0) {
            const shakeX = (Math.random() - 0.5) * this.shakeAmount;
            const shakeY = (Math.random() - 0.5) * this.shakeAmount;
            this.ctx.translate(shakeX, shakeY);
            this.shakeDuration -= 16; // ~60fps
            if (this.shakeDuration <= 0) {
                this.shakeAmount = 0;
            }
        }

        // Glitch effect
        if (this.glitchDuration > 0) {
            this.glitchDuration -= 16;
            if (Math.random() < 0.3) {
                this.ctx.translate((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
            }
        }

        // Clear canvas
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ULTRA 3D perspective grid with neon glow
        const time = Date.now() * 0.001;

        // Perspective grid (cyberpunk style)
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height);

        for (let i = -10; i <= 10; i++) {
            const perspective = 0.3;
            const z = i * 30;

            // Horizontal lines (receding)
            const y1 = -200 + z * perspective;
            const x1 = i * 50;
            const y2 = -400 + z * perspective;
            const x2 = i * 80;

            const alpha = Math.max(0, 0.15 - Math.abs(i) * 0.01);
            const neonGlow = Math.sin(time + i * 0.5) * 0.05;

            this.ctx.strokeStyle = `rgba(0, 200, 255, ${alpha + neonGlow})`;
            this.ctx.lineWidth = 1 + (Math.abs(i) < 3 ? 1 : 0);
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(0, 200, 255, 0.5)';

            this.ctx.beginPath();
            this.ctx.moveTo(-this.canvas.width / 2, y1);
            this.ctx.lineTo(this.canvas.width / 2, y1);
            this.ctx.stroke();

            // Vertical lines (converging)
            if (Math.abs(i) <= 5) {
                this.ctx.strokeStyle = `rgba(255, 0, 200, ${alpha + neonGlow})`;
                this.ctx.shadowColor = 'rgba(255, 0, 200, 0.5)';

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();

        // Regular grid overlay (subtle)
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(time) * 0.02})`;
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 0;

        for (let i = 0; i <= this.tileCount.x; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.tileCount.y; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }

        // Draw vignette effect
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.3,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'playing' || this.gameState === 'gameOver') {
            // Draw snake with letters and glow effects
            this.snake.forEach((segment, index) => {
                // Calculate brightness that fades for body segments
                const brightness = Math.max(0.5, 1 - (index / this.snake.length) * 0.5);

                // Create yellow highlighter color that fades
                const r = Math.floor(255 * brightness);
                const g = Math.floor(215 * brightness);
                const b = Math.floor(0);

                const x = segment.x * this.gridSize + 2;
                const y = segment.y * this.gridSize + 2;
                const size = this.gridSize - 4;

                // Draw glow effect
                if (index === 0) {
                    // Head glow
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
                } else {
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
                }

                // Draw yellow highlighter background (like marker) with rounded corners
                this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, size, size, 4);
                this.ctx.fill();

                // Reset shadow
                this.ctx.shadowBlur = 0;

                // Draw letter on segment with black color
                const letter = this.MESSAGE[index % this.MESSAGE.length];
                this.ctx.font = `bold ${this.gridSize * 0.7}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                // Draw black text (like writing on highlighter)
                this.ctx.fillStyle = '#000000';
                this.ctx.fillText(
                    letter,
                    segment.x * this.gridSize + this.gridSize / 2,
                    segment.y * this.gridSize + this.gridSize / 2
                );
            });
            
            // Draw HOLOGRAPHIC food with ORBIT RINGS and ENERGY BEAM
            this.foodPulse += 0.05;
            const pulseScale = 1 + Math.sin(this.foodPulse) * 0.2;

            const centerX = this.food.x * this.gridSize + this.gridSize / 2;
            const centerY = this.food.y * this.gridSize + this.gridSize / 2;

            // Draw energy beam shooting upward
            const beamGradient = this.ctx.createLinearGradient(
                centerX, centerY,
                centerX, centerY - 100
            );
            beamGradient.addColorStop(0, 'rgba(220, 20, 60, 0.6)');
            beamGradient.addColorStop(0.5, 'rgba(255, 100, 150, 0.3)');
            beamGradient.addColorStop(1, 'rgba(220, 20, 60, 0)');

            this.ctx.fillStyle = beamGradient;
            this.ctx.fillRect(centerX - 3, centerY - 100, 6, 100);

            // Draw massive glow around heart
            const glowSize = this.gridSize * pulseScale * 2;
            const glowGradient = this.ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, glowSize
            );
            glowGradient.addColorStop(0, 'rgba(220, 20, 60, 0.6)');
            glowGradient.addColorStop(0.3, 'rgba(255, 100, 150, 0.4)');
            glowGradient.addColorStop(0.6, 'rgba(220, 20, 60, 0.2)');
            glowGradient.addColorStop(1, 'rgba(220, 20, 60, 0)');
            this.ctx.fillStyle = glowGradient;
            this.ctx.fillRect(
                centerX - glowSize,
                centerY - glowSize,
                glowSize * 2,
                glowSize * 2
            );

            // Draw orbit rings
            for (let ring = 0; ring < 3; ring++) {
                const ringRadius = 20 + ring * 15;
                const ringRotation = this.foodPulse * (1 + ring * 0.3);

                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                this.ctx.rotate(ringRotation);

                // Holographic ring
                const ringGradient = this.ctx.createLinearGradient(-ringRadius, 0, ringRadius, 0);
                const hue1 = (this.foodPulse * 50 + ring * 60) % 360;
                const hue2 = (hue1 + 120) % 360;
                ringGradient.addColorStop(0, `hsla(${hue1}, 100%, 50%, 0.3)`);
                ringGradient.addColorStop(0.5, `hsla(${hue2}, 100%, 50%, 0.6)`);
                ringGradient.addColorStop(1, `hsla(${hue1}, 100%, 50%, 0.3)`);

                this.ctx.strokeStyle = ringGradient;
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = `hsla(${hue1}, 100%, 50%, 0.8)`;

                this.ctx.beginPath();
                this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
                this.ctx.stroke();

                this.ctx.restore();
            }

            // Draw floating holographic particles around heart
            for (let i = 0; i < 6; i++) {
                const angle = this.foodPulse * 2 + (i * Math.PI * 2 / 6);
                const radius = 25 + Math.sin(this.foodPulse * 3 + i) * 8;
                const px = centerX + Math.cos(angle) * radius;
                const py = centerY + Math.sin(angle) * radius;

                const hue = (this.foodPulse * 100 + i * 60) % 360;
                const particleGradient = this.ctx.createRadialGradient(px, py, 0, px, py, 4);
                particleGradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.8)`);
                particleGradient.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);

                this.ctx.fillStyle = particleGradient;
                this.ctx.beginPath();
                this.ctx.arc(px, py, 4, 0, Math.PI * 2);
                this.ctx.fill();
            }

            if (this.heartImage && this.heartImage.complete) {
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                this.ctx.scale(pulseScale, pulseScale);

                // Holographic shimmer effect
                const shimmerHue = (this.foodPulse * 100) % 360;
                this.ctx.shadowBlur = 25;
                this.ctx.shadowColor = `hsla(${shimmerHue}, 100%, 50%, 0.8)`;

                // Draw heart with holographic tint
                this.ctx.globalCompositeOperation = 'lighter';
                const imageSize = this.gridSize - 4;

                // Multiple layers for holographic effect
                for (let i = 0; i < 3; i++) {
                    this.ctx.globalAlpha = 0.3 + Math.sin(this.foodPulse + i) * 0.2;
                    const hue = (shimmerHue + i * 40) % 360;
                    this.ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.6)`;

                    this.ctx.drawImage(
                        this.heartImage,
                        -imageSize / 2 + Math.sin(this.foodPulse + i) * 2,
                        -imageSize / 2,
                        imageSize,
                        imageSize
                    );
                }

                this.ctx.globalAlpha = 1;
                this.ctx.globalCompositeOperation = 'source-over';

                this.ctx.restore();
            } else {
                // Fallback red heart shape if image doesn't load
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                this.ctx.scale(pulseScale, pulseScale);

                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = 'rgba(220, 20, 60, 1)';
                this.ctx.fillStyle = '#DC143C';

                const size = this.gridSize / 3;
                this.ctx.beginPath();
                this.ctx.moveTo(0, size / 2);
                this.ctx.bezierCurveTo(-size, -size / 2, -size, -size, 0, -size / 4);
                this.ctx.bezierCurveTo(size, -size, size, -size / 2, 0, size / 2);
                this.ctx.fill();

                this.ctx.restore();
            }

            // Reset shadow
            this.ctx.shadowBlur = 0;
        }

        // Draw particle effects
        this.particleSystem.update(this.ctx);

        // Draw combo counter
        if (this.combo > 1 && this.gameState === 'playing') {
            this.ctx.save();
            this.ctx.font = 'bold 32px Orbitron';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';

            // Combo text with glow
            const comboHue = (Date.now() / 20) % 360;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = `hsl(${comboHue}, 100%, 50%)`;
            this.ctx.fillStyle = `hsl(${comboHue}, 100%, 60%)`;
            this.ctx.fillText(`COMBO x${this.combo}`, this.canvas.width - 20, 20);

            // Multiplier
            if (this.multiplier > 1) {
                this.ctx.font = 'bold 24px Orbitron';
                this.ctx.fillStyle = '#FFD700';
                this.ctx.shadowColor = '#FFD700';
                this.ctx.fillText(`${this.multiplier}x MULTIPLIER`, this.canvas.width - 20, 60);
            }

            this.ctx.restore();
        }

        // Draw achievement popups
        for (let i = this.achievements.length - 1; i >= 0; i--) {
            const ach = this.achievements[i];

            // Animate Y position
            ach.y += (ach.targetY - ach.y) * 0.1;
            ach.life -= ach.decay;

            if (ach.life <= 0) {
                this.achievements.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = ach.life;

            // Background
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(this.canvas.width / 2 - 200, ach.y, 400, 80);

            // Border glow
            const glowHue = (Date.now() / 20) % 360;
            this.ctx.strokeStyle = `hsl(${glowHue}, 100%, 50%)`;
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = `hsl(${glowHue}, 100%, 50%)`;
            this.ctx.strokeRect(this.canvas.width / 2 - 200, ach.y, 400, 80);

            // Text
            this.ctx.shadowBlur = 10;
            this.ctx.font = 'bold 28px Orbitron';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText(ach.title, this.canvas.width / 2, ach.y + 30);

            if (ach.subtitle) {
                this.ctx.font = 'bold 18px Orbitron';
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillText(ach.subtitle, this.canvas.width / 2, ach.y + 55);
            }

            this.ctx.restore();
        }

        this.ctx.restore();
    }
    
    gameLoop() {
        const currentTime = Date.now();
        
        if (this.gameState === 'playing' && currentTime - this.lastMoveTime > this.gameSpeed) {
            this.moveSnake();
            this.lastMoveTime = currentTime;
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundParticles();
    new SnakeGame();

    // Hide loading screen after everything is loaded
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500); // Remove after fade out animation
        }
    }, 500); // Small delay to ensure everything is rendered
});