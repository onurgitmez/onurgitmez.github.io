// 1. Initialize Sampler (Local Audio)
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
    // Make sure your folder is named 'audio'
    baseUrl: "./audio/", 
    
    onload: () => {
        document.querySelector('.status').innerText = "Ready!";
        console.log("Samples loaded.");
    }
}).toDestination();

// 2. THE FIX: Mobile Start Button Logic
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('start-overlay');

startBtn.addEventListener('click', async () => {
    // This explicit user interaction unlocks the audio engine on mobile
    await Tone.start(); 
    console.log("Audio Context Started");
    
    // Hide the overlay so the user can play
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
});

// 3. Helper: Play Note
function triggerKey(key) {
    const note = key.getAttribute('data-note');
    // "2n" = play for a half note duration
    sampler.triggerAttackRelease(note, "2n");
    
    // Visual feedback
    key.classList.add('active');
    setTimeout(() => key.classList.remove('active'), 150);
}

// 4. Handle Inputs
const keys = document.querySelectorAll('.key');

keys.forEach(key => {
    // Mouse (Desktop)
    key.addEventListener('mousedown', (e) => {
        triggerKey(key);
    });

    // Touch (Mobile)
    // 'touchstart' is faster than 'click' and supports multi-touch chords
    key.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents screen scrolling while playing
        triggerKey(key);
    });
});

// 5. Keyboard Support (Desktop)
window.addEventListener('keydown', (e) => {
    if (e.repeat) return; // Prevent spamming sound when holding key
    const key = document.querySelector(`.key[data-key="${e.key.toLowerCase()}"]`);
    if (key) triggerKey(key);
});

window.addEventListener('keyup', (e) => {
    const key = document.querySelector(`.key[data-key="${e.key.toLowerCase()}"]`);
    if (key) key.classList.remove('active');
});
