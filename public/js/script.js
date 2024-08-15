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
// AUDIO VISUALIZER

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Initialize the analyser
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;  // Adjust size for more/less frequency data
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Connect the analyser to the audio element
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Set up the canvas
    const canvas = document.getElementById('audio-visualizer');
    const canvasCtx = canvas.getContext('2d');

    // Function to draw the visualization
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / dataArray.length;
        const startX = 0;
        const startY = canvas.height;

        // Loop through the data array and draw each line
        dataArray.forEach((value, index) => {
            const height = value * 2;  // Scale the height of the line
            const x = startX + index * barWidth;
            const y = startY - height;

            // Draw the line representing the audio data
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, startY);
            canvasCtx.lineTo(x, y);
            canvasCtx.strokeStyle = `rgba(${value}, 100, 150, 0.8)`;  // Color with opacity
            canvasCtx.lineWidth = 1 + value / 255;  // Line thickness varies with amplitude
            canvasCtx.stroke();

            // Add a blur effect
            canvasCtx.shadowBlur = 10;
            canvasCtx.shadowColor = `rgba(${value}, 100, 150, 0.5)`;

            // Simulate the fall or decay effect by redrawing with decreased opacity
            for (let i = 1; i <= 5; i++) {
                canvasCtx.beginPath();
                canvasCtx.moveTo(x, startY);
                canvasCtx.lineTo(x, y + i * 5);  // Increment y to simulate fall
                canvasCtx.strokeStyle = `rgba(${value}, 100, 150, ${0.8 - i * 0.15})`;
                canvasCtx.stroke();
            }
        });
    }

    // Start the visualization
    drawVisualizer();
});
