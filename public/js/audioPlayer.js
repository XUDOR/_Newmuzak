// audioPlayer.js
let audioContext;
let audio;
let analyser;
let dataArray;

function initializeAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    audio = new Audio('/ASSETS/SOUNDS/NFT_MAST24-1.mp3');
}

function setupAudioSource() {
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
}

function playAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    audio.play();
}

function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
}

export { initializeAudioContext, setupAudioSource, playAudio, stopAudio, analyser, dataArray };
