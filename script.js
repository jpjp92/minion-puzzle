let gridSize = 3;
let originalImage = 'config/image1.jpg';
let tiles = [];
let timerInterval;
let time = 0;
let moves = 0;
let isGameStarted = false;
let touchStartX, touchStartY; 
let activeTouchTile = null;
let initialTileArrangement = [];
let resizeTimeout;

// 초기화 함수
window.onload = function() {
  setGridSize(3);
  document.getElementById('image-select').addEventListener('change', function () {
    originalImage = this.value;
    document.getElementById('preview-img').src = originalImage;
    if (isGameStarted) {
      startGame();
    }
  });
};

function setGridSize(size) {
  const buttons = document.querySelectorAll('.difficulty-card');
  buttons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(`size-${size}`).classList.add('active');
  gridSize = size;
  if (isGameStarted) {
    startGame();
  }
}

function startGame() {
  clearInterval(timerInterval);
  time = 0;
  moves = 0;
  isGameStarted = true;
  document.getElementById('timer').textContent = `0s`;
  document.getElementById('moves').textContent = `0`;
  setupPuzzle();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    document.getElementById('timer').textContent = `${time}s`;
  }, 1000);
}

function setupPuzzle() {
  const tileContainer = document.getElementById('tile-container');
  const puzzleBoard = document.getElementById('puzzle-board');
  tileContainer.innerHTML = '';
  puzzleBoard.innerHTML = '';
  const containerSize = 300;
  const tileSize = Math.floor(containerSize / gridSize) - 4;
  
  tiles = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      tiles.push({ x, y });
    }
  }

  shuffleArray(tiles);
  initialTileArrangement = [...tiles];
  
  tileContainer.style.width = `${containerSize}px`;
  tileContainer.style.height = `${containerSize}px`;
  tileContainer.style.display = 'grid';
  tileContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  tileContainer.style.gridTemplateRows = `repeat(${Math.ceil(tiles.length / gridSize)}, 1fr)`;
  tileContainer.style.gap = '4px';
  
  puzzleBoard.style.width = `${containerSize}px`;
  puzzleBoard.style.height = `${containerSize}px`;
  puzzleBoard.style.display = 'grid';
  puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  puzzleBoard.style.gap = '4px';

  tiles.forEach(tile => {
    const div = document.createElement('div');
    div.className = 'tile';
    div.style.width = `${tileSize}px`;
    div.style.height = `${tileSize}px`;
    div.style.backgroundImage = `url(${originalImage})`;
    div.style.backgroundPosition = `${-tile.x * (containerSize / gridSize)}px ${-tile.y * (containerSize / gridSize)}px`;
    div.style.backgroundSize = `${containerSize}px ${containerSize}px`;
    div.setAttribute('draggable', true);
    div.dataset.x = tile.x;
    div.dataset.y = tile.y;
    
    div.addEventListener('dragstart', dragStart);
    div.addEventListener('dragend', dragEnd);
    div.addEventListener('touchstart', touchStart, { passive: false });
    div.addEventListener('touchmove', touchMove, { passive: false });
    div.addEventListener('touchend', touchEnd, { passive: false });

    tileContainer.appendChild(div);
  });

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const dropzone = document.createElement('div');
      dropzone.className = 'dropzone';
      dropzone.style.width = `${tileSize}px`;
      dropzone.style.height = `${tileSize}px`;
      dropzone.dataset.x = x;
      dropzone.dataset.y = y;
      dropzone.addEventListener('dragover', dragOver);
      dropzone.addEventListener('dragenter', dragEnter);
      dropzone.addEventListener('dragleave', dragLeave);
      dropzone.addEventListener('drop', drop);
      dropzone.setAttribute('data-dropzone', 'true');
      puzzleBoard.appendChild(dropzone);
    }
  }

  if (gridSize > 3) {
    const rowsNeeded = Math.ceil(tiles.length / gridSize);
    const adjustedHeight = (tileSize + 4) * rowsNeeded;
    tileContainer.style.height = `${adjustedHeight}px`;
    tileContainer.style.minHeight = `${adjustedHeight}px`;
  }
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', `${e.target.dataset.x},${e.target.dataset.y}`);
  e.target.classList.add('dragging');
  setTimeout(() => {
    e.target.style.opacity = '0.5';
  }, 0);
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
  e.target.style.opacity = '1';
}

function dragOver(e) { e.preventDefault(); }

