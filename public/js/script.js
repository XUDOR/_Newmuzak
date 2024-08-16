// script.js



import { initializeAudioContext, setupAudioSource, playAudio, stopAudio } from './audioPlayer.js';
import { setupVisualizer, drawVisualizer } from './visualizer.js';
import { updateFileName, updateTimeDisplay, updateTranStatus } from './ui.js';

let isInitialized = false;

document.getElementById('play-button').addEventListener('click', () => {
    if (!isInitialized) {
        initializeAudioContext();
        setupAudioSource();
        setupVisualizer(document.querySelector('.A-column1'));
        drawVisualizer();
        isInitialized = true;
    }
    playAudio();
    updateTranStatus('Playing');
});

document.getElementById('stop-button').addEventListener('click', () => {
    stopAudio();
    updateTranStatus('Stopped');
});
