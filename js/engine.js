/**
 * 16-BIT RETRO ARCADE GAME ENGINE
 * Complete visual overhaul: pixel-art sprites, chunky 8-bit projectiles,
 * arcade grid, starfield, bounce text, and explosive retro FX.
 */
class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // High-definition canvas with crisp pixel scaling
        this.width = 1000;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx.imageSmoothingEnabled = false;

        // Game State
        this.isRunning = false;
        this.isPaused = false;
        this.gameSpeed = 1.0;
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

        // Background Starfield
        this.stars = [];
        for (let i = 0; i < 70; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() < 0.3 ? 3 : 2,
                color: Math.random() < 0.4 ? '#fde047' : (Math.random() < 0.7 ? '#22d3ee' : '#ffffff'),
                twinkle: Math.random() * Math.PI * 2
            });
        }

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
        this.globalAnimTimer = 0;

        // Callbacks
        this.onSlotClick = null;
        this.onBossHalfway = null;
        this.onWaveCompleted = null;
        this.onLevelCompleted = null;
        this.onGameOver = null;
        this.onBaseDamaged = null;
        this.onStatsUpdated = null;

        this.initInput();
    }

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
            if (dist <= 32) {
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
            if (dist <= 32) {
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

    loadLevel(levelConfig) {
        this.levelData = levelConfig;
        this.path = levelConfig.path;
        this.calculatePathMetrics();

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
            radius: data.isBoss ? 28 : (data.type === 'tank' ? 20 : (data.type === 'trooper' ? 15 : 12)),
            slowTimer: 0,
            slowFactor: 1.0,
            animFrame: 0
        };

        if (enemy.isBoss) {
            this.activeBoss = enemy;
            if (window.soundManager) window.soundManager.playWarning();
            this.addFloatingText("WARNING: BOSS SPAWNED!", enemy.x, enemy.y - 40, '#f43f5e', 3500);
        }

        this.enemies.push(enemy);
    }

    buildTurret(slotId, turretType) {
        const slot = this.slots.find(s => s.id === slotId);
        if (!slot) return false;

        let turretConfig = {};
        if (turretType === 'plasma') {
            turretConfig = {
                type: 'plasma',
                name: 'Плазма-Бластер',
                range: 160,
                fireRate: 3.2,
                damage: 20,
                bulletSpeed: 550,
                color: '#fde047',
                level: 1
            };
        } else if (turretType === 'cryo') {
            turretConfig = {
                type: 'cryo',
                name: 'Крио-Призма',
                range: 145,
                fireRate: 1.3,
                damage: 15,
                bulletSpeed: 420,
                slowFactor: 0.50,
                slowDuration: 2.5,
                color: '#22d3ee',
                level: 1
            };
        } else if (turretType === 'artillery') {
            turretConfig = {
                type: 'artillery',
                name: 'Ракетная Мортира',
                range: 195,
                fireRate: 0.65,
                damage: 75,
                blastRadius: 85,
                bulletSpeed: 310,
                color: '#f43f5e',
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
            targetPriority: 'first',
            totalKills: 0,
            totalDamage: 0
        };

        this.turrets.push(slot.turret);
        this.createPixelSparks(slot.x, slot.y, slot.turret.color, 25);
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

        this.createPixelSparks(slot.x, slot.y, '#fde047', 35);
        this.addFloatingText(`LEVEL UP! LV.${t.level}`, slot.x, slot.y - 25, '#fde047', 1800);
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

        this.createPixelSparks(slot.x, slot.y, '#ffffff', 20);
        this.addFloatingText("DISMANTLED", slot.x, slot.y - 20, '#ffffff', 1500);
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
            this.createPixelSparks(slot.x, slot.y, '#f43f5e', 20);
            this.addFloatingText("LOCKED 5s", slot.x, slot.y - 20, '#f43f5e', 2000);
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

        this.screenShake = 24;
        this.createPixelExplosion(boss.x, boss.y, 140, '#f43f5e');
        this.addFloatingText(`-50% HP [SUPER STRIKE: ${damage}]`, boss.x, boss.y - 45, '#fde047', 3000);

        if (window.soundManager) window.soundManager.playSuperStrike();

        if (boss.hp <= 0) {
            this.destroyEnemy(boss, null);
        }
        return true;
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const rawDelta = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        const dt = Math.min(rawDelta, 0.1) * this.gameSpeed;

        if (!this.isPaused) {
            this.update(dt);
        }

        this.render();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        this.globalAnimTimer += dt * 8;
        this.pathPulseOffset = (this.pathPulseOffset + dt * 60) % 80;

        // 1. Slots cooldown
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

        // 3. Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.animFrame += dt * 10;

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

            e.distance += e.speed * 60 * dt;
            const pt = this.getPointAtDistance(e.distance);
            e.x = pt.x;
            e.y = pt.y;

            if (e.isBoss && !this.bossHalfwayTriggered) {
                const progress = e.distance / this.totalPathLength;
                if (progress >= 0.48) {
                    this.bossHalfwayTriggered = true;
                    if (this.onBossHalfway) {
                        this.onBossHalfway(e);
                    }
                }
            }

            if (e.distance >= this.totalPathLength) {
                const dmg = e.isBoss ? 45 : (e.type === 'tank' ? 20 : (e.type === 'trooper' ? 12 : 8));
                this.damageBase(dmg);
                this.createPixelExplosion(e.x, e.y, 45, '#f43f5e');
                this.enemies.splice(i, 1);
                continue;
            }
        }

        // 4. Turrets
        for (const t of this.turrets) {
            if (t.cooldown > 0) t.cooldown -= dt;
            if (t.recoil > 0) t.recoil = Math.max(0, t.recoil - dt * 12);

            const inRange = [];
            for (const e of this.enemies) {
                const d = Math.hypot(e.x - t.x, e.y - t.y);
                if (d <= t.range) inRange.push({ enemy: e, distToTurret: d });
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
                    t.recoil = 6;
                }
            }
        }

        // 5. Projectiles
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

                    // Retro Square Smoke
                    if (Math.random() < 0.5) {
                        this.particles.push({
                            x: p.x,
                            y: p.y,
                            vx: (Math.random() - 0.5) * 15,
                            vy: (Math.random() - 0.5) * 15,
                            color: Math.random() < 0.5 ? '#fde047' : '#ffffff',
                            size: 4,
                            isSquare: true,
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

        // 6. Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const part = this.particles[i];
            part.x += part.vx * dt;
            part.y += part.vy * dt;
            part.life -= dt;
            if (part.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // 7. Floating Texts with Arcade Bounce
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy * dt;
            ft.vy += 25 * dt; // gravity deceleration
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

        // 10. Wave Completion
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

        this.createPixelSparks(muzzleX, muzzleY, turret.color, 6);
    }

    hitEnemy(projectile, enemy) {
        if (!enemy || enemy.hp <= 0) return;

        enemy.hp -= projectile.damage;
        if (projectile.turretSource) {
            projectile.turretSource.totalDamage += projectile.damage;
        }

        this.addFloatingText(`-${projectile.damage}`, enemy.x, enemy.y - 12, projectile.color, 900);
        this.createPixelSparks(enemy.x, enemy.y, projectile.color, 8);

        if (projectile.type === 'cryo') {
            enemy.slowTimer = projectile.slowDuration;
            enemy.slowFactor = projectile.slowFactor;
            this.createPixelSparks(enemy.x, enemy.y, '#22d3ee', 12);
        }

        if (enemy.hp <= 0) {
            this.destroyEnemy(enemy, projectile.turretSource);
        }
    }

    detonateArtillery(projectile) {
        this.screenShake = 8;
        this.createPixelExplosion(projectile.targetX, projectile.targetY, projectile.blastRadius, '#f43f5e');
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

                this.addFloatingText(`-${dmg}`, e.x, e.y - 12, '#fde047', 1000);

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
        this.createPixelExplosion(enemy.x, enemy.y, enemy.radius * 2.4, enemy.color);

        if (enemy.isBoss) {
            this.activeBoss = null;
            this.screenShake = 18;
            this.addFloatingText("BOSS DEFEATED! +600", enemy.x, enemy.y - 30, '#fde047', 2500);
            if (window.soundManager) window.soundManager.playVictory();
        }

        this.notifyStats();
    }

    damageBase(amount) {
        this.baseHp = Math.max(0, this.baseHp - amount);
        this.screenShake = 14;
        this.addFloatingText(`BASE HIT: -${amount} HP!`, this.path[this.path.length - 1].x - 40, this.path[this.path.length - 1].y - 30, '#f43f5e', 1500);

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

    // --- Retro Pixel FX Helpers ---
    createPixelSparks(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 140;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                size: 3.5,
                isSquare: true,
                life: 0.35 + Math.random() * 0.25,
                maxLife: 0.6
            });
        }
    }

    createPixelExplosion(x, y, radius, color) {
        // Pixel Expanding Ring
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            color: color,
            isRing: true,
            currentRadius: 6,
            maxRadius: radius,
            life: 0.4,
            maxLife: 0.4
        });

        // Pixel Fireball debris
        const count = Math.min(36, Math.round(radius * 0.6));
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * (radius * 2.8);
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: Math.random() < 0.4 ? '#fde047' : color,
                size: 4 + Math.random() * 4,
                isSquare: true,
                life: 0.4 + Math.random() * 0.3,
                maxLife: 0.7
            });
        }
    }

    addFloatingText(text, x, y, color = '#fde047', durationMs = 1200) {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            vy: -55,
            color: color,
            life: durationMs / 1000,
            maxLife: durationMs / 1000
        });
    }

    // --- Retro Pixel Canvas Rendering ---
    render() {
        this.ctx.save();

        if (this.screenShake > 0) {
            const ox = (Math.random() - 0.5) * this.screenShake;
            const oy = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(ox, oy);
        }

        // 1. Retro Chequered Grid & Starfield
        this.renderRetroBackground();

        // 2. Chunky Segmented 8-bit Path
        this.renderRetroPath();

        // 3. Pixel Spawn Vortex & Mainframe Base
        this.renderPortalAndBase();

        // 4. Pixel Turret Slots
        this.renderSlots();

        // 5. Pixel Turrets with Recoil
        this.renderTurrets();

        // 6. Retro Pixel Enemy Sprites
        this.renderEnemies();

        // 7. Chunky Projectiles
        this.renderProjectiles();

        // 8. Square Pixel Particles & Explosions
        this.renderParticles();

        // 9. Retro Super Strike Rainbow Beam
        if (this.superStrikeBeam) {
            this.renderSuperStrikeBeam();
        }

        // 10. Pixel Combat Text
        this.renderFloatingTexts();

        // 11. Arcade Pause Overlay
        if (this.isPaused) {
            this.renderPauseOverlay();
        }

        this.ctx.restore();
    }

    renderRetroBackground() {
        // Deep arcade purple-black
        this.ctx.fillStyle = '#080414';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Retro Twinkling Pixel Stars
        for (const star of this.stars) {
            const alpha = 0.5 + Math.sin(performance.now() * 0.003 + star.twinkle) * 0.5;
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        this.ctx.globalAlpha = 1.0;

        // Retro Synthwave Horizon Grid
        this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.15)';
        this.ctx.lineWidth = 2;
        const tileSize = 50;

        for (let x = 0; x <= this.width; x += tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.height; y += tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    renderRetroPath() {
        if (!this.path || this.path.length < 2) return;

        // Outer Pixel Border
        this.ctx.lineCap = 'square';
        this.ctx.lineJoin = 'miter';

        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 42;
        this.ctx.stroke();

        // Chunky Neon Yellow / Magenta Roadway
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 32;
        this.ctx.stroke();

        // Central Dotted Road Spine
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.strokeStyle = '#fde047';
        this.ctx.lineWidth = 6;
        this.ctx.setLineDash([12, 12]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Animated Travelling Pixel Directional Arrows
        const pulseSpacing = 75;
        const totalPoints = Math.floor(this.totalPathLength / pulseSpacing);
        for (let i = 0; i < totalPoints; i++) {
            const dist = (i * pulseSpacing + this.pathPulseOffset) % this.totalPathLength;
            const pt = this.getPointAtDistance(dist);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
        }

        // Waypoint Square Nodes
        for (let i = 0; i < this.path.length; i++) {
            const p = this.path[i];
            this.ctx.fillStyle = '#fde047';
            this.ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
        }
    }

    renderPortalAndBase() {
        if (!this.path || this.path.length < 2) return;
        const start = this.path[0];
        const end = this.path[this.path.length - 1];

        // 1. Retro Spawn Portal Vortex
        const time = performance.now() * 0.005;
        this.ctx.save();
        this.ctx.translate(start.x, start.y);

        this.ctx.fillStyle = '#f43f5e';
        this.ctx.fillRect(-18, -18, 36, 36);

        this.ctx.rotate(time);
        this.ctx.fillStyle = '#fde047';
        this.ctx.fillRect(-12, -12, 24, 24);

        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(-6, -6, 12, 12);

        this.ctx.restore();

        this.ctx.fillStyle = '#fde047';
        this.ctx.font = 'bold 10px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPAWN', start.x, start.y - 28);

        // 2. Retro Mainframe Defense Core
        this.ctx.save();
        this.ctx.translate(end.x, end.y);

        // Outer Pixel Shield
        this.ctx.strokeStyle = '#4ade80';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(-24, -24, 48, 48);

        // Inner Power Crystal
        this.ctx.fillStyle = '#22d3ee';
        this.ctx.fillRect(-14, -14, 28, 28);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(-6, -6, 12, 12);

        // Base HP Text
        this.ctx.fillStyle = '#4ade80';
        this.ctx.font = 'bold 10px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`BASE:${this.baseHp}%`, 0, -32);

        this.ctx.restore();
    }

    renderSlots() {
        for (const slot of this.slots) {
            const isHovered = (this.hoveredSlot === slot);

            this.ctx.save();
            this.ctx.translate(slot.x, slot.y);

            if (slot.turret) {
                // Range box on hover
                if (isHovered) {
                    this.ctx.strokeStyle = '#22d3ee';
                    this.ctx.lineWidth = 2;
                    this.ctx.setLineDash([8, 6]);
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, slot.turret.range, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
                }
            } else if (slot.cooldownTimer > 0) {
                // Locked Slot
                this.ctx.fillStyle = '#2a0815';
                this.ctx.fillRect(-18, -18, 36, 36);
                this.ctx.strokeStyle = '#f43f5e';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(-18, -18, 36, 36);

                this.ctx.fillStyle = '#f43f5e';
                this.ctx.font = 'bold 8px "Press Start 2P", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${slot.cooldownTimer.toFixed(1)}s`, 0, 4);
            } else {
                // Available Slot
                this.ctx.fillStyle = isHovered ? '#311b59' : '#170d2c';
                this.ctx.fillRect(-18, -18, 36, 36);

                this.ctx.strokeStyle = isHovered ? '#fde047' : '#22d3ee';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(-18, -18, 36, 36);

                // Pixel Plus
                this.ctx.fillStyle = isHovered ? '#fde047' : '#22d3ee';
                this.ctx.fillRect(-2, -8, 4, 16);
                this.ctx.fillRect(-8, -2, 16, 4);

                if (isHovered) {
                    this.ctx.font = '8px "Press Start 2P", monospace';
                    this.ctx.fillStyle = '#fde047';
                    this.ctx.fillText('BUILD', 0, 30);
                }
            }

            this.ctx.restore();
        }
    }

    renderTurrets() {
        for (const t of this.turrets) {
            this.ctx.save();
            this.ctx.translate(t.x, t.y);

            // Beveled Square Base Pedestal
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(-18, -18, 36, 36);
            this.ctx.fillStyle = '#21133d';
            this.ctx.fillRect(-15, -15, 30, 30);
            this.ctx.strokeStyle = t.color;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(-15, -15, 30, 30);

            // Rotating Turret Cannons
            this.ctx.rotate(t.angle);
            const recoilOffset = -(t.recoil || 0);

            if (t.type === 'artillery') {
                // Chunky Dual Rocket Pods
                this.ctx.fillStyle = '#f43f5e';
                this.ctx.fillRect(4 + recoilOffset, -8, 18, 6);
                this.ctx.fillRect(4 + recoilOffset, 2, 18, 6);
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(20 + recoilOffset, -7, 3, 4);
                this.ctx.fillRect(20 + recoilOffset, 3, 3, 4);
            } else if (t.type === 'cryo') {
                // Spinning 8-bit Crystal
                this.ctx.fillStyle = '#22d3ee';
                this.ctx.fillRect(6 + recoilOffset, -6, 14, 12);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(10 + recoilOffset, -3, 6, 6);
            } else {
                // Plasma Blaster Barrel
                this.ctx.fillStyle = '#fde047';
                this.ctx.fillRect(4 + recoilOffset, -4, 18, 8);
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(20 + recoilOffset, -3, 3, 6);
            }

            // Central Core
            this.ctx.fillStyle = t.color;
            this.ctx.fillRect(-8, -8, 16, 16);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(-4, -4, 8, 8);

            this.ctx.restore();

            // Level Stars & Priority Tag
            this.ctx.save();
            this.ctx.translate(t.x, t.y);
            this.ctx.fillStyle = '#fde047';
            this.ctx.font = 'bold 9px "Press Start 2P", monospace';
            this.ctx.textAlign = 'center';
            const stars = t.level === 3 ? '★★★' : (t.level === 2 ? '★★' : '★');
            this.ctx.fillText(stars, 0, -24);

            if (t.targetPriority && t.targetPriority !== 'first') {
                this.ctx.fillStyle = '#c084fc';
                this.ctx.font = '7px "Press Start 2P", monospace';
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
            const bounce = Math.sin(e.animFrame) * 2;

            if (e.isBoss) {
                // Boss Giant 16-Bit Demon Sprites
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(-e.radius - 2, -e.radius - 2 + bounce, (e.radius + 2) * 2, (e.radius + 2) * 2);

                this.ctx.fillStyle = isSlowed ? '#22d3ee' : '#f43f5e';
                this.ctx.fillRect(-e.radius, -e.radius + bounce, e.radius * 2, e.radius * 2);

                // Boss Horns / Cannons
                this.ctx.fillStyle = '#fde047';
                this.ctx.fillRect(-e.radius + 4, -e.radius - 8 + bounce, 8, 8);
                this.ctx.fillRect(e.radius - 12, -e.radius - 8 + bounce, 8, 8);

                // Multi-eyes
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(-12, -4 + bounce, 8, 8);
                this.ctx.fillRect(4, -4 + bounce, 8, 8);
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(-10, -2 + bounce, 4, 4);
                this.ctx.fillRect(6, -2 + bounce, 4, 4);
            } else if (e.type === 'tank') {
                // Pixel Battle Tank
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(-18, -14 + bounce, 36, 28);
                this.ctx.fillStyle = isSlowed ? '#22d3ee' : e.color;
                this.ctx.fillRect(-16, -12 + bounce, 32, 24);
                // Turret hatch
                this.ctx.fillStyle = '#fde047';
                this.ctx.fillRect(-6, -6 + bounce, 12, 12);
            } else if (e.type === 'trooper') {
                // Pixel Armored Walker
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(-14, -14 + bounce, 28, 28);
                this.ctx.fillStyle = isSlowed ? '#22d3ee' : e.color;
                this.ctx.fillRect(-12, -12 + bounce, 24, 24);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(-6, -6 + bounce, 12, 6);
            } else {
                // Pixel Scout Drone (Blinking Wings)
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(-12, -10 + bounce, 24, 20);
                this.ctx.fillStyle = isSlowed ? '#22d3ee' : e.color;
                this.ctx.fillRect(-10, -8 + bounce, 20, 16);
                this.ctx.fillStyle = '#fde047';
                this.ctx.fillRect(-4, -4 + bounce, 8, 8);
            }

            // Health Bar
            const barWidth = e.isBoss ? 64 : (e.radius * 2 + 8);
            const barHeight = 6;
            const barY = -e.radius - 14 + bounce;
            const hpRatio = Math.max(0, e.hp / e.maxHp);

            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(-barWidth / 2 - 2, barY - 2, barWidth + 4, barHeight + 4);

            this.ctx.fillStyle = hpRatio > 0.5 ? '#4ade80' : (hpRatio > 0.2 ? '#fde047' : '#f43f5e');
            this.ctx.fillRect(-barWidth / 2, barY, barWidth * hpRatio, barHeight);

            if (e.isBoss) {
                this.ctx.fillStyle = '#fde047';
                this.ctx.font = 'bold 8px "Press Start 2P", monospace';
                this.ctx.fillText(e.name, 0, barY - 8);
            }

            this.ctx.restore();
        }
    }

    renderProjectiles() {
        for (const p of this.projectiles) {
            this.ctx.save();
            if (p.type === 'artillery') {
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(p.x - 5, p.y - 5, 10, 10);
                this.ctx.fillStyle = '#f43f5e';
                this.ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
                this.ctx.fillStyle = '#fde047';
                this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            } else if (p.type === 'cryo') {
                this.ctx.fillStyle = '#22d3ee';
                this.ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            } else {
                this.ctx.fillStyle = '#fde047';
                this.ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
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
                this.ctx.strokeStyle = part.color;
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(part.x - curR, part.y - curR, curR * 2, curR * 2);
            } else {
                this.ctx.fillStyle = part.color;
                this.ctx.fillRect(part.x - part.size / 2, part.y - part.size / 2, part.size, part.size);
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

        // Rainbow 16-Bit Orbital Laser Beam
        const colors = ['#f43f5e', '#fb923c', '#fde047', '#4ade80', '#22d3ee', '#c084fc'];
        const bandWidth = 8;
        const startX = x - (colors.length * bandWidth) / 2;

        colors.forEach((col, idx) => {
            this.ctx.fillStyle = col;
            this.ctx.fillRect(startX + idx * bandWidth, 0, bandWidth, y);
        });

        // Pixel Ground Blast
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x - 50, y - 16, 100, 32);

        this.ctx.restore();
    }

    renderFloatingTexts() {
        for (const ft of this.floatingTexts) {
            this.ctx.save();
            const alpha = Math.max(0, ft.life / ft.maxLife);
            this.ctx.globalAlpha = alpha;
            this.ctx.font = 'bold 11px "Press Start 2P", monospace';
            this.ctx.fillStyle = '#000000';
            this.ctx.fillText(ft.text, ft.x + 2, ft.y + 2);
            this.ctx.fillStyle = ft.color;
            this.ctx.fillText(ft.text, ft.x, ft.y);
            this.ctx.restore();
        }
    }

    renderPauseOverlay() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(11, 7, 20, 0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#fde047';
        this.ctx.font = 'bold 24px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('*** PAUSE ***', this.width / 2, this.height / 2 - 15);

        this.ctx.fillStyle = '#22d3ee';
        this.ctx.font = '12px "Press Start 2P", monospace';
        this.ctx.fillText('SOLVE QUIZ TO CONTINUE DEFENSE', this.width / 2, this.height / 2 + 25);
        this.ctx.restore();
    }
}

window.GameEngine = GameEngine;