function dragEnter(e) {
  e.preventDefault();
  if (e.target.classList.contains('dropzone')) {
    e.target.classList.add('highlight');
  }
}

function dragLeave(e) {
  if (e.target.classList.contains('dropzone')) {
    e.target.classList.remove('highlight');
  }
}

function drop(e) {
  e.preventDefault();
  if (e.target.classList.contains('dropzone')) {
    e.target.classList.remove('highlight');
  }
  const data = e.dataTransfer.getData('text/plain').split(',');
  const tileX = parseInt(data[0]);
  const tileY = parseInt(data[1]);
  const dropzoneX = parseInt(e.target.dataset.x);
  const dropzoneY = parseInt(e.target.dataset.y);
  const draggedTile = document.querySelector(`.tile[data-x="${tileX}"][data-y="${tileY}"]`);
  placeTile(draggedTile, tileX, tileY, dropzoneX, dropzoneY, e.target);
}

function touchStart(e) {
  if (!e.target.classList.contains('tile')) return;
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  activeTouchTile = e.target;
  activeTouchTile.classList.add('dragging');
  requestAnimationFrame(() => {
    activeTouchTile.style.position = 'fixed';
    activeTouchTile.style.zIndex = '100';
    activeTouchTile.style.opacity = '0.7';
    activeTouchTile.style.left = `${touch.clientX - (activeTouchTile.offsetWidth / 2)}px`;
    activeTouchTile.style.top = `${touch.clientY - (activeTouchTile.offsetHeight / 2)}px`;
  });
}

function touchMove(e) {
  if (!activeTouchTile) return;
  e.preventDefault();
  const touch = e.touches[0];
  requestAnimationFrame(() => {
    activeTouchTile.style.left = `${touch.clientX - (activeTouchTile.offsetWidth / 2)}px`;
    activeTouchTile.style.top = `${touch.clientY - (activeTouchTile.offsetHeight / 2)}px`;
    updateDropzoneHighlights(touch.clientX, touch.clientY);
  });
}

function updateDropzoneHighlights(x, y) {
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(zone => {
    zone.classList.remove('highlight');
    const zoneRect = zone.getBoundingClientRect();
    if (x >= zoneRect.left && x <= zoneRect.right && y >= zoneRect.top && y <= zoneRect.bottom) {
      zone.classList.add('highlight');
    }
  });
}

function touchEnd(e) {
  if (!activeTouchTile) return;
  e.preventDefault();
  const tileX = parseInt(activeTouchTile.dataset.x);
  const tileY = parseInt(activeTouchTile.dataset.y);
  const touch = e.changedTouches[0];
  let droppedOnZone = false;
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(zone => {
    zone.classList.remove('highlight');
    const zoneRect = zone.getBoundingClientRect();
    if (
      touch.clientX >= zoneRect.left && touch.clientX <= zoneRect.right &&
      touch.clientY >= zoneRect.top && touch.clientY <= zoneRect.bottom
    ) {
      const dropzoneX = parseInt(zone.dataset.x);
      const dropzoneY = parseInt(zone.dataset.y);
      placeTile(activeTouchTile, tileX, tileY, dropzoneX, dropzoneY, zone);
      droppedOnZone = true;
    }
  });
  if (!droppedOnZone) {
    activeTouchTile.style.position = '';
    activeTouchTile.style.left = '';
    activeTouchTile.style.top = '';
    activeTouchTile.style.zIndex = '';
  }
  activeTouchTile.classList.remove('dragging');
  activeTouchTile.style.opacity = '1';
  activeTouchTile = null;
}

function placeTile(tile, tileX, tileY, dropzoneX, dropzoneY, dropzone) {
  moves++;
  document.getElementById('moves').textContent = `${moves}`;
  if (tileX === dropzoneX && tileY === dropzoneY) {
    if (dropzone.classList.contains('dropzone') && !dropzone.hasChildNodes()) {
      dropzone.appendChild(tile);
      tile.style.position = 'relative';
      tile.style.left = '0';
      tile.style.top = '0';
      tile.style.zIndex = '';
      tile.setAttribute('draggable', false);
      tile.removeEventListener('touchstart', touchStart);
      tile.removeEventListener('touchmove', touchMove);
      tile.removeEventListener('touchend', touchEnd);
      showMessage('정확합니다! (Correct)', 'success', 1000);
      checkComplete();
    }
  } else {
    showMessage('다시 시도하세요! (Try again)', 'error', 1000);
    tile.style.position = '';
    tile.style.left = '';
    tile.style.top = '';
    tile.style.zIndex = '';
    tile.classList.add('wrong');
    setTimeout(() => {
      tile.classList.remove('wrong');
    }, 500);
  }
}

