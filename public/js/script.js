//++++++++++++++ script.js

// Content arrays for Sections B and C
const sectionBContent = [
  "Post 1", "Post 2", "Post 3", "Post 4",
  "Post 5", "Post 6", "Post 7", "Post 8",
  "Post 9", "Post 10", "Post 11", "Post 12",
  "Post 13", "Post 14", "Post 15", "Post 16"
];

const sectionCContent = [
  "Article 1", "Article 2", "Article 3", "Article 4",
  "Article 5", "Article 6", "Article 7", "Article 8",
  "Article 9", "Article 10", "Article 11", "Article 12",
  "Article 13", "Article 14", "Article 15", "Article 16"
];

// Function to generate grid items
function generateGridContent(containerSelector, contentArray) {
  const container = document.querySelector(containerSelector);
  contentArray.forEach(item => {
    const div = document.createElement('div');
    div.className = 'square';
    div.textContent = item;
    container.appendChild(div);
  });
}

// Generate content for Sections B and C
generateGridContent('.B-grid', sectionBContent);
generateGridContent('.C-grid', sectionCContent);

// PLAYER 

// Initialize the audio element
const audio = new Audio('ASSETS/SOUNDS/NFT1_1.mp3');

// Get the control elements
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');
const fileNameDisplay = document.querySelector('.FileName');
const timeDisplay = document.querySelector('.Time');
const tranStatus = document.querySelector('.TranStatus');

// Set initial file name and status
fileNameDisplay.textContent = `File: NFT1_1.mp3`;
tranStatus.textContent = 'Stopped';

// Play button functionality
playButton.addEventListener('click', () => {
  if (!audioContext) {
    // Initialize the audio context on the first user interaction
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Initialize the analyser and connect it to the audio source
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Start the visualization
    drawVisualizer();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();  // Resume audio context if it was suspended
  }

  audio.play();
  tranStatus.textContent = 'Playing';
});

// Stop button functionality
stopButton.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0; // Reset to the beginning
  tranStatus.textContent = 'Stopped';
});

// Update time display as the audio plays
audio.addEventListener('timeupdate', () => {
  const currentTime = formatTime(audio.currentTime);
  const duration = formatTime(audio.duration);
  timeDisplay.textContent = `Time: ${currentTime} / ${duration}`;
});

// Helper function to format time in minutes:seconds
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

//===================================================================
//===================================================================
//===================================================================
// AUDIO VISUALIZER // line 82

document.addEventListener('DOMContentLoaded', () => {
  let audioContext;
  let analyser;
  let dataArray;

  const canvas = document.getElementById('audio-visualizer-canvas');
  const canvasCtx = canvas.getContext('2d');

  const playButton = document.getElementById('play-button');
  const stopButton = document.getElementById('stop-button');

  playButton.addEventListener('click', () => {
    if (!audioContext) {
      // Initialize the audio context on the first user interaction
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Initialize the analyser and connect it to the audio source
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Start the visualization
      drawVisualizer();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();  // Resume the audio context if it was suspended
    }

    audio.play();
    tranStatus.textContent = 'Playing';
  });

  stopButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0; // Reset to the beginning
    tranStatus.textContent = 'Stopped';
  });

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / dataArray.length;
    const totalTime = audio.duration;
    const currentTime = audio.currentTime;

    // Calculate the diagonal position
    const progressRatio = currentTime / totalTime;  // 0 to 1 based on time
    const x = progressRatio * canvas.width;
    const y = (1 - progressRatio) * canvas.height;

    // Loop through the data array and draw each line
    dataArray.forEach((value, index) => {
      const height = value * 2;  // Scale the height of the line
      const xOffset = x - index * barWidth;
      const yOffset = y + index * barWidth;

      // Draw the line representing the audio data
      canvasCtx.beginPath();
      canvasCtx.moveTo(xOffset, yOffset);
      canvasCtx.lineTo(xOffset + barWidth, yOffset - height);
      canvasCtx.strokeStyle = `rgba(${value}, 100, 150, 0.8)`;  // Color with opacity
      canvasCtx.lineWidth = 1 + value / 255;  // Line thickness varies with amplitude
      canvasCtx.stroke();
    });

    // Optionally: Draw a marker to show the playhead on the diagonal
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
    canvasCtx.fillStyle = 'red';
    canvasCtx.fill();
  }
});
