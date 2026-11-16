/**
 * Application Controller: UI Management, Phase Transitions, Quiz Modal,
 * Turret Inspector, Theory Codex, Achievements & Mistake Review.
 */
class AppController {
    constructor() {
        this.currentLevelIndex = 0;
        this.engine = new GameEngine('gameCanvas');

        // Phase tracking: 'BRIEFING' | 'DEFENSE' | 'RESULTS'
        this.currentPhase = 'BRIEFING';

        // Briefing cards studied
        this.studiedCards = new Set();
        this.askedQuestionIds = new Set();

        // Mistake review tracking ("Чёрный ящик")
        this.wrongAnswers = [];
        this.totalQuestionsAsked = 0;
        this.correctAnswersCount = 0;
        this.currentStreak = 0;

        // Quiz State
        this.activeQuizTimer = null;
        this.quizTimeRemaining = 15;
        this.currentQuizContext = null;

        // Turret Inspection State
        this.inspectedSlot = null;

        // Super strike availability
        this.superStrikeAvailable = false;

        // Achievements Configuration
        this.achievements = [
            { id: 'ach_first_turret', title: 'Первый барьер', icon: '🛡️', desc: 'Разверните первую оборонительную турель на карте.' },
            { id: 'ach_super_strike', title: 'Орбитальный протокол', icon: '⚡', desc: 'Успешно поразите Босса ионным супер-ударом на 50% HP.' },
            { id: 'ach_streak_5', title: 'Безупречный аналитик', icon: '🎯', desc: 'Ответьте на 5 теоретических вопросов подряд без единой ошибки.' },
            { id: 'ach_flawless', title: 'Цитадель данных', icon: '🏰', desc: 'Завершите раунд обороны со 100% целостностью Базы.' },
            { id: 'ach_max_upgrade', title: 'Максимальный разгон', icon: '🔧', desc: 'Улучшите любую оборонительную турель до 3-го уровня.' },
            { id: 'ach_all_levels', title: 'Золотой медалист', icon: '🎖️', desc: 'Успешно защитите базу по всем школьным предметам!' }
        ];

        // Modals (Bootstrap 5)
        this.modals = {};

        this.init();
    }

    init() {
        this.initModals();
        this.bindEvents();
        this.bindEngineCallbacks();
        this.updateAudioButtonsUI();
        this.updatePlayerNameUI();

        // Load level in background without opening briefing modal
        this.loadLevel(this.currentLevelIndex, false);

        // Pre-fill existing pupil name if saved
        const savedName = localStorage.getItem('qtd_player_name') || '';
        const savedGrade = localStorage.getItem('qtd_player_grade') || '';
        const nameInput = document.getElementById('playerNameInput');
        const gradeInput = document.getElementById('playerGradeInput');
        if (nameInput && savedName) nameInput.value = savedName;
        if (gradeInput && savedGrade) gradeInput.value = savedGrade;

        // Show Player Login as mandatory first step
        setTimeout(() => {
            if (this.modals.playerLoginModal) {
                this.modals.playerLoginModal.show();
            }
        }, 150);
    }