function checkComplete() {
  const placedTiles = document.querySelectorAll('.puzzle-board .tile');
  if (placedTiles.length === gridSize * gridSize) {
    clearInterval(timerInterval);
    isGameStarted = false;
    const nickname = document.getElementById('nickname').value || 'Anonymous';
    showMessage(`축하합니다, ${nickname}! (${time}s, ${moves}회)`, 'success', 5000);

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({ name: nickname, time, moves });
    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard.splice(10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();

    placedTiles.forEach((tile, idx) => {
      setTimeout(() => tile.classList.add('complete'), idx * 100);
    });
  }
}

function renderLeaderboard() {
  const board = document.getElementById('leaderboard');
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '';
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${entry.time}s / ${entry.moves} moves</span>`;
    list.appendChild(li);
  });
  board.classList.remove('hidden');
}

function showMessage(text, type, duration = 3000) {
  const existingMessage = document.getElementById('message');
  if (existingMessage) existingMessage.remove();
  const toast = document.createElement('div');
  toast.id = 'message';
  toast.className = `toast-message ${type}`;
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

window.addEventListener('resize', function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    adjustLayout();
  }, 250);
});

function adjustLayout() {
  if (!isGameStarted) return;
  const tileContainer = document.getElementById('tile-container');
  const puzzleBoard = document.getElementById('puzzle-board');
  const containerSize = Math.min(300, window.innerWidth * 0.8);
  const tileSize = Math.floor(containerSize / gridSize) - 4;
  tileContainer.style.width = `${containerSize}px`;
  puzzleBoard.style.width = `${containerSize}px`;
  const existingTiles = document.querySelectorAll('.tile');
  existingTiles.forEach(tile => {
    tile.style.width = `${tileSize}px`;
    tile.style.height = `${tileSize}px`;
    tile.style.backgroundSize = `${containerSize}px ${containerSize}px`;
    const x = parseInt(tile.dataset.x);
    const y = parseInt(tile.dataset.y);
    tile.style.backgroundPosition = `${-x * (containerSize / gridSize)}px ${-y * (containerSize / gridSize)}px`;
  });
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(zone => {
    zone.style.width = `${tileSize}px`;
    zone.style.height = `${tileSize}px`;
  });
  if (gridSize > 3) {
    const rowsNeeded = Math.ceil(tiles.length / gridSize);
    const adjustedHeight = (tileSize + 4) * rowsNeeded;
    tileContainer.style.height = `${adjustedHeight}px`;
    tileContainer.style.minHeight = `${adjustedHeight}px`;
  }
}


// 모달에서 닉네임 입력 후 저장
function confirmNickname() {
  const input = document.getElementById('modal-nickname-input');
  const nickname = input.value.trim();
  if (nickname.length === 0) {
    input.focus();
    return;
  }
  localStorage.setItem('nickname', nickname);
  document.getElementById('nickname-modal').style.display = 'none';
}

// 페이지 진입 시 닉네임 확인
window.addEventListener('DOMContentLoaded', () => {
  const storedNickname = localStorage.getItem('nickname');
  if (!storedNickname) {
    document.getElementById('nickname-modal').style.display = 'flex';
  }
});

// 기존 코드와 동일하게 유지, 예시:
function checkComplete() {
  const placedTiles = document.querySelectorAll('.puzzle-board .tile');
  if (placedTiles.length === gridSize * gridSize) {
    clearInterval(timerInterval);
    isGameStarted = false;
    const nickname = localStorage.getItem('nickname') || 'Anonymous';
    showMessage(`축하합니다, ${nickname}! (${time}s, ${moves}회)`, 'success', 5000);

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({ name: nickname, time, moves });
    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard.splice(10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();

    placedTiles.forEach((tile, idx) => {
      setTimeout(() => tile.classList.add('complete'), idx * 100);
    });
  }
}

function renderLeaderboard() {
  const board = document.getElementById('leaderboard');
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '';
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${entry.time}s / ${entry.moves} moves</span>`;
    list.appendChild(li);
  });
  board.classList.remove('hidden');
}

