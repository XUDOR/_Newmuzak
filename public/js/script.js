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

// Declare variables globally
let audioContext;
let analyser;
let dataArray;

// Initialize the audio element
const audio = new Audio('/ASSETS/SOUNDS/NFT_MAST24-1.mp3');

// Get the control elements
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');
const fileNameDisplay = document.querySelector('.FileName');
const timeDisplay = document.querySelector('.Time');
const tranStatus = document.querySelector('.TranStatus');

// Set initial file name and status
fileNameDisplay.textContent = `File: NFT_MAST24-1.mp3`;
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
    createSVGVisualizer();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();  // Resume the audio context if it was suspended
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
// SVG-BASED AUDIO VISUALIZER

function createSVGVisualizer() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 600 400");
  svg.setAttribute("width", "100%");  // Set width, but leave height to be controlled by CSS

  const lineGroup = document.createElementNS(svgNS, "g");
  svg.appendChild(lineGroup);

  const container = document.querySelector('.A-column1');
  container.innerHTML = ''; // Clear any existing canvas or SVG content
  container.appendChild(svg);

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    while (lineGroup.firstChild) {
      lineGroup.removeChild(lineGroup.firstChild);
    }

    const totalTime = audio.duration;
    const currentTime = audio.currentTime;
    const progressRatio = currentTime / totalTime;
    const x = progressRatio * 600;
    const y = (1 - progressRatio) * 400;

    dataArray.forEach((value, index) => {
      const line = document.createElementNS(svgNS, "line");
      const height = value * 1.5;
      const xOffset = x - index * 2;
      const yOffset = y + index * 2;

      line.setAttribute("x1", xOffset);
      line.setAttribute("y1", yOffset);
      line.setAttribute("x2", xOffset + 2);
      line.setAttribute("y2", yOffset - height);
      line.setAttribute("stroke", `rgba(${value}, 100, 150, 0.8)`);
      line.setAttribute("stroke-width", 1 + value / 255);

      lineGroup.appendChild(line);
    });

    const playhead = document.createElementNS(svgNS, "circle");
    playhead.setAttribute("cx", x);
    playhead.setAttribute("cy", y);
    playhead.setAttribute("r", 5);
    playhead.setAttribute("fill", "red");

    lineGroup.appendChild(playhead);
  }

  drawVisualizer();
}

