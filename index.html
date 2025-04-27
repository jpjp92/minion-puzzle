let gridSize = 3;
let originalImage = '3ad4a41a-5ae6-42e1-a031-c42a13e478a7.png';
let tiles = [];
let timerInterval;
let time = 0;

function setGridSize(size) {
  gridSize = size;
}

function startGame() {
  clearInterval(timerInterval);
  time = 0;
  document.getElementById('timer').textContent = `시간: 0초`;

  setupPuzzle();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    document.getElementById('timer').textContent = `시간: ${time}초`;
  }, 1000);
}

function setupPuzzle() {
  const tileContainer = document.getElementById('tile-container');
  const puzzleBoard = document.getElementById('puzzle-board');
  tileContainer.innerHTML = '';
  puzzleBoard.innerHTML = '';

  tiles = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      tiles.push({ x, y });
    }
  }

  shuffleArray(tiles);

  tiles.forEach(tile => {
    const div = document.createElement('div');
    div.className = 'tile';
    div.style.backgroundImage = `url(${originalImage})`;
    div.style.backgroundPosition = `${-tile.x * (300 / gridSize)}px ${-tile.y * (300 / gridSize)}px`;
    div.style.backgroundSize = `${300}px ${300}px`;

    div.setAttribute('draggable', true);
    div.dataset.x = tile.x;
    div.dataset.y = tile.y;

    div.addEventListener('dragstart', dragStart);
    div.addEventListener('dragend', dragEnd);

    tileContainer.appendChild(div);
  });

  for (let i = 0; i < gridSize * gridSize; i++) {
    const dropzone = document.createElement('div');
    dropzone.className = 'dropzone';
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
    puzzleBoard.appendChild(dropzone);
  }
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', `${e.target.dataset.x},${e.target.dataset.y}`);
  e.target.classList.add('dragging');
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain').split(',');
  const x = parseInt(data[0]);
  const y = parseInt(data[1]);
  const draggedTile = document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);

  const index = Array.from(this.parentNode.children).indexOf(this);
  const correctX = index % gridSize;
  const correctY = Math.floor(index / gridSize);

  if (x === correctX && y === correctY) {
    this.appendChild(draggedTile);
    draggedTile.style.position = 'relative';
    draggedTile.style.left = '0';
    draggedTile.style.top = '0';
    draggedTile.setAttribute('draggable', false);
    checkComplete();
  } else {
    draggedTile.style.transform = 'translate(10px, 10px)';
    setTimeout(() => {
      draggedTile.style.transform = 'translate(0, 0)';
    }, 200);
  }
}

function checkComplete() {
  const placedTiles = document.querySelectorAll('.puzzle-board .tile');
  if (placedTiles.length === gridSize * gridSize) {
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`퍼즐 완성! 걸린 시간: ${time}초`);
    }, 100);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
