// script.js


import { initializeAudioContext, setupAudioSource, playAudio, stopAudio } from './audioPlayer.js';
import { setupVisualizer, drawVisualizer } from './visualizer.js';
import { updateFileName, updateTimeDisplay, updateTranStatus } from './ui.js';

// Initialize audio context and audio element
let isInitialized = false;
const audio = new Audio('/ASSETS/SOUNDS/NFT_MAST24-1.mp3');

document.getElementById('play-button').addEventListener('click', () => {
    if (!isInitialized) {
        initializeAudioContext();
        setupAudioSource();
        setupVisualizer(document.querySelector('.A-column1'));
        drawVisualizer(audio); // Pass the audio object here
        isInitialized = true;
    }
    playAudio();
    updateTranStatus('Playing');
});

document.getElementById('stop-button').addEventListener('click', () => {
    stopAudio();
    updateTranStatus('Stopped');
});

// Update time display as the audio plays
audio.addEventListener('timeupdate', () => {
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    timeDisplay.textContent = `Time: ${currentTime} / ${duration}`;
});
