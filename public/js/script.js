// PLAYER

// Declare variables globally
let audioContext;
let analyser;
let dataArray;
let svg;
let lineGroup;

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

// Full-screen and visualization setup
function setupVisualization() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  const container = document.querySelector('.A-column1');
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(lineGroup);

  container.innerHTML = ''; // Clear any existing content
  container.appendChild(svg);

  const source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  drawVisualizer(); // Start drawing
}

// Function to smooth the array data (simple moving average)
function smoothArray(arr, windowSize) {
  const result = new Float32Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j < Math.min(arr.length, i + windowSize + 1); j++) {
          sum += arr[j];
          count++;
      }
      result[i] = sum / count;
  }
  return result;
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  analyser.getByteFrequencyData(dataArray);

  while (lineGroup.firstChild) {
      lineGroup.removeChild(lineGroup.firstChild);
  }

  const midPoint = Math.floor(dataArray.length / 2);
  const leftChannel = dataArray.slice(0, midPoint);
  const rightChannel = dataArray.slice(midPoint);

  const smoothedLeft = smoothArray(leftChannel, 5);
  const smoothedRight = smoothArray(rightChannel, 5);

  const containerWidth = svg.viewBox.baseVal.width;
  const containerHeight = svg.viewBox.baseVal.height;

  const timeProgress = audio.currentTime / audio.duration;

  // Draw left channel lines
  smoothedLeft.forEach((value, index) => {
      const height = value * 2;
      const xOffset = index * (containerWidth / midPoint);
      const yOffset = containerHeight - height;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", xOffset);
      line.setAttribute("y1", containerHeight);
      line.setAttribute("x2", xOffset + timeProgress * containerWidth);
      line.setAttribute("y2", yOffset);
      line.setAttribute("stroke", `rgba(${100 + value}, 50, 150, 0.8)`);
      line.setAttribute("stroke-width", 1 + value / 255);
      lineGroup.appendChild(line);
  });

  // Correct calculation for right channel lines and field representation
  smoothedRight.forEach((value, index) => {
      const height = value * 2;
      const xOffset = (containerWidth / 2) + (index * (containerWidth / midPoint / 2)); // Adjust the offset calculation
      const yOffset = containerHeight - height;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", xOffset);
      line.setAttribute("y1", containerHeight);
      line.setAttribute("x2", xOffset);
      line.setAttribute("y2", yOffset);
      line.setAttribute("stroke", `rgba(${value}, 150, 50, 0.8)`);
      line.setAttribute("stroke-width", 1 + value / 255);
      lineGroup.appendChild(line);
  });
}

// Play button functionality
playButton.addEventListener('click', () => {
  if (!audioContext) {
      setupVisualization();  // Initialize the visualization on the first play
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