    initModals() {
        const modalIds = [
            'playerLoginModal',
            'briefingModal',
            'turretSelectModal',
            'turretInspectorModal',
            'quizModal',
            'resultsModal',
            'levelSelectModal',
            'codexModal',
            'achievementsModal',
            'teacherModal'
        ];
        modalIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.bootstrap) {
                this.modals[id] = new bootstrap.Modal(el, { backdrop: 'static', keyboard: false });
            }
        });
    }

    updatePlayerNameUI() {
        const savedName = localStorage.getItem('qtd_player_name');
        const grade = localStorage.getItem('qtd_player_grade');
        const hudName = document.getElementById('hudPlayerName');
        if (hudName) {
            if (savedName) {
                hudName.textContent = grade ? `${savedName} [${grade}]` : savedName;
            } else {
                hudName.textContent = 'ВХОД';
            }
        }
    }

    bindEvents() {
        // Player Profile / Change Name Button
        const profileBtn = document.getElementById('playerProfileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.engine.pause();
                const savedName = localStorage.getItem('qtd_player_name') || '';
                const savedGrade = localStorage.getItem('qtd_player_grade') || '';
                const nameInput = document.getElementById('playerNameInput');
                const gradeInput = document.getElementById('playerGradeInput');
                if (nameInput) nameInput.value = savedName;
                if (gradeInput) gradeInput.value = savedGrade;
                this.modals.playerLoginModal.show();
            });
        }

        // Player Login Form Submit (Name -> Subject Select -> Briefing flow)
        const loginForm = document.getElementById('playerLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('playerNameInput');
                const gradeInput = document.getElementById('playerGradeInput');
                const name = (nameInput?.value || '').trim() || 'Ученик';
                const grade = (gradeInput?.value || '').trim();

                localStorage.setItem('qtd_player_name', name);
                if (grade) {
                    localStorage.setItem('qtd_player_grade', grade);
                } else {
                    localStorage.removeItem('qtd_player_grade');
                }

                this.updatePlayerNameUI();
                window.soundManager.playUpgrade();
                this.modals.playerLoginModal.hide();

                this.showToast(`👋 Привет, <strong>${name}</strong>! Выберите школьный предмет:`, 'success');
                this.renderLevelSelector();
                this.modals.levelSelectModal.show();
            });
        }

        // Sound FX Toggle
        const muteBtn = document.getElementById('muteToggleBtn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                const muted = window.soundManager.toggleMute();
                this.updateAudioButtonsUI();
                if (!muted) window.soundManager.playClick();
            });
        }

        // Ambient Music Toggle
        const musicBtn = document.getElementById('musicToggleBtn');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                window.soundManager.toggleMusic();
                this.updateAudioButtonsUI();
                window.soundManager.playClick();
            });
        }

        // Speed Buttons (Pause, 1x, 2x, 3x)
        const speedButtons = [
            { id: 'speedPauseBtn', speed: 0, isPause: true },
            { id: 'speed1xBtn', speed: 1.0 },
            { id: 'speed2xBtn', speed: 2.0 },
            { id: 'speed3xBtn', speed: 3.0 }
        ];

        speedButtons.forEach(sb => {
            const el = document.getElementById(sb.id);
            if (el) {
                el.addEventListener('click', () => {
                    window.soundManager.playClick();
                    if (sb.isPause) {
                        if (this.engine.isPaused) {
                            this.engine.resume();
                            el.classList.remove('active');
                        } else {
                            this.engine.pause();
                            el.classList.add('active');
                        }
                    } else {
                        if (this.engine.isPaused) this.engine.resume();
                        document.getElementById('speedPauseBtn')?.classList.remove('active');
                        this.engine.setGameSpeed(sb.speed);
                        document.querySelectorAll('.speed-btn-group .btn').forEach(b => {
                            if (b.id !== 'speedPauseBtn') b.classList.remove('active');
                        });
                        el.classList.add('active');
                    }
                });
            }
        });

        // Level Select Button
        const levelSelectBtn = document.getElementById('levelSelectBtn');
        if (levelSelectBtn) {
            levelSelectBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.engine.pause();
                this.renderLevelSelector();
                this.modals.levelSelectModal.show();
            });
        }

        // Codex Button
        const codexBtn = document.getElementById('codexBtn');
        if (codexBtn) {
            codexBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.engine.pause();
                this.renderCodex();
                this.modals.codexModal.show();
            });
        }

        // Achievements Button
        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.engine.pause();
                this.renderAchievementsModal();
                this.modals.achievementsModal.show();
            });
        }

        // Briefing "Start Defense" Button
        const startDefenseBtn = document.getElementById('startDefenseBtn');
        if (startDefenseBtn) {
            startDefenseBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.modals.briefingModal.hide();
                this.startDefensePhase();
            });
        }

        // Start Next Wave Button
        const startWaveBtn = document.getElementById('startWaveBtn');
        if (startWaveBtn) {
            startWaveBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.engine.startNextWave();
                startWaveBtn.disabled = true;
            });
        }

        // Super Strike Button
        const superStrikeBtn = document.getElementById('superStrikeBtn');
        if (superStrikeBtn) {
            superStrikeBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.triggerSuperStrikeQuiz();
            });
        }

        // Results Modal: Restart Level
        const restartLevelBtn = document.getElementById('restartLevelBtn');
        if (restartLevelBtn) {
            restartLevelBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.modals.resultsModal.hide();
                this.loadLevel(this.currentLevelIndex);
            });
        }

        // Results Modal: Next Level
        const nextLevelBtn = document.getElementById('nextLevelBtn');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.modals.resultsModal.hide();
                this.loadLevel((this.currentLevelIndex + 1) % GAME_LEVELS.length);
            });
        }

        // Turret selection modal options
        document.querySelectorAll('.turret-option-card').forEach(card => {
            card.addEventListener('click', () => {
                const turretType = card.getAttribute('data-turret-type');
                window.soundManager.playClick();
                this.modals.turretSelectModal.hide();
                this.launchQuizForBuild(turretType);
            });
        });

        // Inspector: Upgrade button
        const inspectorUpgradeBtn = document.getElementById('inspectorUpgradeBtn');
        if (inspectorUpgradeBtn) {
            inspectorUpgradeBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                const slot = this.inspectedSlot;
                this.modals.turretInspectorModal.hide();
                if (slot && slot.turret) {
                    if (slot.turret.level >= 3) {
                        this.showToast('⭐️ Турель уже максимального 3-го уровня!', 'info');
                        this.engine.resume();
                        return;
                    }
                    this.launchQuizForUpgrade(slot);
                }
            });
        }

        // Inspector: Dismantle button
        const inspectorDismantleBtn = document.getElementById('inspectorDismantleBtn');
        if (inspectorDismantleBtn) {
            inspectorDismantleBtn.addEventListener('click', () => {
                const slot = this.inspectedSlot;
                this.modals.turretInspectorModal.hide();
                if (slot && slot.turret) {
                    this.engine.dismantleTurret(slot.id);
                    this.showToast('🗑️ Турель демонтирована. Слот свободен!', 'info');
                }
                this.engine.resume();
            });
        }

        // Inspector: Targeting Priority Buttons
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = btn.getAttribute('data-priority');
                document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (this.inspectedSlot && this.inspectedSlot.turret) {
                    this.engine.setTurretPriority(this.inspectedSlot.id, p);
                    this.showToast(`🎯 Приоритет цели изменен: [${btn.textContent}]`, 'info');
                }
            });
        });

        // Teacher Mode Button
        const teacherBtn = document.getElementById('teacherModeBtn');
        if (teacherBtn) {
            teacherBtn.addEventListener('click', () => {
                window.soundManager.playClick();
                this.engine.pause();
                this.openTeacherModal();
                this.modals.teacherModal.show();
            });
        }

        // Teacher Form: Add Question
        const addQForm = document.getElementById('addQuestionForm');
        if (addQForm) {
            addQForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTeacherAddQuestion();
            });
        }

        // Teacher Form: Create Level
        const createLvlForm = document.getElementById('createLevelForm');
        if (createLvlForm) {
            createLvlForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTeacherCreateLevel();
            });
        }

        // Teacher: Export JSON
        const exportBtn = document.getElementById('teacherExportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const jsonArea = document.getElementById('teacherJsonArea');
                jsonArea.value = JSON.stringify(GAME_LEVELS, null, 2);
                this.showToast('📋 База заданий экспортирована в JSON!', 'success');
            });
        }

        // Teacher: Import JSON
        const importBtn = document.getElementById('teacherImportBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.handleTeacherImportJSON();
            });
        }

        // Teacher: Reset
        const resetBtn = document.getElementById('teacherResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Сбросить все созданные темы и вернуть 8 стандартных школьных предметов?')) {
                    localStorage.removeItem('qtd_teacher_custom_levels');
                    reloadGameLevels();
                    this.loadLevel(0);
                    this.openTeacherModal();
                    this.showToast('🔄 Все предметы сброшены к 8 стандартным!', 'info');
                }
            });
        }

        // Safe resume when modals are closed
        ['playerLoginModal', 'turretSelectModal', 'turretInspectorModal', 'levelSelectModal', 'codexModal', 'achievementsModal', 'teacherModal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('hidden.bs.modal', () => {
                    if (this.currentPhase === 'DEFENSE' && !this.currentQuizContext) {
                        this.engine.resume();
                    }
                });
            }
        });
    }

    bindEngineCallbacks() {
        this.engine.onSlotClick = (slot) => {
            if (this.currentPhase !== 'DEFENSE') return;

            if (slot.cooldownTimer > 0) {
                window.soundManager.playWrong();
                this.showToast(`⚠️ Слот заблокирован еще на ${slot.cooldownTimer.toFixed(1)} сек!`, 'warning');
                return;
            }

            if (slot.turret) {
                // Open Inspector Panel
                this.inspectedSlot = slot;
                this.engine.pause();
                this.populateInspectorPanel(slot);
                this.modals.turretInspectorModal.show();
            } else {
                // Open Build Menu
                this.targetSlotForBuild = slot;
                this.engine.pause();
                this.modals.turretSelectModal.show();
            }
        };

        this.engine.onBossHalfway = () => {
            this.superStrikeAvailable = true;
            const btn = document.getElementById('superStrikeBtn');
            if (btn) {
                btn.classList.remove('d-none');
                btn.classList.add('pulse-glow');
            }
            this.showToast('🚨 ВНИМАНИЕ! ДОСТУПЕН СУПЕР-УДАР ПО БОССУ!', 'danger');
        };

        this.engine.onWaveCompleted = (waveNum, total) => {
            this.superStrikeAvailable = false;
            const superBtn = document.getElementById('superStrikeBtn');
            if (superBtn) superBtn.classList.add('d-none');

            this.showToast(`✅ Волна ${waveNum} из ${total} успешно отражена!`, 'success');
            const waveBtn = document.getElementById('startWaveBtn');
            if (waveBtn) {
                waveBtn.disabled = false;
                const nextNum = waveNum + 1;
                waveBtn.innerHTML = nextNum === total ? `🔥 Начать волну ${nextNum} (БОСС)` : `🚀 Начать волну ${nextNum}`;
            }
        };

        this.engine.onLevelCompleted = (score, enemiesKilled, baseHp) => {
            this.superStrikeAvailable = false;
            const superBtn = document.getElementById('superStrikeBtn');
            if (superBtn) superBtn.classList.add('d-none');

            // Flawless Achievement check
            if (baseHp === 100) {
                this.unlockAchievement('ach_flawless');
            }

            // Check if all levels completed
            this.saveLevelProgress(this.currentLevelIndex, score);
            this.checkAllLevelsCompleted();

            this.showResults(true, score, enemiesKilled, baseHp);
        };

        this.engine.onGameOver = (score, enemiesKilled, baseHp) => {
            this.superStrikeAvailable = false;
            const superBtn = document.getElementById('superStrikeBtn');
            if (superBtn) superBtn.classList.add('d-none');
            this.showResults(false, score, enemiesKilled, baseHp);
        };

        this.engine.onBaseDamaged = (hp, maxHp) => {
            this.updateBaseHpUI(hp, maxHp);
        };

        this.engine.onStatsUpdated = (stats) => {
            this.updateStatsUI(stats);
            if (!this.engine.activeBoss && this.superStrikeAvailable) {
                this.superStrikeAvailable = false;
                const superBtn = document.getElementById('superStrikeBtn');
                if (superBtn) superBtn.classList.add('d-none');
            }
        };
    }

    updateAudioButtonsUI() {
        const sfxBtn = document.getElementById('muteToggleBtn');
        if (sfxBtn) {
            sfxBtn.innerHTML = window.soundManager.isMuted ? '🔇' : '🔊';
            sfxBtn.className = window.soundManager.isMuted ? 'btn btn-outline-secondary btn-sm' : 'btn btn-outline-info btn-sm';
        }

        const musicBtn = document.getElementById('musicToggleBtn');
        if (musicBtn) {
            musicBtn.innerHTML = window.soundManager.isMusicMuted ? '🔇 Муз' : '🎵 Муз';
            musicBtn.className = window.soundManager.isMusicMuted ? 'btn btn-outline-secondary btn-sm' : 'btn btn-outline-primary btn-sm';
        }
    }

    // --- PHASE 1: BRIEFING ---
    loadLevel(index, showBriefing = true) {
        this.currentLevelIndex = index;
        const level = getLevelConfig(index);

        this.currentPhase = 'BRIEFING';
        this.studiedCards.clear();
        this.askedQuestionIds = new Set();
        this.wrongAnswers = [];
        this.totalQuestionsAsked = 0;
        this.correctAnswersCount = 0;
        this.currentStreak = 0;
        this.superStrikeAvailable = false;

        const superBtn = document.getElementById('superStrikeBtn');
        if (superBtn) superBtn.classList.add('d-none');

        const waveBtn = document.getElementById('startWaveBtn');
        if (waveBtn) {
            waveBtn.disabled = false;
            waveBtn.innerHTML = '🚀 Начать волну 1';
        }

        document.getElementById('hudLevelTitle').textContent = level.title;

        this.engine.loadLevel(level);
        this.updateBaseHpUI(100, 100);

        if (showBriefing) {
            this.openBriefingModal(level);
        }
    }

    openBriefingModal(level) {
        document.getElementById('briefingTitle').textContent = level.title;
        document.getElementById('briefingDesc').textContent = level.description;

        const cardsContainer = document.getElementById('briefingCardsContainer');
        cardsContainer.innerHTML = '';

        level.briefing.forEach((card) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'col-md-6 mb-3';
            cardEl.innerHTML = `
                <div class="card briefing-card h-100 p-3" id="briefingCard_${card.id}" data-card-id="${card.id}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary text-uppercase">${card.turretName}</span>
                        <span class="study-badge text-warning small font-monospace">Не изучено</span>
                    </div>
                    <h5 class="card-title text-light">${card.title}</h5>
                    <p class="card-text text-secondary small flex-grow-1">${card.content}</p>
                    <div class="code-box p-2 mb-3 font-monospace small text-info">${card.formula}</div>
                    <button class="btn btn-outline-primary btn-sm w-100 study-btn">
                        📖 Изучить чертеж
                    </button>
                </div>
            `;

            const btn = cardEl.querySelector('.study-btn');
            btn.addEventListener('click', () => {
                this.studyCard(card.id, cardEl.querySelector('.briefing-card'));
            });

            cardsContainer.appendChild(cardEl);
        });

        const startBtn = document.getElementById('startDefenseBtn');
        startBtn.disabled = true;
        startBtn.innerHTML = '🔒 Изучите все чертежи для старта (0/' + level.briefing.length + ')';
        startBtn.classList.remove('pulse-glow');

        this.modals.briefingModal.show();
    }

    studyCard(cardId, cardElement) {
        if (this.studiedCards.has(cardId)) return;

        this.studiedCards.add(cardId);
        window.soundManager.playCardStudy();

        cardElement.classList.add('card-studied');
        const badge = cardElement.querySelector('.study-badge');
        badge.className = 'study-badge text-success small font-monospace fw-bold';
        badge.innerHTML = 'Изучено ✓';

        const btn = cardElement.querySelector('.study-btn');
        btn.disabled = true;
        btn.className = 'btn btn-success btn-sm w-100';
        btn.innerHTML = '✓ Чертёж разблокирован';

        const total = getLevelConfig(this.currentLevelIndex).briefing.length;
        const startBtn = document.getElementById('startDefenseBtn');

        if (this.studiedCards.size >= total) {
            startBtn.disabled = false;
            startBtn.innerHTML = '⚔️ Начать оборону!';
            startBtn.classList.add('pulse-glow');
            if (window.soundManager) window.soundManager.playUpgrade();
        } else {
            startBtn.innerHTML = `🔒 Изучите все чертежи (${this.studiedCards.size}/${total})`;
        }
    }

    // --- PHASE 2 & 3: DEFENSE & ACTIVE RECALL QUIZ ---
    startDefensePhase() {
        this.currentPhase = 'DEFENSE';
        this.engine.start();
        this.showToast('🛡️ Оборона началась! Кликайте по слотам (+) для постройки турелей.', 'info');
    }

    populateInspectorPanel(slot) {
        const t = slot.turret;
        document.getElementById('inspectorTurretTitle').textContent = t.name;
        document.getElementById('inspectorTurretLevelBadge').textContent = `Уровень ${t.level} / 3`;
        document.getElementById('inspectorDmg').textContent = t.damage;
        document.getElementById('inspectorRate').textContent = `${t.fireRate}/с`;
        document.getElementById('inspectorRange').textContent = `${t.range}px`;
        document.getElementById('inspectorKills').textContent = t.totalKills || 0;
        document.getElementById('inspectorTotalDmg').textContent = t.totalDamage || 0;

        // Upgrade button state
        const upBtn = document.getElementById('inspectorUpgradeBtn');
        if (t.level >= 3) {
            upBtn.disabled = true;
            upBtn.innerHTML = '⭐️ Макс. Уровень 3';
        } else {
            upBtn.disabled = false;
            upBtn.innerHTML = `⭐️ Улучшить до Ур. ${t.level + 1} (+55% урон)`;
        }

        // Active priority button
        const curPriority = t.targetPriority || 'first';
        document.querySelectorAll('.priority-btn').forEach(btn => {
            if (btn.getAttribute('data-priority') === curPriority) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    launchQuizForBuild(turretType) {
        const slot = this.targetSlotForBuild;
        if (!slot) return;

        let difficulty = 'easy';
        if (turretType === 'cryo') difficulty = 'medium';
        if (turretType === 'artillery') difficulty = 'hard';

        const question = this.getQuestionForDifficulty(difficulty, turretType);
        if (!question) {
            this.showToast('Вопрос не найден!', 'danger');
            return;
        }

        this.currentQuizContext = {
            slot: slot,
            turretType: turretType,
            isUpgrade: false,
            question: question
        };

        this.openQuizModal(question, `Строительство: ${this.getTurretTypeName(turretType)}`);
    }

    launchQuizForUpgrade(slot) {
        const currentLevel = slot.turret.level;
        const nextLevel = currentLevel + 1;
        const difficulty = currentLevel === 1 ? 'medium' : 'hard';

        const question = this.getQuestionForDifficulty(difficulty, slot.turret.type);
        if (!question) return;

        this.currentQuizContext = {
            slot: slot,
            turretType: slot.turret.type,
            isUpgrade: true,
            question: question
        };

        this.openQuizModal(question, `Модернизация до Уровня ${nextLevel}`);
    }

    triggerSuperStrikeQuiz() {
        if (!this.superStrikeAvailable || !this.engine.activeBoss) return;

        const question = this.getQuestionForDifficulty('hard', 'super');
        if (!question) return;

        this.currentQuizContext = {
            isSuperStrike: true,
            question: question
        };

        this.openQuizModal(question, '⚡ СУПЕР-УДАР: Активация орбитального луча');
    }

    getQuestionForDifficulty(difficulty, turretType) {
        const level = getLevelConfig(this.currentLevelIndex);
        if (!this.askedQuestionIds) {
            this.askedQuestionIds = new Set();
        }

        let pool = level.questions.filter(q => q.turretType === turretType);
        if (pool.length === 0) {
            pool = level.questions.filter(q => q.difficulty === difficulty);
        }
        if (pool.length === 0) {
            pool = level.questions;
        }

        const unasked = pool.filter(q => !this.askedQuestionIds.has(q.id));
        const finalPool = unasked.length > 0 ? unasked : pool;

        const chosen = finalPool[Math.floor(Math.random() * finalPool.length)];
        this.askedQuestionIds.add(chosen.id);

        if (this.askedQuestionIds.size >= level.questions.length) {
            this.askedQuestionIds.clear();
        }

        return chosen;
    }

    getTurretTypeName(type) {
        if (type === 'plasma') return 'Быстрая плазма';
        if (type === 'cryo') return 'Крио-башня';
        if (type === 'artillery') return 'Тяжелая мортира';
        return 'Оборонительная турель';
    }

    openQuizModal(q, titleText) {
        this.engine.pause();

        document.getElementById('quizModalTitle').textContent = titleText;
        document.getElementById('quizDifficultyBadge').textContent =
            q.difficulty === 'easy' ? 'Легкий вопрос' : (q.difficulty === 'medium' ? 'Средний вопрос' : 'Сложный вопрос');
        document.getElementById('quizDifficultyBadge').className =
            `badge ${q.difficulty === 'easy' ? 'bg-info' : (q.difficulty === 'medium' ? 'bg-primary' : 'bg-warning text-dark')}`;

        document.getElementById('quizQuestionText').textContent = q.question;

        const answersContainer = document.getElementById('quizAnswersContainer');
        answersContainer.innerHTML = '';

        q.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-light text-start p-3 mb-2 w-100 quiz-option-btn';
            btn.innerHTML = `
                <span class="badge bg-secondary me-2 font-monospace">${String.fromCharCode(65 + idx)}</span>
                ${optText}
            `;
            btn.addEventListener('click', () => {
                this.handleQuizAnswer(idx, btn, q);
            });
            answersContainer.appendChild(btn);
        });

        this.startQuizTimer(q);
        this.modals.quizModal.show();
    }

    startQuizTimer(question) {
        if (this.activeQuizTimer) {
            clearInterval(this.activeQuizTimer);
        }

        this.quizTimeRemaining = 15.0;
        const timerBar = document.getElementById('quizTimerBar');
        const timerText = document.getElementById('quizTimerText');

        timerBar.style.width = '100%';
        timerBar.className = 'progress-bar bg-info';
        timerText.textContent = '15.0s';

        const stepMs = 100;
        this.activeQuizTimer = setInterval(() => {
            this.quizTimeRemaining -= stepMs / 1000;
            const pct = Math.max(0, (this.quizTimeRemaining / 15.0) * 100);
            timerBar.style.width = pct + '%';
            timerText.textContent = Math.max(0, this.quizTimeRemaining).toFixed(1) + 's';

            if (pct < 35) {
                timerBar.className = 'progress-bar bg-danger';
            } else if (pct < 60) {
                timerBar.className = 'progress-bar bg-warning';
            }

            if (this.quizTimeRemaining <= 0) {
                clearInterval(this.activeQuizTimer);
                this.handleQuizTimeout(question);
            }
        }, stepMs);
    }

    handleQuizAnswer(selectedIndex, clickedBtn, question) {
        if (this.activeQuizTimer) {
            clearInterval(this.activeQuizTimer);
            this.activeQuizTimer = null;
        }

        this.totalQuestionsAsked++;
        const isCorrect = (selectedIndex === question.correctIndex);
        const allOptionBtns = document.querySelectorAll('.quiz-option-btn');
        allOptionBtns.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            clickedBtn.classList.remove('btn-outline-light');
            clickedBtn.classList.add('btn-success');
            window.soundManager.playCorrect();
            this.correctAnswersCount++;
            this.currentStreak++;

            if (this.currentStreak >= 5) {
                this.unlockAchievement('ach_streak_5');
            }

            setTimeout(() => {
                this.modals.quizModal.hide();
                this.engine.resume();
                this.applyQuizSuccess();
            }, 600);
        } else {
            clickedBtn.classList.remove('btn-outline-light');
            clickedBtn.classList.add('btn-danger');

            if (allOptionBtns[question.correctIndex]) {
                allOptionBtns[question.correctIndex].classList.remove('btn-outline-light');
                allOptionBtns[question.correctIndex].classList.add('btn-success');
            }

            window.soundManager.playWrong();
            this.currentStreak = 0;
            this.recordMistake(question, question.options[selectedIndex]);

            setTimeout(() => {
                this.modals.quizModal.hide();
                this.engine.resume();
                this.applyQuizFailure();
            }, 1200);
        }
    }

    handleQuizTimeout(question) {
        this.totalQuestionsAsked++;
        this.currentStreak = 0;
        const allOptionBtns = document.querySelectorAll('.quiz-option-btn');
        allOptionBtns.forEach(btn => btn.disabled = true);

        if (allOptionBtns[question.correctIndex]) {
            allOptionBtns[question.correctIndex].classList.remove('btn-outline-light');
            allOptionBtns[question.correctIndex].classList.add('btn-success');
        }

        window.soundManager.playWrong();
        this.recordMistake(question, "⏱ Время истекло (15 секунд)");

        setTimeout(() => {
            this.modals.quizModal.hide();
            this.engine.resume();
            this.applyQuizFailure();
        }, 1200);
    }

    applyQuizSuccess() {
        const ctx = this.currentQuizContext;
        this.currentQuizContext = null;
        if (!ctx) return;

        if (ctx.isSuperStrike) {
            this.engine.executeSuperStrike();
            const btn = document.getElementById('superStrikeBtn');
            if (btn) btn.classList.add('d-none');
            this.unlockAchievement('ach_super_strike');
            this.showToast('💥 СУПЕР-УДАР НАНЕС 50% УРОНА БОССУ!', 'success');
        } else if (ctx.isUpgrade) {
            this.engine.upgradeTurret(ctx.slot.id);
            if (ctx.slot.turret && ctx.slot.turret.level === 3) {
                this.unlockAchievement('ach_max_upgrade');
            }
            this.showToast('⭐️ Турель успешно модернизирована!', 'success');
        } else {
            this.engine.buildTurret(ctx.slot.id, ctx.turretType);
            this.unlockAchievement('ach_first_turret');
            this.showToast('🛡 Турель успешно развернута на позиции!', 'success');
        }
    }

    applyQuizFailure() {
        const ctx = this.currentQuizContext;
        this.currentQuizContext = null;
        if (!ctx) return;

        if (ctx.isSuperStrike) {
            const btn = document.getElementById('superStrikeBtn');
            if (btn) btn.classList.add('d-none');
            this.showToast('❌ Ошибка в расчетах! Супер-удар заблокирован.', 'danger');
        } else {
            this.engine.lockSlotCooldown(ctx.slot.id, 5);
            this.showToast('⛔ Ошибка! Слот уходит на перезагрузку (5 сек).', 'danger');
        }
    }

    recordMistake(question, playerAnswer) {
        const level = getLevelConfig(this.currentLevelIndex);
        const card = level.briefing.find(c => c.id === question.cardId) || level.briefing[0];

        this.wrongAnswers.push({
            question: question.question,
            playerAnswer: playerAnswer,
            correctAnswer: question.options[question.correctIndex],
            explanation: question.explanation,
            cardTitle: card.title,
            cardContent: card.content,
            cardFormula: card.formula
        });
    }

    // --- ACHIEVEMENTS SYSTEM ---
    unlockAchievement(achId) {
        const key = `qtd_ach_${achId}`;
        if (localStorage.getItem(key) === 'true') return;

        localStorage.setItem(key, 'true');
        const ach = this.achievements.find(a => a.id === achId);
        if (ach) {
            window.soundManager.playAchievement();
            this.showToast(`🏆 <strong>ДОСТИЖЕНИЕ!</strong><br>${ach.icon} ${ach.title}: ${ach.desc}`, 'warning');
        }
    }

    checkAllLevelsCompleted() {
        let allCompleted = true;
        for (let i = 0; i < GAME_LEVELS.length; i++) {
            if (localStorage.getItem(`qtd_level_${i}_completed`) !== 'true') {
                allCompleted = false;
                break;
            }
        }
        if (allCompleted) {
            this.unlockAchievement('ach_all_levels');
        }
    }

    renderAchievementsModal() {
        const container = document.getElementById('achievementsListContainer');
        container.innerHTML = '';

        this.achievements.forEach(ach => {
            const isUnlocked = localStorage.getItem(`qtd_ach_${ach.id}`) === 'true';
            const card = document.createElement('div');
            card.className = `card mb-2 p-3 ${isUnlocked ? 'border-warning' : 'border-secondary-subtle opacity-75'}`;
            card.style.backgroundColor = isUnlocked ? 'rgba(245, 158, 11, 0.08)' : '#0d131f';
            card.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="fs-2 me-3">${ach.icon}</span>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-1 text-light fw-bold">${ach.title}</h6>
                            ${isUnlocked ? '<span class="badge bg-warning text-dark">Получено ✓</span>' : '<span class="badge bg-secondary">Заблокировано</span>'}
                        </div>
                        <small class="text-secondary">${ach.desc}</small>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // --- CODEX / KNOWLEDGE BASE ---
    renderCodex() {
        const container = document.getElementById('codexContentContainer');
        container.innerHTML = '';

        GAME_LEVELS.forEach((lvl, lvlIdx) => {
            const section = document.createElement('div');
            section.className = 'mb-4';
            section.innerHTML = `
                <h5 class="text-info border-bottom border-info-subtle pb-2 mb-3">
                    ${lvl.title}
                </h5>
                <div class="row g-3">
                    ${lvl.briefing.map(c => `
                        <div class="col-md-6">
                            <div class="card p-3 h-100 bg-dark border-secondary-subtle">
                                <span class="badge bg-primary text-uppercase mb-2 align-self-start">${c.turretName}</span>
                                <h6 class="text-light">${c.title}</h6>
                                <p class="text-secondary small flex-grow-1 mb-2">${c.content}</p>
                                <div class="code-box p-2 font-monospace small text-info">${c.formula}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        });
    }

    // --- TEACHER CONSTRUCTOR & CUSTOM ASSIGNMENTS ---
    openTeacherModal() {
        const select = document.getElementById('teacherQLevelSelect');
        if (select) {
            select.innerHTML = '';
            GAME_LEVELS.forEach((lvl) => {
                const opt = document.createElement('option');
                opt.value = lvl.id;
                opt.textContent = lvl.title;
                select.appendChild(opt);
            });
        }
        const jsonArea = document.getElementById('teacherJsonArea');
        if (jsonArea) {
            jsonArea.value = JSON.stringify(GAME_LEVELS, null, 2);
        }
    }

    handleTeacherAddQuestion() {
        const levelId = document.getElementById('teacherQLevelSelect').value;
        const difficulty = document.getElementById('teacherQDifficulty').value;
        const text = document.getElementById('teacherQText').value.trim();
        const opt0 = document.getElementById('teacherQOpt0').value.trim();
        const opt1 = document.getElementById('teacherQOpt1').value.trim();
        const opt2 = document.getElementById('teacherQOpt2').value.trim();
        const opt3 = document.getElementById('teacherQOpt3').value.trim();
        const correctIndex = parseInt(document.getElementById('teacherQCorrect').value, 10);
        const explanation = document.getElementById('teacherQExplanation').value.trim() || 'Правильный ответ подтвержден учителем.';

        if (!text || !opt0 || !opt1 || !opt2 || !opt3) {
            this.showToast('⚠️ Заполните все поля вопроса и вариантов ответа!', 'danger');
            return;
        }

        const targetLvl = GAME_LEVELS.find(l => l.id === levelId);
        if (!targetLvl) return;

        let turretType = 'plasma';
        if (difficulty === 'medium') turretType = 'cryo';
        if (difficulty === 'hard') turretType = 'artillery';

        const newQuestion = {
            id: 'tq_' + Math.random().toString(36).substr(2, 9),
            difficulty: difficulty,
            cardId: targetLvl.briefing[0].id,
            turretType: turretType,
            question: text,
            options: [opt0, opt1, opt2, opt3],
            correctIndex: correctIndex,
            explanation: explanation
        };

        targetLvl.questions.push(newQuestion);

        try {
            const customStored = localStorage.getItem('qtd_teacher_custom_levels');
            let customList = customStored ? JSON.parse(customStored) : [];
            const existingCustom = customList.find(l => l.id === targetLvl.id);
            if (existingCustom) {
                existingCustom.questions = targetLvl.questions;
            } else {
                customList.push(targetLvl);
            }
            localStorage.setItem('qtd_teacher_custom_levels', JSON.stringify(customList));
        } catch (e) {
            console.warn('Teacher save error:', e);
        }

        this.showToast('✅ Вопрос успешно добавлен в базу урока!', 'success');
        document.getElementById('teacherQText').value = '';
        document.getElementById('teacherQOpt0').value = '';
        document.getElementById('teacherQOpt1').value = '';
        document.getElementById('teacherQOpt2').value = '';
        document.getElementById('teacherQOpt3').value = '';
        document.getElementById('teacherQExplanation').value = '';
    }

    handleTeacherCreateLevel() {
        const title = document.getElementById('teacherLvlTitle').value.trim();
        const desc = document.getElementById('teacherLvlDesc').value.trim();

        if (!title || !desc) {
            this.showToast('⚠️ Введите название и описание предмета!', 'danger');
            return;
        }

        const newLvlId = 'lvl_custom_' + Date.now();
        const newLevel = {
            id: newLvlId,
            title: title,
            description: desc,
            mapTheme: 'arcade-cyan',
            isCustom: true,
            path: [
                { x: 30, y: 150 },
                { x: 260, y: 150 },
                { x: 260, y: 380 },
                { x: 520, y: 380 },
                { x: 520, y: 180 },
                { x: 760, y: 180 },
                { x: 760, y: 440 },
                { x: 970, y: 440 }
            ],
            slots: [
                { id: "c-1", x: 140, y: 80 },
                { id: "c-2", x: 140, y: 230 },
                { id: "c-3", x: 380, y: 300 },
                { id: "c-4", x: 380, y: 460 },
                { id: "c-5", x: 640, y: 110 },
                { id: "c-6", x: 640, y: 260 },
                { id: "c-7", x: 880, y: 360 },
                { id: "c-8", x: 880, y: 510 }
            ],
            briefing: [
                {
                    id: newLvlId + '_b1',
                    turretType: "plasma",
                    turretName: "Быстрая башня",
                    title: "1. Основы темы: Правило №1",
                    content: "Базовые понятия и определения темы. Внимательно читайте условие задания.",
                    formula: "Главное правило: Теория проверяется практикой!"
                },
                {
                    id: newLvlId + '_b2',
                    turretType: "cryo",
                    turretName: "Крио-башня",
                    title: "2. Углубленный анализ: Правило №2",
                    content: "Замедление и контроль ошибок при вычислении или разборе задачи.",
                    formula: "Контроль решения: Проверка обратным действием."
                },
                {
                    id: newLvlId + '_b3',
                    turretType: "artillery",
                    turretName: "Тяжелая мортира",
                    title: "3. Комплексные задачи: Правило №3",
                    content: "Решение составных задач повышенной сложности в несколько действий.",
                    formula: "Алгоритм: Декомпозиция сложной задачи на простые подзадачи."
                },
                {
                    id: newLvlId + '_b4',
                    turretType: "super",
                    turretName: "Протокол «Супер-удар»",
                    title: "4. Финальный срез знаний: Правило №4",
                    content: "Обобщение темы и финальный тест против Босса ошибок.",
                    formula: "Успех = Внимательность + Знание формул и определений."
                }
            ],
            waves: [
                {
                    waveNumber: 1,
                    name: "Разминка: Простые задания",
                    spawnInterval: 1400,
                    enemies: [
                        { type: "scout", count: 8, hp: 60, speed: 1.45, rewardScore: 50, color: "#fde047", name: "Простая ошибка" }
                    ]
                },
                {
                    waveNumber: 2,
                    name: "Средняя сложность: Практика",
                    spawnInterval: 1200,
                    enemies: [
                        { type: "scout", count: 6, hp: 70, speed: 1.5, rewardScore: 60, color: "#fde047", name: "Недочет" },
                        { type: "trooper", count: 8, hp: 130, speed: 1.05, rewardScore: 100, color: "#fb923c", name: "Сложное задание" }
                    ]
                },
                {
                    waveNumber: 3,
                    name: "Контрольная работа: Босс темы",
                    spawnInterval: 1100,
                    enemies: [
                        { type: "trooper", count: 8, hp: 150, speed: 1.1, rewardScore: 110, color: "#fb923c", name: "Олимпиадный вопрос" },
                        { type: "tank", count: 4, hp: 280, speed: 0.75, rewardScore: 180, color: "#f43f5e", name: "Комплексная задача" },
                        { type: "boss", count: 1, hp: 1200, speed: 0.52, rewardScore: 700, color: "#a855f7", isBoss: true, name: "Босс: Контрольная работа" }
                    ]
                }
            ],
            questions: [
                {
                    id: 'q_' + Math.random().toString(36).substr(2, 9),
                    difficulty: "easy",
                    cardId: newLvlId + '_b1',
                    turretType: "plasma",
                    question: "Контрольный вопрос 1 по теме: " + title,
                    options: ["Верный ответ 1", "Неверный вариант", "Еще вариант", "Другой вариант"],
                    correctIndex: 0,
                    explanation: "Это контрольный вопрос, добавленный учителем."
                },
                {
                    id: 'q_' + Math.random().toString(36).substr(2, 9),
                    difficulty: "medium",
                    cardId: newLvlId + '_b2',
                    turretType: "cryo",
                    question: "Контрольный вопрос 2 по теме: " + title,
                    options: ["Верный ответ 2", "Неверно", "Ошибочно", "Мимо"],
                    correctIndex: 0,
                    explanation: "Объяснение учителя по теме."
                },
                {
                    id: 'q_' + Math.random().toString(36).substr(2, 9),
                    difficulty: "hard",
                    cardId: newLvlId + '_b3',
                    turretType: "artillery",
                    question: "Сложный вопрос для мортиры по теме: " + title,
                    options: ["Правильный ответ", "Ложный ответ", "Искажение", "Неверно"],
                    correctIndex: 0,
                    explanation: "Учительское пояснение для закрепления."
                },
                {
                    id: 'q_' + Math.random().toString(36).substr(2, 9),
                    difficulty: "hard",
                    cardId: newLvlId + '_b4',
                    turretType: "super",
                    question: "Финальный вопрос Супер-удара по теме: " + title,
                    options: ["Главный правильный ответ", "Неверно 1", "Неверно 2", "Неверно 3"],
                    correctIndex: 0,
                    explanation: "Ответ на супер-вопрос наносит 50% урона Боссу!"
                }
            ]
        };

        saveTeacherLevel(newLevel);
        this.modals.teacherModal.hide();
        this.loadLevel(GAME_LEVELS.length - 1);
        this.showToast(`🎉 Новая тема «${title}» создана и загружена!`, 'success');
        document.getElementById('teacherLvlTitle').value = '';
        document.getElementById('teacherLvlDesc').value = '';
    }

    handleTeacherImportJSON() {
        const text = document.getElementById('teacherJsonArea').value.trim();
        if (!text) {
            this.showToast('⚠️ Вставьте JSON в текстовое поле!', 'danger');
            return;
        }

        try {
            const parsed = JSON.parse(text);
            if (!Array.isArray(parsed)) {
                throw new Error('JSON должен быть массивом уровней');
            }

            localStorage.setItem('qtd_teacher_custom_levels', JSON.stringify(parsed));
            reloadGameLevels();
            this.loadLevel(0);
            this.openTeacherModal();
            this.showToast('✅ База тем успешно импортирована!', 'success');
        } catch (e) {
            this.showToast('❌ Ошибка парсинга JSON: ' + e.message, 'danger');
        }
    }

    // --- PHASE 4: RESULTS & MISTAKE REVIEW ("ЧЁРНЫЙ ЯЩИК") ---
    showResults(isVictory, score, enemiesKilled, baseHp) {
        this.currentPhase = 'RESULTS';
        const header = document.getElementById('resultsHeader');
        const badge = document.getElementById('resultsBadge');

        if (isVictory) {
            header.textContent = '🎉 МИССИЯ ВЫПОЛНЕНА! СИСТЕМА ЗАЩИЩЕНА!';
            header.className = 'text-success';
            badge.className = 'badge bg-success fs-6';
            badge.textContent = 'ПОБЕДА';
            this.saveLevelProgress(this.currentLevelIndex, score);
        } else {
            header.textContent = '💥 СИСТЕМА ВЗЛОМАНА! БАЗА УНИЧТОЖЕНА!';
            header.className = 'text-danger';
            badge.className = 'badge bg-danger fs-6';
            badge.textContent = 'ПОРАЖЕНИЕ';
        }

        document.getElementById('resScore').textContent = score;
        document.getElementById('resKills').textContent = enemiesKilled;
        document.getElementById('resBaseHp').textContent = `${baseHp}%`;

        const accuracy = this.totalQuestionsAsked > 0
            ? Math.round((this.correctAnswersCount / this.totalQuestionsAsked) * 100)
            : 100;
        document.getElementById('resAccuracy').textContent = `${accuracy}% (${this.correctAnswersCount}/${this.totalQuestionsAsked})`;

        const reviewContainer = document.getElementById('mistakesReviewContainer');
        reviewContainer.innerHTML = '';

        if (this.wrongAnswers.length === 0) {
            reviewContainer.innerHTML = `
                <div class="alert alert-success d-flex align-items-center">
                    <span class="fs-3 me-3">🏆</span>
                    <div>
                        <h6 class="mb-1 text-success fw-bold">ИДЕАЛЬНЫЙ РЕЗУЛЬТАТ: 0 ОШИБОК!</h6>
                        <small>Вы ответили на все вопросы без единого сбоя. Весь теоретический материал уровня усвоен на высшем уровне!</small>
                    </div>
                </div>
            `;
        } else {
            const titleEl = document.createElement('h5');
            titleEl.className = 'text-warning mb-3 d-flex align-items-center';
            titleEl.innerHTML = `⚠️ Чёрный ящик: Разбор допущенных ошибок (${this.wrongAnswers.length})`;
            reviewContainer.appendChild(titleEl);

            this.wrongAnswers.forEach((m, idx) => {
                const item = document.createElement('div');
                item.className = 'card mistake-card mb-3 p-3';
                item.innerHTML = `
                    <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-danger">Вопрос #${idx + 1}</span>
                        <span class="badge bg-secondary font-monospace">${m.cardTitle}</span>
                    </div>
                    <h6 class="text-light">${m.question}</h6>
                    <div class="mb-2">
                        <span class="text-danger small">❌ Ваш ответ:</span>
                        <div class="font-monospace text-danger small p-1 bg-dark rounded border border-danger-subtle">${m.playerAnswer}</div>
                    </div>
                    <div class="mb-2">
                        <span class="text-success small">✓ Правильный ответ:</span>
                        <div class="font-monospace text-success small p-1 bg-dark rounded border border-success-subtle">${m.correctAnswer}</div>
                    </div>
                    <div class="theory-box p-2 rounded mt-2">
                        <div class="text-info small fw-bold mb-1">💡 Пояснение и теория из Брифинга:</div>
                        <p class="text-light small mb-1">${m.cardContent}</p>
                        <div class="code-box p-1 font-monospace small text-warning">${m.cardFormula}</div>
                        <div class="text-secondary small mt-1"><em>Детали: ${m.explanation}</em></div>
                    </div>
                `;
                reviewContainer.appendChild(item);
            });
        }

        const nextBtn = document.getElementById('nextLevelBtn');
        if (nextBtn) {
            if (isVictory && (this.currentLevelIndex + 1 < GAME_LEVELS.length)) {
                nextBtn.classList.remove('d-none');
            } else {
                nextBtn.classList.add('d-none');
            }
        }

        this.modals.resultsModal.show();
    }

    saveLevelProgress(levelIndex, score) {
        try {
            const key = `qtd_level_${levelIndex}_completed`;
            localStorage.setItem(key, 'true');
            const bestKey = `qtd_level_${levelIndex}_highscore`;
            const currentBest = parseInt(localStorage.getItem(bestKey) || '0', 10);
            if (score > currentBest) {
                localStorage.setItem(bestKey, score.toString());
            }
        } catch (e) {
            console.warn('LocalStorage error:', e);
        }
    }

    renderLevelSelector() {
        const container = document.getElementById('levelListContainer');
        if (!container) return;
        container.innerHTML = '';

        GAME_LEVELS.forEach((lvl, idx) => {
            const isCompleted = localStorage.getItem(`qtd_level_${idx}_completed`) === 'true';
            const highScore = localStorage.getItem(`qtd_level_${idx}_highscore`) || '0';
            const icon = lvl.subjectIcon || '📚';

            const card = document.createElement('div');
            card.className = `card mb-3 p-3 level-select-card ${idx === this.currentLevelIndex ? 'border-warning' : 'border-secondary'}`;
            card.style.backgroundColor = idx === this.currentLevelIndex ? '#172554' : '#0f172a';
            card.innerHTML = `
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <span class="fs-1">${icon}</span>
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <h6 class="mb-0 text-light fw-bold">${lvl.title}</h6>
                                ${lvl.isCustom ? '<span class="badge bg-warning text-dark">Учитель</span>' : ''}
                            </div>
                            <p class="text-secondary small mb-1" style="font-size: 0.8rem;">${lvl.description}</p>
                            <div class="d-flex align-items-center gap-2 small">
                                ${isCompleted ? '<span class="badge bg-success">Пройден ✓</span>' : '<span class="badge bg-secondary">Не пройден</span>'}
                                <span class="text-warning font-monospace">Рекорд: ${highScore} очков</span>
                                <span class="text-info font-monospace">Вопросов: ${lvl.questions ? lvl.questions.length : 0}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-arcade ${idx === this.currentLevelIndex ? 'btn-arcade-green' : 'btn-arcade-cyan'} btn-sm text-nowrap">
                        ${idx === this.currentLevelIndex ? '▶ ВЫБРАТЬ' : 'ВЫБРАТЬ'}
                    </button>
                </div>
            `;

            card.querySelector('button').addEventListener('click', () => {
                window.soundManager.playClick();
                this.modals.levelSelectModal.hide();
                this.loadLevel(idx, true); // Opens Phase 1 Briefing for the selected subject
                this.showToast(`📖 Предмет «${lvl.title}» выбран! Изучите чертежи перед боем.`, 'info');
            });

            container.appendChild(card);
        });
    }

    // --- UI Helpers ---
    updateStatsUI(stats) {
        document.getElementById('hudWave').textContent = `${stats.waveIndex}/${stats.totalWaves}`;
        document.getElementById('hudEnemies').textContent = stats.enemiesRemaining;
        document.getElementById('hudScore').textContent = stats.score;
    }

    updateBaseHpUI(hp, maxHp) {
        const pct = Math.max(0, Math.round((hp / maxHp) * 100));
        const bar = document.getElementById('baseHpBar');
        const text = document.getElementById('baseHpText');

        if (bar) {
            bar.style.width = `${pct}%`;
            if (pct > 50) {
                bar.className = 'progress-bar bg-success';
            } else if (pct > 25) {
                bar.className = 'progress-bar bg-warning';
            } else {
                bar.className = 'progress-bar bg-danger';
            }
        }
        if (text) {
            text.textContent = `${hp} / ${maxHp}`;
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `alert alert-${type} shadow-lg py-2 px-3 mb-2 toast-item`;
        toast.innerHTML = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3400);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});
