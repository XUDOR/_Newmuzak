// ui.js
function updateFileName(fileName) {
  document.querySelector('.FileName').textContent = `File: ${fileName}`;
}

function updateTimeDisplay(currentTime, duration) {
  document.querySelector('.Time').textContent = `Time: ${currentTime} / ${duration}`;
}

function updateTranStatus(status) {
  document.querySelector('.TranStatus').textContent = status;
}

export { updateFileName, updateTimeDisplay, updateTranStatus };
