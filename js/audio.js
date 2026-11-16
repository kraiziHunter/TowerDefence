/**
 * Audio Synthesizer via Web Audio API
 * Generates all sound effects AND procedural cyberpunk ambient music.
 */
class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('qtd_muted') === 'true';
        this.isMusicMuted = localStorage.getItem('qtd_music_muted') === 'true';
        this.masterVolume = 0.35;
        this.musicVolume = 0.14;
        this._initialized = false;

        // Ambient Music Loop nodes
        this.musicGain = null;
        this.musicInterval = null;
        this.musicStep = 0;
        this.isMusicPlaying = false;
    }

    init() {
        if (this._initialized && this.ctx) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this._initialized = true;

                // Setup Music Master Gain
                this.musicGain = this.ctx.createGain();
                this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
                this.musicGain.connect(this.ctx.destination);
            }
        } catch (e) {
            console.warn('Web Audio API not supported or blocked:', e);
        }
    }

    ensureContext() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.isMusicPlaying && !this.isMusicMuted) {
            this.startAmbientMusic();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('qtd_muted', this.isMuted ? 'true' : 'false');
        return this.isMuted;
    }

    toggleMusic() {
        this.ensureContext();
        this.isMusicMuted = !this.isMusicMuted;
        localStorage.setItem('qtd_music_muted', this.isMusicMuted ? 'true' : 'false');

        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
        }

        if (!this.isMusicMuted) {
            this.startAmbientMusic();
        }
        return this.isMusicMuted;
    }

    getMasterGain() {
        if (this.isMuted || !this.ctx) return null;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        gain.connect(this.ctx.destination);
        return gain;
    }

    // --- Procedural Cyber Ambient Music ---
    startAmbientMusic() {
        if (this.musicInterval || !this.ctx || this.isMusicMuted) return;
        this.isMusicPlaying = true;

        // Pentatonic synth scale in D minor: D3, F3, G3, A3, C4, D4
        const scale = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 392.00];
        const bassNotes = [73.42, 87.31, 98.00, 110.00]; // D2, F2, G2, A2

        const stepTime = 400; // ms per pulse

        this.musicInterval = setInterval(() => {
            if (this.isMusicMuted || !this.ctx || this.ctx.state !== 'running') return;

            const now = this.ctx.currentTime;
            this.musicStep++;

            // 1. Bass Pulse on every 4 steps
            if (this.musicStep % 4 === 1) {
                const bassFreq = bassNotes[Math.floor((this.musicStep / 8) % bassNotes.length)];
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                bassOsc.type = 'sawtooth';
                bassOsc.frequency.setValueAtTime(bassFreq, now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(250, now);

                bassGain.gain.setValueAtTime(0.25, now);
                bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

                bassOsc.connect(filter);
                filter.connect(bassGain);
                bassGain.connect(this.musicGain);

                bassOsc.start(now);
                bassOsc.stop(now + 1.2);
            }

            // 2. Ambient Melody Arp (subtle)
            if (Math.random() > 0.3) {
                const note = scale[Math.floor(Math.random() * scale.length)];
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(note, now);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc.connect(gain);
                gain.connect(this.musicGain);

                osc.start(now);
                osc.stop(now + 0.35);
            }
        }, stepTime);
    }

    stopAmbientMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        this.isMusicPlaying = false;
    }

    // --- Sound Effects ---

    // UI Click
    playClick() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Blueprint / Card study sound
    playCardStudy() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);

            gain.gain.setValueAtTime(0, now + i * 0.06);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.18);
        });
    }

    // Turret Build
    playBuild() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Turret Upgrade
    playUpgrade() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.25, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.2);
        });
    }

    // Turret Sell / Dismantle
    playSell() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Rapid Laser Turret Shot
    playLaser() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.09);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Cryo Turret Shot
    playFreeze() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.linearRampToValueAtTime(450, now + 0.18);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    // Heavy Artillery Launch
    playArtilleryLaunch() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Explosion / AoE blast
    playExplosion() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        noise.start(now);
        noise.stop(now + 0.4);
    }

    // Correct Quiz Answer
    playCorrect() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.3, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.25);
        });
    }

    // Wrong Quiz Answer
    playWrong() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(160, now);
        osc2.frequency.setValueAtTime(152, now);
        osc1.frequency.linearRampToValueAtTime(90, now + 0.35);
        osc2.frequency.linearRampToValueAtTime(85, now + 0.35);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(master);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
    }

    // Boss Warning Siren
    playWarning() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        for (let i = 0; i < 2; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            const start = now + i * 0.25;
            osc.frequency.setValueAtTime(440, start);
            osc.frequency.linearRampToValueAtTime(880, start + 0.2);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

            osc.connect(gain);
            gain.connect(master);
            osc.start(start);
            osc.stop(start + 0.22);
        }
    }

    // Achievement Unlocked
    playAchievement() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);

            gain.gain.setValueAtTime(0.25, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.3);
        });
    }

    // Super Strike (Orbital Ion Cannon)
    playSuperStrike() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const charge = this.ctx.createOscillator();
        const chargeGain = this.ctx.createGain();
        charge.type = 'sine';
        charge.frequency.setValueAtTime(100, now);
        charge.frequency.exponentialRampToValueAtTime(1600, now + 0.7);

        chargeGain.gain.setValueAtTime(0.05, now);
        chargeGain.gain.linearRampToValueAtTime(0.35, now + 0.7);
        chargeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        charge.connect(chargeGain);
        chargeGain.connect(master);
        charge.start(now);
        charge.stop(now + 0.75);

        setTimeout(() => {
            this.playExplosion();
        }, 700);
    }

    // Victory Fanfare
    playVictory() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const notes = [
            { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 783.99, d: 0.2 },
            { f: 1046.50, d: 0.6 }
        ];

        let offset = 0;
        notes.forEach((n) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, now + offset);

            gain.gain.setValueAtTime(0.35, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + n.d);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + offset);
            osc.stop(now + offset + n.d);
            offset += n.d * 0.8;
        });
    }

    // Defeat Sound
    playDefeat() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const notes = [392.00, 369.99, 349.23, 293.66];
        let offset = 0;
        notes.forEach((f) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now + offset);

            gain.gain.setValueAtTime(0.25, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + offset);
            osc.stop(now + offset + 0.35);
            offset += 0.28;
        });
    }
}

// Global singleton
window.soundManager = new SoundManager();
