/**
 * Advanced Game Engine: HTML5 Canvas Renderer, Physics, Turrets, Waves, Projectiles, and Particle Systems.
 * Includes Game Speed Multipliers (1x, 2x, 3x), Targeting Priorities (First, Strongest, Closest, Weakest),
 * Detailed Tower Combat Stats, and AAA-Indie Sci-Fi Visuals.
 */
class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Logical internal resolution (high-def 16:9 ratio)
        this.width = 1000;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Game State
        this.isRunning = false;
        this.isPaused = false;
        this.gameSpeed = 1.0; // 1.0, 2.0, 3.0
        this.lastTime = 0;

        // Level Data
        this.levelData = null;
        this.path = [];
        this.pathLengths = [];
        this.totalPathLength = 0;
        this.slots = [];

        // Entities
        this.turrets = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];

        // Base & Player Stats
        this.baseMaxHp = 100;
        this.baseHp = 100;
        this.score = 0;
        this.enemiesDefeated = 0;

        // Wave Management
        this.currentWaveIndex = 0;
        this.waveInProgress = false;
        this.spawnQueue = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1200;
        this.bossHalfwayTriggered = false;
        this.activeBoss = null;

        // Visual FX
        this.screenShake = 0;
        this.superStrikeBeam = null;
        this.hoveredSlot = null;
        this.selectedSlot = null;
        this.pathPulseOffset = 0;
        this.tickTimer = 0;

        // Callbacks to UI controller
        this.onSlotClick = null;
        this.onBossHalfway = null;
        this.onWaveCompleted = null;
        this.onLevelCompleted = null;
        this.onGameOver = null;
        this.onBaseDamaged = null;
        this.onStatsUpdated = null;

        this.initInput();
    }

    // --- Input & Coordinates ---
    initInput() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.hoveredSlot = null;
        });
    }

    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    handleMouseMove(e) {
        if (!this.isRunning || this.isPaused) return;
        const { x, y } = this.getCanvasCoords(e);

        this.hoveredSlot = null;
        for (const slot of this.slots) {
            const dist = Math.hypot(slot.x - x, slot.y - y);
            if (dist <= 30) {
                this.hoveredSlot = slot;
                this.canvas.style.cursor = 'pointer';
                return;
            }
        }
        this.canvas.style.cursor = 'default';
    }

    handleClick(e) {
        if (!this.isRunning || this.isPaused) return;
        const { x, y } = this.getCanvasCoords(e);

        for (const slot of this.slots) {
            const dist = Math.hypot(slot.x - x, slot.y - y);
            if (dist <= 30) {
                if (this.onSlotClick) {
                    this.onSlotClick(slot);
                }
                return;
            }
        }
    }

    setGameSpeed(speed) {
        this.gameSpeed = Math.max(0.5, Math.min(3.0, speed));
    }

    // --- Level Initialization ---
    loadLevel(levelConfig) {
        this.levelData = levelConfig;
        this.path = levelConfig.path;
        this.calculatePathMetrics();

        // Initialize Slots
        this.slots = levelConfig.slots.map(s => ({
            id: s.id,
            x: s.x,
            y: s.y,
            turret: null,
            cooldownTimer: 0
        }));

        this.turrets = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];

        this.baseMaxHp = 100;
        this.baseHp = 100;
        this.score = 0;
        this.enemiesDefeated = 0;

        this.currentWaveIndex = 0;
        this.waveInProgress = false;
        this.spawnQueue = [];
        this.activeBoss = null;
        this.bossHalfwayTriggered = false;

        this.notifyStats();
    }

    calculatePathMetrics() {
        this.pathLengths = [];
        this.totalPathLength = 0;
        for (let i = 0; i < this.path.length - 1; i++) {
            const p1 = this.path[i];
            const p2 = this.path[i + 1];
            const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            this.pathLengths.push(len);
            this.totalPathLength += len;
        }
    }

    getPointAtDistance(dist) {
        if (dist <= 0) return { ...this.path[0] };
        let accumulated = 0;
        for (let i = 0; i < this.pathLengths.length; i++) {
            const segLen = this.pathLengths[i];
            if (accumulated + segLen >= dist) {
                const segProgress = (dist - accumulated) / segLen;
                const p1 = this.path[i];
                const p2 = this.path[i + 1];
                return {
                    x: p1.x + (p2.x - p1.x) * segProgress,
                    y: p1.y + (p2.y - p1.y) * segProgress
                };
            }
            accumulated += segLen;
        }
        return { ...this.path[this.path.length - 1] };
    }

    // --- Game Control ---
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        if (!this.isRunning) return;
        this.isPaused = false;
        this.lastTime = performance.now();
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
    }

    startNextWave() {
        if (this.waveInProgress) return;
        if (this.currentWaveIndex >= this.levelData.waves.length) return;

        const waveConfig = this.levelData.waves[this.currentWaveIndex];
        this.waveInProgress = true;
        this.spawnTimer = 0;
        this.spawnInterval = waveConfig.spawnInterval || 1200;
        this.spawnQueue = [];
        this.bossHalfwayTriggered = false;
        this.activeBoss = null;

        for (const grp of waveConfig.enemies) {
            for (let i = 0; i < grp.count; i++) {
                this.spawnQueue.push({
                    type: grp.type,
                    hp: grp.hp,
                    maxHp: grp.hp,
                    speed: grp.speed,
                    rewardScore: grp.rewardScore,
                    color: grp.color,
                    isBoss: !!grp.isBoss,
                    name: grp.name || grp.type
                });
            }
        }

        if (window.soundManager) window.soundManager.playBuild();
        this.notifyStats();
    }

    spawnEnemy(data) {
        const enemy = {
            id: 'e_' + Math.random().toString(36).substr(2, 9),
            type: data.type,
            name: data.name,
            hp: data.hp,
            maxHp: data.maxHp,
            baseSpeed: data.speed,
            speed: data.speed,
            rewardScore: data.rewardScore,
            color: data.color,
            isBoss: data.isBoss,
            distance: 0,
            x: this.path[0].x,
            y: this.path[0].y,
            radius: data.isBoss ? 26 : (data.type === 'tank' ? 18 : (data.type === 'trooper' ? 14 : 11)),
            slowTimer: 0,
            slowFactor: 1.0,
            spawnTime: performance.now()
        };

        if (enemy.isBoss) {
            this.activeBoss = enemy;
            if (window.soundManager) window.soundManager.playWarning();
            this.addFloatingText("ВНИМАНИЕ: БОСС ВОЛНЫ!", enemy.x, enemy.y - 35, '#ef4444', 3500);
        }

        this.enemies.push(enemy);
    }

    // --- Building, Upgrades & Dismantle ---
    buildTurret(slotId, turretType) {
        const slot = this.slots.find(s => s.id === slotId);
        if (!slot) return false;

        let turretConfig = {};
        if (turretType === 'plasma') {
            turretConfig = {
                type: 'plasma',
                name: 'Быстрая плазма',
                range: 160,
                fireRate: 3.2,
                damage: 20,
                bulletSpeed: 540,
                color: '#38bdf8',
                level: 1
            };
        } else if (turretType === 'cryo') {
            turretConfig = {
                type: 'cryo',
                name: 'Крио-башня',
                range: 145,
                fireRate: 1.3,
                damage: 15,
                bulletSpeed: 400,
                slowFactor: 0.50,
                slowDuration: 2.5,
                color: '#06b6d4',
                level: 1
            };
        } else if (turretType === 'artillery') {
            turretConfig = {
                type: 'artillery',
                name: 'Тяжелая мортира',
                range: 195,
                fireRate: 0.65,
                damage: 75,
                blastRadius: 85,
                bulletSpeed: 300,
                color: '#f59e0b',
                level: 1
            };
        }

        slot.turret = {
            ...turretConfig,
            id: 't_' + Math.random().toString(36).substr(2, 9),
            slotId: slot.id,
            x: slot.x,
            y: slot.y,
            angle: 0,
            recoil: 0,
            cooldown: 0,
            target: null,
            targetPriority: 'first', // 'first' | 'strongest' | 'closest' | 'weakest'
            totalKills: 0,
            totalDamage: 0
        };

        this.turrets.push(slot.turret);
        this.createSparks(slot.x, slot.y, slot.turret.color, 25);
        if (window.soundManager) window.soundManager.playBuild();
        return true;
    }

    upgradeTurret(slotId) {
        const slot = this.slots.find(s => s.id === slotId);
        if (!slot || !slot.turret) return false;

        const t = slot.turret;
        if (t.level >= 3) return false;

        t.level += 1;
        t.damage = Math.round(t.damage * 1.55);
        t.range = Math.round(t.range * 1.15);
        if (t.type === 'cryo') {
            t.slowFactor = Math.max(0.3, t.slowFactor - 0.1);
        } else if (t.type === 'artillery') {
            t.blastRadius += 15;
        }

        this.createSparks(slot.x, slot.y, '#facc15', 35);
        this.addFloatingText(`УРОВЕНЬ ${t.level}!`, slot.x, slot.y - 25, '#facc15', 1800);
        if (window.soundManager) window.soundManager.playUpgrade();
        return true;
    }

    dismantleTurret(slotId) {
        const slot = this.slots.find(s => s.id === slotId);
        if (!slot || !slot.turret) return false;

        const idx = this.turrets.indexOf(slot.turret);
        if (idx !== -1) {
            this.turrets.splice(idx, 1);
        }

        this.createSparks(slot.x, slot.y, '#94a3b8', 20);
        this.addFloatingText("ДЕМОНТИРОВАНО", slot.x, slot.y - 20, '#94a3b8', 1500);
        slot.turret = null;
        slot.cooldownTimer = 0;

        if (window.soundManager) window.soundManager.playSell();
        return true;
    }

    setTurretPriority(slotId, priority) {
        const slot = this.slots.find(s => s.id === slotId);
        if (slot && slot.turret) {
            slot.turret.targetPriority = priority;
            if (window.soundManager) window.soundManager.playClick();
            return true;
        }
        return false;
    }

    lockSlotCooldown(slotId, seconds = 5) {
        const slot = this.slots.find(s => s.id === slotId);
        if (slot) {
            slot.cooldownTimer = seconds;
            this.createSparks(slot.x, slot.y, '#ef4444', 18);
            this.addFloatingText("БЛОКИРОВКА 5с", slot.x, slot.y - 20, '#ef4444', 2000);
        }
    }

    executeSuperStrike() {
        if (!this.activeBoss || this.activeBoss.hp <= 0) return false;

        const boss = this.activeBoss;
        const damage = Math.round(boss.maxHp * 0.5);
        boss.hp -= damage;

        this.superStrikeBeam = {
            x: boss.x,
            y: boss.y,
            timer: 0.8
        };

        this.screenShake = 22;
        this.createExplosion(boss.x, boss.y, 130, '#ef4444');
        this.addFloatingText(`-50% ХП [СУПЕР-УДАР: ${damage}]`, boss.x, boss.y - 40, '#a855f7', 3000);

        if (window.soundManager) window.soundManager.playSuperStrike();

        if (boss.hp <= 0) {
            this.destroyEnemy(boss, null);
        }
        return true;
    }

    // --- Main Game Loop ---
    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const rawDelta = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Apply Game Speed Multiplier (1x, 2x, 3x) and clamp
        const dt = Math.min(rawDelta, 0.1) * this.gameSpeed;

        if (!this.isPaused) {
            this.update(dt);
        }

        this.render();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // --- Update Logic ---
    update(dt) {
        this.tickTimer += dt;
        this.pathPulseOffset = (this.pathPulseOffset + dt * 50) % 70;

        // 1. Update Slot Cooldowns
        for (const slot of this.slots) {
            if (slot.cooldownTimer > 0) {
                slot.cooldownTimer = Math.max(0, slot.cooldownTimer - dt);
            }
        }

        // 2. Wave Spawner
        if (this.waveInProgress && this.spawnQueue.length > 0) {
            this.spawnTimer += dt * 1000;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnTimer = 0;
                const nextData = this.spawnQueue.shift();
                this.spawnEnemy(nextData);
            }
        }

        // 3. Update Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];

            // Slow effect update
            if (e.slowTimer > 0) {
                e.slowTimer -= dt;
                e.speed = e.baseSpeed * e.slowFactor;
                if (e.slowTimer <= 0) {
                    e.slowFactor = 1.0;
                    e.speed = e.baseSpeed;
                }
            } else {
                e.speed = e.baseSpeed;
            }

            // Move along path
            e.distance += e.speed * 60 * dt;
            const pt = this.getPointAtDistance(e.distance);
            e.x = pt.x;
            e.y = pt.y;

            // Thruster particle trail for scouts & bosses
            if (Math.random() < 0.25 * this.gameSpeed) {
                this.particles.push({
                    x: e.x + (Math.random() - 0.5) * 6,
                    y: e.y + (Math.random() - 0.5) * 6,
                    vx: -(Math.random() * 20),
                    vy: (Math.random() - 0.5) * 15,
                    color: e.isBoss ? '#c084fc' : (e.color || '#38bdf8'),
                    size: 2,
                    life: 0.3,
                    maxLife: 0.3
                });
            }

            // Check Boss Halfway progress (50%)
            if (e.isBoss && !this.bossHalfwayTriggered) {
                const progress = e.distance / this.totalPathLength;
                if (progress >= 0.48) {
                    this.bossHalfwayTriggered = true;
                    if (this.onBossHalfway) {
                        this.onBossHalfway(e);
                    }
                }
            }

            // Reached Base?
            if (e.distance >= this.totalPathLength) {
                const dmg = e.isBoss ? 45 : (e.type === 'tank' ? 20 : (e.type === 'trooper' ? 12 : 8));
                this.damageBase(dmg);
                this.createExplosion(e.x, e.y, 45, '#ef4444');
                this.enemies.splice(i, 1);
                continue;
            }
        }

        // 4. Update Turrets & Target Acquisition with Priorities
        for (const t of this.turrets) {
            if (t.cooldown > 0) {
                t.cooldown -= dt;
            }
            if (t.recoil > 0) {
                t.recoil = Math.max(0, t.recoil - dt * 10);
            }

            // Filter enemies in range
            const inRange = [];
            for (const e of this.enemies) {
                const d = Math.hypot(e.x - t.x, e.y - t.y);
                if (d <= t.range) {
                    inRange.push({ enemy: e, distToTurret: d });
                }
            }

            let bestEnemy = null;
            if (inRange.length > 0) {
                const priority = t.targetPriority || 'first';
                if (priority === 'strongest') {
                    inRange.sort((a, b) => b.enemy.hp - a.enemy.hp);
                } else if (priority === 'weakest') {
                    inRange.sort((a, b) => a.enemy.hp - b.enemy.hp);
                } else if (priority === 'closest') {
                    inRange.sort((a, b) => a.distToTurret - b.distToTurret);
                } else {
                    // 'first': furthest distance along path
                    inRange.sort((a, b) => b.enemy.distance - a.enemy.distance);
                }
                bestEnemy = inRange[0].enemy;
            }

            t.target = bestEnemy;

            if (t.target) {
                t.angle = Math.atan2(t.target.y - t.y, t.target.x - t.x);

                if (t.cooldown <= 0) {
                    this.fireTurret(t, t.target);
                    t.cooldown = 1 / t.fireRate;
                    t.recoil = 4; // visual recoil kickback
                }
            }
        }

        // 5. Update Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];

            if (p.type === 'artillery') {
                const distToDest = Math.hypot(p.targetX - p.x, p.targetY - p.y);
                const step = p.speed * dt;

                if (distToDest <= step || distToDest < 10) {
                    this.detonateArtillery(p);
                    this.projectiles.splice(i, 1);
                    continue;
                } else {
                    const angle = Math.atan2(p.targetY - p.y, p.targetX - p.x);
                    p.x += Math.cos(angle) * step;
                    p.y += Math.sin(angle) * step;
                    p.life -= dt;

                    // Rocket smoke/fire trail
                    if (Math.random() < 0.45) {
                        this.particles.push({
                            x: p.x,
                            y: p.y,
                            vx: (Math.random() - 0.5) * 15,
                            vy: (Math.random() - 0.5) * 15,
                            color: Math.random() < 0.5 ? '#f59e0b' : '#94a3b8',
                            size: 3,
                            life: 0.35,
                            maxLife: 0.35
                        });
                    }
                }
            } else {
                let targetX = p.target ? p.target.x : p.targetX;
                let targetY = p.target ? p.target.y : p.targetY;

                const angle = Math.atan2(targetY - p.y, targetX - p.x);
                p.x += Math.cos(angle) * p.speed * dt;
                p.y += Math.sin(angle) * p.speed * dt;

                const dist = Math.hypot(targetX - p.x, targetY - p.y);
                if (dist < 15 || (p.target && dist < p.target.radius + 8)) {
                    this.hitEnemy(p, p.target);
                    this.projectiles.splice(i, 1);
                    continue;
                }

                p.life -= dt;
                if (p.life <= 0) {
                    this.projectiles.splice(i, 1);
                }
            }
        }

        // 6. Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const part = this.particles[i];
            part.x += part.vx * dt;
            part.y += part.vy * dt;
            part.life -= dt;
            if (part.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // 7. Update Floating Combat Text
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy * dt;
            ft.life -= dt;
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }

        // 8. Super Strike Animation
        if (this.superStrikeBeam) {
            this.superStrikeBeam.timer -= dt;
            if (this.superStrikeBeam.timer <= 0) {
                this.superStrikeBeam = null;
            }
        }

        // 9. Screen Shake Decay
        if (this.screenShake > 0) {
            this.screenShake = Math.max(0, this.screenShake - dt * 25);
        }

        // 10. Check Wave Completion
        if (this.waveInProgress && this.spawnQueue.length === 0 && this.enemies.length === 0) {
            this.completeWave();
        }
    }

    fireTurret(turret, target) {
        const muzzleX = turret.x + Math.cos(turret.angle) * 18;
        const muzzleY = turret.y + Math.sin(turret.angle) * 18;

        if (turret.type === 'plasma') {
            this.projectiles.push({
                x: muzzleX,
                y: muzzleY,
                turretSource: turret,
                target: target,
                targetX: target.x,
                targetY: target.y,
                speed: turret.bulletSpeed,
                damage: turret.damage,
                type: 'plasma',
                color: turret.color,
                life: 1.5
            });
            if (window.soundManager) window.soundManager.playLaser();
        } else if (turret.type === 'cryo') {
            this.projectiles.push({
                x: muzzleX,
                y: muzzleY,
                turretSource: turret,
                target: target,
                targetX: target.x,
                targetY: target.y,
                speed: turret.bulletSpeed,
                damage: turret.damage,
                slowFactor: turret.slowFactor,
                slowDuration: turret.slowDuration,
                type: 'cryo',
                color: turret.color,
                life: 1.8
            });
            if (window.soundManager) window.soundManager.playFreeze();
        } else if (turret.type === 'artillery') {
            this.projectiles.push({
                x: muzzleX,
                y: muzzleY,
                turretSource: turret,
                targetX: target.x,
                targetY: target.y,
                speed: turret.bulletSpeed,
                damage: turret.damage,
                blastRadius: turret.blastRadius,
                type: 'artillery',
                color: turret.color,
                life: 2.5
            });
            if (window.soundManager) window.soundManager.playArtilleryLaunch();
        }

        // Muzzle flash particle
        this.createSparks(muzzleX, muzzleY, turret.color, 4);
    }

    hitEnemy(projectile, enemy) {
        if (!enemy || enemy.hp <= 0) return;

        enemy.hp -= projectile.damage;
        if (projectile.turretSource) {
            projectile.turretSource.totalDamage += projectile.damage;
        }

        this.addFloatingText(`-${projectile.damage}`, enemy.x, enemy.y - 10, projectile.color, 900);
        this.createSparks(enemy.x, enemy.y, projectile.color, 8);

        if (projectile.type === 'cryo') {
            enemy.slowTimer = projectile.slowDuration;
            enemy.slowFactor = projectile.slowFactor;
            this.createSparks(enemy.x, enemy.y, '#e0f2fe', 12);
        }

        if (enemy.hp <= 0) {
            this.destroyEnemy(enemy, projectile.turretSource);
        }
    }

    detonateArtillery(projectile) {
        this.screenShake = 7;
        this.createExplosion(projectile.targetX, projectile.targetY, projectile.blastRadius, '#f59e0b');
        if (window.soundManager) window.soundManager.playExplosion();

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            const dist = Math.hypot(e.x - projectile.targetX, e.y - projectile.targetY);
            if (dist <= projectile.blastRadius) {
                const damageRatio = Math.max(0.4, 1 - (dist / projectile.blastRadius));
                const dmg = Math.round(projectile.damage * damageRatio);
                e.hp -= dmg;
                if (projectile.turretSource) {
                    projectile.turretSource.totalDamage += dmg;
                }

                this.addFloatingText(`-${dmg}`, e.x, e.y - 10, '#f59e0b', 1000);

                if (e.hp <= 0) {
                    this.destroyEnemy(e, projectile.turretSource);
                }
            }
        }
    }

    destroyEnemy(enemy, killerTurret) {
        const idx = this.enemies.indexOf(enemy);
        if (idx !== -1) {
            this.enemies.splice(idx, 1);
        }

        if (killerTurret) {
            killerTurret.totalKills += 1;
        }

        this.score += enemy.rewardScore;
        this.enemiesDefeated++;
        this.createExplosion(enemy.x, enemy.y, enemy.radius * 2.2, enemy.color);

        if (enemy.isBoss) {
            this.activeBoss = null;
            this.screenShake = 16;
            this.addFloatingText("БОСС УНИЧТОЖЕН! +600", enemy.x, enemy.y - 30, '#facc15', 2500);
            if (window.soundManager) window.soundManager.playVictory();
        }

        this.notifyStats();
    }

    damageBase(amount) {
        this.baseHp = Math.max(0, this.baseHp - amount);
        this.screenShake = 12;
        this.addFloatingText(`БАЗА: -${amount} HP!`, this.path[this.path.length - 1].x - 40, this.path[this.path.length - 1].y - 30, '#ef4444', 1500);

        if (window.soundManager) window.soundManager.playWrong();

        if (this.onBaseDamaged) {
            this.onBaseDamaged(this.baseHp, this.baseMaxHp);
        }

        if (this.baseHp <= 0) {
            this.gameOver(false);
        }
    }

    completeWave() {
        this.waveInProgress = false;
        const finishedWave = this.currentWaveIndex + 1;
        const totalWaves = this.levelData.waves.length;

        if (finishedWave >= totalWaves) {
            this.gameOver(true);
        } else {
            this.currentWaveIndex++;
            if (this.onWaveCompleted) {
                this.onWaveCompleted(finishedWave, totalWaves);
            }
            this.notifyStats();
        }
    }

    gameOver(isVictory) {
        this.isRunning = false;
        if (isVictory) {
            if (window.soundManager) window.soundManager.playVictory();
            if (this.onLevelCompleted) {
                this.onLevelCompleted(this.score, this.enemiesDefeated, this.baseHp);
            }
        } else {
            if (window.soundManager) window.soundManager.playDefeat();
            if (this.onGameOver) {
                this.onGameOver(this.score, this.enemiesDefeated, this.baseHp);
            }
        }
    }

    notifyStats() {
        if (this.onStatsUpdated) {
            this.onStatsUpdated({
                baseHp: this.baseHp,
                baseMaxHp: this.baseMaxHp,
                score: this.score,
                enemiesDefeated: this.enemiesDefeated,
                waveIndex: this.currentWaveIndex + 1,
                totalWaves: this.levelData ? this.levelData.waves.length : 1,
                enemiesRemaining: this.spawnQueue.length + this.enemies.length
            });
        }
    }

    // --- Visual FX Helpers ---
    createSparks(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 120;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                size: 2.5 + Math.random() * 2.5,
                life: 0.35 + Math.random() * 0.3,
                maxLife: 0.65
            });
        }
    }

    createExplosion(x, y, radius, color) {
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            color: color,
            isRing: true,
            currentRadius: 5,
            maxRadius: radius,
            life: 0.45,
            maxLife: 0.45
        });

        const count = Math.min(32, Math.round(radius * 0.55));
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * (radius * 2.5);
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                size: 3 + Math.random() * 4,
                life: 0.4 + Math.random() * 0.35,
                maxLife: 0.75
            });
        }
    }

    addFloatingText(text, x, y, color = '#ffffff', durationMs = 1200) {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            vy: -35,
            color: color,
            life: durationMs / 1000,
            maxLife: durationMs / 1000
        });
    }

    // --- Rendering Pipeline ---
    render() {
        this.ctx.save();

        if (this.screenShake > 0) {
            const ox = (Math.random() - 0.5) * this.screenShake;
            const oy = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(ox, oy);
        }

        // 1. Clear & Background Grid
        this.renderBackground();

        // 2. Render Path & Circuit Waypoints
        this.renderPath();

        // 3. Render Spawn Portal & Base Core
        this.renderPortalAndBase();

        // 4. Render Turret Slots & Hover Overlays
        this.renderSlots();

        // 5. Render Turrets
        this.renderTurrets();

        // 6. Render Enemies
        this.renderEnemies();

        // 7. Render Projectiles
        this.renderProjectiles();

        // 8. Render Particles & Shockwaves
        this.renderParticles();

        // 9. Render Super Strike Ion Beam
        if (this.superStrikeBeam) {
            this.renderSuperStrikeBeam();
        }

        // 10. Render Floating Combat Text
        this.renderFloatingTexts();

        // 11. Tactical Pause Watermark
        if (this.isPaused) {
            this.renderPauseOverlay();
        }

        this.ctx.restore();
    }

    renderBackground() {
        // Dark futuristic slate background
        this.ctx.fillStyle = '#0a0e17';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Cybernetic matrix grid with glowing intersection dots
        this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
        this.ctx.lineWidth = 1;
        const gridSize = 40;

        for (let x = 0; x <= this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    renderPath() {
        if (!this.path || this.path.length < 2) return;

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Outer Glow Trench
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.strokeStyle = 'rgba(15, 23, 42, 0.95)';
        this.ctx.lineWidth = 38;
        this.ctx.stroke();

        // Circuit Highway
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        this.ctx.lineWidth = 26;
        this.ctx.stroke();

        // Central Neon Spine
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Animated Travelling Pulse Arrows
        const pulseSpacing = 70;
        const totalPoints = Math.floor(this.totalPathLength / pulseSpacing);
        for (let i = 0; i < totalPoints; i++) {
            const dist = (i * pulseSpacing + this.pathPulseOffset) % this.totalPathLength;
            const pt = this.getPointAtDistance(dist);
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.shadowColor = '#38bdf8';
            this.ctx.shadowBlur = 8;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        // Draw Waypoint Circuit Nodes
        for (let i = 0; i < this.path.length; i++) {
            const p = this.path[i];
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#0f172a';
            this.ctx.fill();
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    renderPortalAndBase() {
        if (!this.path || this.path.length < 2) return;
        const start = this.path[0];
        const end = this.path[this.path.length - 1];

        // 1. Spawn Portal Vortex
        const time = performance.now() * 0.003;
        this.ctx.save();
        this.ctx.translate(start.x, start.y);

        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 24 + Math.sin(time) * 4, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 13, 0, Math.PI * 2);
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 14;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 11px Orbitron, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('СПАВН', 0, -30);

        this.ctx.restore();

        // 2. Base Core Reactor
        this.ctx.save();
        this.ctx.translate(end.x, end.y);

        // Outer Rotating Shield Segments
        this.ctx.strokeStyle = '#22c55e';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
        this.ctx.stroke();

        // Pulsing Core
        const coreSize = 17 + Math.cos(time * 1.5) * 2;
        const grad = this.ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.45, '#22c55e');
        grad.addColorStop(1, '#0f172a');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
        this.ctx.shadowColor = '#22c55e';
        this.ctx.shadowBlur = 18;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Mini Base HP bar
        const hpPercent = this.baseHp / this.baseMaxHp;
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(-26, 36, 52, 7);
        this.ctx.fillStyle = hpPercent > 0.4 ? '#22c55e' : (hpPercent > 0.2 ? '#f59e0b' : '#ef4444');
        this.ctx.fillRect(-26, 36, 52 * hpPercent, 7);

        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 11px Orbitron, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`БАЗА: ${this.baseHp}%`, 0, -36);

        this.ctx.restore();
    }

    renderSlots() {
        for (const slot of this.slots) {
            const isHovered = (this.hoveredSlot === slot);

            this.ctx.save();
            this.ctx.translate(slot.x, slot.y);

            if (slot.turret) {
                // Show range indicator if hovered
                if (isHovered) {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, slot.turret.range, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
                    this.ctx.fill();
                    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
                    this.ctx.setLineDash([6, 4]);
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
                }
            } else if (slot.cooldownTimer > 0) {
                // Cooldown State
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 22, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
                this.ctx.fill();
                this.ctx.strokeStyle = '#ef4444';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                this.ctx.fillStyle = '#ef4444';
                this.ctx.font = 'bold 11px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`🔒 ${slot.cooldownTimer.toFixed(1)}s`, 0, 4);
            } else {
                // Empty Available Slot
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
                this.ctx.fillStyle = isHovered ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.55)';
                this.ctx.fill();

                this.ctx.strokeStyle = isHovered ? '#38bdf8' : 'rgba(148, 163, 184, 0.45)';
                this.ctx.lineWidth = isHovered ? 2.5 : 1.5;
                this.ctx.setLineDash(isHovered ? [4, 2] : [3, 3]);
                this.ctx.stroke();
                this.ctx.setLineDash([]);

                this.ctx.fillStyle = isHovered ? '#38bdf8' : 'rgba(148, 163, 184, 0.7)';
                this.ctx.font = 'bold 16px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('+', 0, 0);

                if (isHovered) {
                    this.ctx.font = '10px Orbitron, sans-serif';
                    this.ctx.fillStyle = '#38bdf8';
                    this.ctx.fillText('СТРОИТЬ', 0, 32);
                }
            }

            this.ctx.restore();
        }
    }

    renderTurrets() {
        for (const t of this.turrets) {
            this.ctx.save();
            this.ctx.translate(t.x, t.y);

            // Level 2/3 Outer Hologram Ring
            if (t.level >= 2) {
                const ringSpeed = performance.now() * 0.002 * (t.level === 3 ? 2 : 1);
                this.ctx.save();
                this.ctx.rotate(ringSpeed);
                this.ctx.strokeStyle = t.color;
                this.ctx.lineWidth = 1.5;
                this.ctx.setLineDash([5, 5]);
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 23, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Turret Base Pedestal
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fill();
            this.ctx.strokeStyle = t.color;
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();

            // Turret Rotating Head & Barrels with Recoil
            this.ctx.rotate(t.angle);
            const recoilOffset = -(t.recoil || 0);

            if (t.type === 'artillery') {
                // Heavy Double Cannon with recoil
                this.ctx.fillStyle = '#475569';
                this.ctx.fillRect(4 + recoilOffset, -7, 18, 5);
                this.ctx.fillRect(4 + recoilOffset, 2, 18, 5);
            } else if (t.type === 'cryo') {
                // Cryo Crystal emitter
                this.ctx.fillStyle = '#06b6d4';
                this.ctx.beginPath();
                this.ctx.moveTo(8 + recoilOffset, -6);
                this.ctx.lineTo(22 + recoilOffset, 0);
                this.ctx.lineTo(8 + recoilOffset, 6);
                this.ctx.closePath();
                this.ctx.fill();
            } else {
                // Rapid Plasma Cannon
                this.ctx.fillStyle = '#38bdf8';
                this.ctx.fillRect(4 + recoilOffset, -3.5, 17, 7);
            }

            // Central Core Dome
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
            this.ctx.fillStyle = t.color;
            this.ctx.shadowColor = t.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            this.ctx.restore();

            // Level Stars & Priority Tag Badge above turret
            this.ctx.save();
            this.ctx.translate(t.x, t.y);
            this.ctx.fillStyle = '#facc15';
            this.ctx.font = 'bold 11px sans-serif';
            this.ctx.textAlign = 'center';
            const stars = t.level === 3 ? '★★★' : (t.level === 2 ? '★★' : '★');
            this.ctx.fillText(stars, 0, -23);

            // Small priority indicator dot
            if (t.targetPriority && t.targetPriority !== 'first') {
                this.ctx.fillStyle = '#a855f7';
                this.ctx.font = '9px sans-serif';
                const pTag = t.targetPriority === 'strongest' ? 'HP' : (t.targetPriority === 'closest' ? 'NEAR' : 'LOW');
                this.ctx.fillText(`[${pTag}]`, 0, 28);
            }

            this.ctx.restore();
        }
    }

    renderEnemies() {
        for (const e of this.enemies) {
            this.ctx.save();
            this.ctx.translate(e.x, e.y);

            const isSlowed = (e.slowTimer > 0);

            // Boss Pulsing Aura and Orbiting Defense Nodes
            if (e.isBoss) {
                const auraPulse = Math.sin(performance.now() * 0.006) * 6;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, e.radius + 14 + auraPulse, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
                this.ctx.fill();
                this.ctx.strokeStyle = '#a855f7';
                this.ctx.lineWidth = 2.5;
                this.ctx.stroke();

                // Orbiting Shield Node
                const orbitAngle = performance.now() * 0.004;
                const ox = Math.cos(orbitAngle) * (e.radius + 10);
                const oy = Math.sin(orbitAngle) * (e.radius + 10);
                this.ctx.beginPath();
                this.ctx.arc(ox, oy, 4, 0, Math.PI * 2);
                this.ctx.fillStyle = '#f43f5e';
                this.ctx.fill();
            }

            // Enemy Body
            this.ctx.beginPath();
            this.ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = isSlowed ? '#67e8f9' : e.color;
            this.ctx.shadowColor = isSlowed ? '#67e8f9' : e.color;
            this.ctx.shadowBlur = e.isBoss ? 18 : 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            this.ctx.strokeStyle = '#0f172a';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Enemy Icon
            this.ctx.fillStyle = '#0f172a';
            this.ctx.font = `bold ${e.isBoss ? 15 : 10}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(e.isBoss ? '👑' : (e.type === 'tank' ? '🛡️' : '⚡'), 0, 0);

            // Health Bar
            const barWidth = e.isBoss ? 58 : (e.radius * 2 + 8);
            const barHeight = e.isBoss ? 6 : 4;
            const barY = -e.radius - 11;
            const hpRatio = Math.max(0, e.hp / e.maxHp);

            this.ctx.fillStyle = '#0f172a';
            this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);

            this.ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : (hpRatio > 0.2 ? '#f59e0b' : '#ef4444');
            this.ctx.fillRect(-barWidth / 2, barY, barWidth * hpRatio, barHeight);

            if (e.isBoss) {
                this.ctx.fillStyle = '#f8fafc';
                this.ctx.font = 'bold 10px Orbitron, sans-serif';
                this.ctx.fillText(e.name, 0, barY - 6);
            }

            this.ctx.restore();
        }
    }

    renderProjectiles() {
        for (const p of this.projectiles) {
            this.ctx.save();
            if (p.type === 'artillery') {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
                this.ctx.fillStyle = '#f59e0b';
                this.ctx.shadowColor = '#f59e0b';
                this.ctx.shadowBlur = 12;
                this.ctx.fill();
            } else if (p.type === 'cryo') {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
                this.ctx.fillStyle = '#38bdf8';
                this.ctx.shadowColor = '#38bdf8';
                this.ctx.shadowBlur = 10;
                this.ctx.fill();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 3.8, 0, Math.PI * 2);
                this.ctx.fillStyle = '#38bdf8';
                this.ctx.shadowColor = '#38bdf8';
                this.ctx.shadowBlur = 10;
                this.ctx.fill();
            }
            this.ctx.restore();
        }
    }

    renderParticles() {
        for (const part of this.particles) {
            this.ctx.save();
            const alpha = Math.max(0, part.life / part.maxLife);
            this.ctx.globalAlpha = alpha;

            if (part.isRing) {
                const curR = (1 - alpha) * part.maxRadius;
                this.ctx.beginPath();
                this.ctx.arc(part.x, part.y, curR, 0, Math.PI * 2);
                this.ctx.strokeStyle = part.color;
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
                this.ctx.fillStyle = part.color;
                this.ctx.fill();
            }
            this.ctx.restore();
        }
    }

    renderSuperStrikeBeam() {
        if (!this.superStrikeBeam) return;
        const { x, y, timer } = this.superStrikeBeam;
        const alpha = Math.min(1, timer / 0.4);

        this.ctx.save();
        this.ctx.globalAlpha = alpha;

        const grad = this.ctx.createLinearGradient(x - 25, 0, x + 25, 0);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.1)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.1)');

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(x - 30, 0, 60, y);

        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 75, 30, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.shadowColor = '#a855f7';
        this.ctx.shadowBlur = 35;
        this.ctx.fill();

        this.ctx.restore();
    }

    renderFloatingTexts() {
        for (const ft of this.floatingTexts) {
            this.ctx.save();
            const alpha = Math.max(0, ft.life / ft.maxLife);
            this.ctx.globalAlpha = alpha;
            this.ctx.font = 'bold 13px Rajdhani, sans-serif';
            this.ctx.fillStyle = ft.color;
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(ft.text, ft.x, ft.y);
            this.ctx.restore();
        }
    }

    renderPauseOverlay() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#38bdf8';
        this.ctx.font = 'bold 24px Orbitron, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#38bdf8';
        this.ctx.shadowBlur = 12;
        this.ctx.fillText('⏸ ТАКТИЧЕСКАЯ ПАУЗА // КВИЗ-РЕЖИМ', this.width / 2, this.height / 2);
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '14px Rajdhani, sans-serif';
        this.ctx.fillText('Поле боя заморожено. Ответьте на теоретический вопрос для развертывания системы.', this.width / 2, this.height / 2 + 35);
        this.ctx.restore();
    }
}

window.GameEngine = GameEngine;
