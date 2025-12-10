// ========== AUDIO SETUP ==========

// Initialize Reverb Effect
const reverb = new Tone.Reverb({
    decay: 2,
    wet: 0.3
}).toDestination();

// Initialize Sampler with audio samples
const sampler = new Tone.Sampler({
    urls: {
        "A0": "A0.mp3", "C1": "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        "A1": "A1.mp3", "C2": "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        "A2": "A2.mp3", "C3": "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        "A3": "A3.mp3", "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        "A4": "A4.mp3", "C5": "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        "A5": "A5.mp3", "C6": "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
        "A6": "A6.mp3", "C7": "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
        "A7": "A7.mp3", "C8": "C8.mp3"
    },
    baseUrl: "./audio/",
    onload: () => {
        document.querySelector('.status-text').innerText = "Ready to play";
        console.log("✓ Piano samples loaded successfully");
    }
}).connect(reverb);

// Volume control
const volume = new Tone.Volume(-10).connect(reverb);
sampler.disconnect();
sampler.connect(volume);

// ========== STATE MANAGEMENT ==========

let currentOctave = 0;
const activeKeys = new Set();

// ========== START OVERLAY ==========

const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('start-overlay');

startBtn.addEventListener('click', async () => {
    await Tone.start();
    console.log("✓ Audio Context Started");
    
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 600);
    
    createParticles();
});

// ========== CONTROL PANEL ==========

// Volume Control
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.querySelector('.volume-value');

volumeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    volumeValue.textContent = value + '%';
    
    // Map 0-100 to -60 to 0 dB (logarithmic feel)
    const dbValue = (value / 100) * 60 - 60;
    volume.volume.value = dbValue;
});

// Reverb Control
const reverbSlider = document.getElementById('reverb-slider');
const reverbValue = document.querySelector('.reverb-value');

reverbSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    reverbValue.textContent = value + '%';
    
    // Map 0-100 to 0-1 wet value
    reverb.wet.value = value / 100;
});

// Octave Controls
const octaveUpBtn = document.getElementById('octave-up');
const octaveDownBtn = document.getElementById('octave-down');
const octaveDisplay = document.getElementById('current-octave');

octaveUpBtn.addEventListener('click', () => {
    if (currentOctave < 2) {
        currentOctave++;
        octaveDisplay.textContent = currentOctave > 0 ? '+' + currentOctave : currentOctave;
        updateKeyLabels();
    }
});

octaveDownBtn.addEventListener('click', () => {
    if (currentOctave > -2) {
        currentOctave--;
        octaveDisplay.textContent = currentOctave > 0 ? '+' + currentOctave : currentOctave;
        updateKeyLabels();
    }
});

function updateKeyLabels() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        const originalNote = key.getAttribute('data-note');
        const noteName = originalNote.slice(0, -1);
        const octaveNum = parseInt(originalNote.slice(-1));
        const newOctave = octaveNum + currentOctave;
        
        const label = key.querySelector('.key-label');
        if (label) {
            label.textContent = noteName + newOctave;
        }
    });
}

// ========== PLAY NOTE FUNCTION ==========

function triggerKey(key) {
    const baseNote = key.getAttribute('data-note');
    
    // Calculate the adjusted note with octave shift
    const noteName = baseNote.slice(0, -1);
    const baseOctave = parseInt(baseNote.slice(-1));
    const adjustedOctave = baseOctave + currentOctave;
    const adjustedNote = noteName + adjustedOctave;
    
    // Play the note with dynamic duration
    sampler.triggerAttackRelease(adjustedNote, "2n");
    
    // Visual feedback
    key.classList.add('active');
    activeKeys.add(key);
    
    // Update note display
    const noteDisplay = document.getElementById('note-display');
    noteDisplay.textContent = adjustedNote;
    noteDisplay.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        key.classList.remove('active');
        activeKeys.delete(key);
        noteDisplay.style.transform = 'scale(1)';
        
        if (activeKeys.size === 0) {
            setTimeout(() => {
                if (activeKeys.size === 0) {
                    noteDisplay.textContent = '-';
                }
            }, 500);
        }
    }, 150);
    
    // Create particle effect
    createNoteParticle(key);
}

// ========== INPUT HANDLING ==========

const keys = document.querySelectorAll('.key');

// Mouse and Touch Events
keys.forEach(key => {
    // Mouse (Desktop)
    key.addEventListener('mousedown', (e) => {
        e.preventDefault();
        triggerKey(key);
    });

    // Touch (Mobile) - Support for tap and slide
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        triggerKey(key);
    });
    
    // Touch move for sliding across keys
    key.addEventListener('touchmove', (e) => {
        e.preventDefault();
    });
});

// Enhanced touch support for sliding
let lastTouchedKey = null;

document.getElementById('piano').addEventListener('touchmove', (e) => {
    e.preventDefault();
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('key') && element !== lastTouchedKey) {
        triggerKey(element);
        lastTouchedKey = element;
    }
});

document.getElementById('piano').addEventListener('touchend', () => {
    lastTouchedKey = null;
});

// Keyboard Support (Desktop)
const keyMap = {};

keys.forEach(key => {
    const keyChar = key.getAttribute('data-key');
    if (keyChar) {
        keyMap[keyChar.toLowerCase()] = key;
    }
});

window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    
    const key = keyMap[e.key.toLowerCase()];
    if (key && !activeKeys.has(key)) {
        triggerKey(key);
    }
});

window.addEventListener('keyup', (e) => {
    const key = keyMap[e.key.toLowerCase()];
    if (key) {
        key.classList.remove('active');
        activeKeys.delete(key);
    }
});

// ========== VISUAL EFFECTS ==========

// Background Particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(212, 175, 55, ' + (Math.random() * 0.3 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.filter = 'blur(1px)';
        particle.style.animation = `float ${Math.random() * 20 + 15}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Add CSS animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Note Particle Effect (when key is pressed)
function createNoteParticle(key) {
    const rect = key.getBoundingClientRect();
    const particle = document.createElement('div');
    
    particle.style.position = 'fixed';
    particle.style.left = rect.left + rect.width / 2 + 'px';
    particle.style.top = rect.top + 'px';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.background = 'rgba(212, 175, 55, 0.8)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9998';
    particle.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.6)';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const velocity = Math.random() * 100 + 50;
    const duration = 800;
    let startTime = null;
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            const x = rect.left + rect.width / 2 + Math.cos(angle) * velocity * progress;
            const y = rect.top - velocity * progress + (progress * progress * 200);
            const opacity = 1 - progress;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${1 + progress})`;
            
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    requestAnimationFrame(animate);
}

// ========== MOBILE OPTIMIZATIONS ==========

// Prevent default touch behaviors
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.piano')) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ========== INITIALIZATION ==========

console.log('🎹 Piano Simulator Initialized');
console.log('📍 Current Octave:', currentOctave);
console.log('🔊 Volume:', volumeSlider.value + '%');
console.log('🌊 Reverb:', reverbSlider.value + '%');
