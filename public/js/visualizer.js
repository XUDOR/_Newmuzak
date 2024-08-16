import { analyser, dataArray } from './audioPlayer.js';

let svg;
let lineGroup;

function setupVisualizer(container) {
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

function drawVisualizer(audio) {
  requestAnimationFrame(() => drawVisualizer(audio));

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

  // Draw right channel lines
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


export { setupVisualizer, drawVisualizer };
