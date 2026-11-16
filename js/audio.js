/**
 * Authentic 8-Bit Chiptune Synthesizer via Web Audio API
 * Generates pulse wave chiptunes, retro noise bursts, coin sounds, and 8-bit ambient arpeggios.
 */
class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('qtd_muted') === 'true';
        this.isMusicMuted = localStorage.getItem('qtd_music_muted') === 'true';
        this.masterVolume = 0.28;
        this.musicVolume = 0.12;
        this._initialized = false;

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

                this.musicGain = this.ctx.createGain();
                this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
                this.musicGain.connect(this.ctx.destination);
            }
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    ensureContext() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.isMusicPlaying && !this.isMusicMuted) {
            this.startChiptuneMusic();
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
            this.startChiptuneMusic();
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

    // --- 8-Bit Retro Chiptune Loop ---
    startChiptuneMusic() {
        if (this.musicInterval || !this.ctx || this.isMusicMuted) return;
        this.isMusicPlaying = true;

        // Classic Arcade C Minor Chiptune Sequence
        // Bassline: C2, G2, C3, Eb3, F2, C3, F3, G2
        const bassLine = [65.41, 98.00, 130.81, 155.56, 87.31, 130.81, 174.61, 98.00];
        // Lead Arpeggio: C4, Eb4, G4, Bb4, C5, Bb4, G4, Eb4
        const leadArp = [261.63, 311.13, 392.00, 466.16, 523.25, 466.16, 392.00, 311.13];

        const tempoMs = 220; // brisk 8-bit tempo

        this.musicInterval = setInterval(() => {
            if (this.isMusicMuted || !this.ctx || this.ctx.state !== 'running') return;

            const now = this.ctx.currentTime;
            this.musicStep++;

            // 1. Chiptune Bass Pulse (Square Wave)
            const bIdx = (this.musicStep >> 1) % bassLine.length;
            const bassOsc = this.ctx.createOscillator();
            const bassGain = this.ctx.createGain();

            bassOsc.type = 'square';
            bassOsc.frequency.setValueAtTime(bassLine[bIdx], now);

            bassGain.gain.setValueAtTime(0.18, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            bassOsc.connect(bassGain);
            bassGain.connect(this.musicGain);

            bassOsc.start(now);
            bassOsc.stop(now + 0.18);

            // 2. Lead Arpeggio Melody (Triangle wave with staccato)
            const lIdx = this.musicStep % leadArp.length;
            const leadOsc = this.ctx.createOscillator();
            const leadGain = this.ctx.createGain();

            leadOsc.type = 'triangle';
            leadOsc.frequency.setValueAtTime(leadArp[lIdx], now);

            leadGain.gain.setValueAtTime(0.12, now);
            leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            leadOsc.connect(leadGain);
            leadGain.connect(this.musicGain);

            leadOsc.start(now);
            leadOsc.stop(now + 0.15);
        }, tempoMs);
    }

    stopChiptuneMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        this.isMusicPlaying = false;
    }

    // --- 8-Bit Retro Sound Effects ---

    // 8-bit UI Click / Blip
    playClick() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime + 0.02);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // 8-bit Coin / Disk Study Sound (Classic Mario/Arcade Coin: B5 -> E6)
    playCardStudy() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    // 8-bit Power Up (Build)
    playBuild() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        [330, 392, 659, 523, 587, 784].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(f, now + i * 0.035);

            gain.gain.setValueAtTime(0.2, now + i * 0.035);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.08);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + i * 0.035);
            osc.stop(now + i * 0.035 + 0.08);
        });
    }

    // 8-bit Fanfare (Upgrade)
    playUpgrade() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0.25, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.18);
        });
    }

    // 8-bit Sell
    playSell() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    // 8-bit Laser Shot (Fast square sweep)
    playLaser() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.08);
    }

    // 8-bit Cryo Freeze
    playFreeze() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.15);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    // 8-bit Rocket Launch
    playArtilleryLaunch() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    // 8-bit Noise Explosion (NES style)
    playExplosion() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + 0.35);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        noise.start(now);
        noise.stop(now + 0.35);
    }

    // 8-bit Correct Chime
    playCorrect() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0.25, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.18);
        });
    }

    // 8-bit Buzzer (Wrong)
    playWrong() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.setValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // 8-bit Warning Siren
    playWarning() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            const start = now + i * 0.18;
            osc.frequency.setValueAtTime(600, start);
            osc.frequency.setValueAtTime(900, start + 0.09);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.17);

            osc.connect(gain);
            gain.connect(master);
            osc.start(start);
            osc.stop(start + 0.17);
        }
    }

    // 8-bit Trophy Fanfare
    playAchievement() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.22, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.22);
        });
    }

    // 8-bit Super Strike
    playSuperStrike() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const charge = this.ctx.createOscillator();
        const chargeGain = this.ctx.createGain();
        charge.type = 'sawtooth';
        charge.frequency.setValueAtTime(100, now);
        charge.frequency.exponentialRampToValueAtTime(1800, now + 0.6);

        chargeGain.gain.setValueAtTime(0.05, now);
        chargeGain.gain.linearRampToValueAtTime(0.3, now + 0.6);
        chargeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        charge.connect(chargeGain);
        chargeGain.connect(master);
        charge.start(now);
        charge.stop(now + 0.65);

        setTimeout(() => {
            this.playExplosion();
        }, 600);
    }

    // 8-bit Victory
    playVictory() {
        this.ensureContext();
        const master = this.getMasterGain();
        if (!master) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        let offset = 0;
        notes.forEach((f) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(f, now + offset);

            gain.gain.setValueAtTime(0.3, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + offset);
            osc.stop(now + offset + 0.25);
            offset += 0.16;
        });
    }

    // 8-bit Defeat / Game Over
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
            osc.type = 'square';
            osc.frequency.setValueAtTime(f, now + offset);

            gain.gain.setValueAtTime(0.25, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + offset);
            osc.stop(now + offset + 0.35);
            offset += 0.25;
        });
    }
}

window.soundManager = new SoundManager();
