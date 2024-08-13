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

// Additional controls (Next, Before, etc.) can be added similarly...

