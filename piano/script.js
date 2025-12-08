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
    baseUrl: "./audio/",
    onload: () => {
        document.querySelector('.status').innerText = "Ready! Tap keys to play.";
        console.log("Audio loaded.");
    }
}).toDestination();

// 2. Play Note Helper Function
function triggerKey(key) {
    const note = key.getAttribute('data-note');
    sampler.triggerAttackRelease(note, "2n");
    
    // Visual Feedback
    key.classList.add('active');
    setTimeout(() => key.classList.remove('active'), 150);
}

// 3. FORCE AUDIO TO WAKE UP (Crucial for Mobile)
// Mobile browsers mute audio until the first interaction.
const startAudio = async () => {
    if (Tone.context.state !== 'running') {
        await Tone.start();
        console.log("Audio Context Started");
    }
};

// Add global listener to wake up audio on first touch anywhere
document.body.addEventListener('touchstart', startAudio, { once: true });
document.body.addEventListener('click', startAudio, { once: true });


// 4. Handle Input Events
const keys = document.querySelectorAll('.key');

keys.forEach(key => {
    // A. Mouse Click (Desktop)
    key.addEventListener('mousedown', (e) => {
        triggerKey(key);
    });

    // B. Touch Start (Mobile) - "e.preventDefault()" stops scrolling while playing
    key.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        triggerKey(key);
    });
});

// 5. Keyboard Support (Desktop)
window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = document.querySelector(`.key[data-key="${e.key.toLowerCase()}"]`);
    if (key) {
        triggerKey(key);
    }
});
