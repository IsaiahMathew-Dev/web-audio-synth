// Import the Web Audio API context
const audioCtx = new AudioContext();

// Initialize variables
let oscillator = null;
let distortion = null;
let gainNode = null;
let playing = false;

// Get HTML elements
const oscillatorSelector = document.getElementById('oscillator-selector');
const frequencySlider = document.getElementById('frequency-slider');
const distortionControl = document.getElementById('distortion-control');
const playButton = document.getElementById('play-button');

// Check if elements exist before binding events
if (oscillatorSelector) {
  oscillatorSelector.addEventListener('change', (e) => {
    // Update oscillator type based on selected value
    if (oscillator) {
      oscillator.type = e.target.value;
    }
  });
}

if (frequencySlider) {
  frequencySlider.addEventListener('input', (e) => {
    // Update oscillator frequency based on slider value
    if (oscillator) {
      oscillator.frequency.setValueAtTime(e.target.value, audioCtx.currentTime);
    }
  });
}

if (distortionControl) {
  distortionControl.addEventListener('input', (e) => {
    // Update distortion gain based on control value
    if (distortion) {
      distortion.gain.setValueAtTime(e.target.value, audioCtx.currentTime);
    }
  });
}

if (playButton) {
  playButton.addEventListener('click', () => {
    // Toggle play state
    playing = !playing;
    if (playing) {
      // Create oscillator and connect to destination
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      distortion = audioCtx.createWaveShaper();
      distortion.curve = new Float32Array([0, 0.5, 1]);
      distortion.oversample = '4x';

      oscillator.connect(distortion);
      distortion.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Set initial oscillator frequency and type
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 440;
      oscillator.start();

      // Update play button text
      playButton.textContent = 'Stop';
    } else {
      // Stop oscillator and disconnect from destination
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      if (distortion) {
        distortion.disconnect();
      }
      if (gainNode) {
        gainNode.disconnect();
      }

      // Reset variables and play button text
      oscillator = null;
      distortion = null;
      gainNode = null;
      playButton.textContent = 'Play';
    }
  });
}