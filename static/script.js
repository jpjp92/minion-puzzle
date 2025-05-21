let gridSize = 3;
let originalImage = '/static/image1.jpg';
let tiles = [];
let timerInterval;
let time = 0;
let moves = 0;
let isGameStarted = false;
let touchStartX, touchStartY;
let activeTouchTile = null;
let initialTileArrangement = [];
let resizeTimeout;

// 점수 계산 함수
function calculateScore(time_taken, moves) {
  const BASE_SCORE = 100;
  const TIME_WEIGHT = 0.3;
  const MOVE_WEIGHT = 0.1;
  let score = BASE_SCORE - (time_taken * TIME_WEIGHT) - (moves * MOVE_WEIGHT);
  return Math.max(score, 0);
}

// 리더보드 모달 표시/숨김 함수
function showLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.classList.add('show');   // ✅ 추가 필요
  }
}

function hideLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// 리더보드 갱신 함수
async function updateLeaderboard() {
  try {
    const response = await fetch('/api/scores');
    if (!response.ok) throw new Error('리더보드 데이터 가져오기 실패');
    let scores = await response.json();
    console.log('받은 리더보드 데이터:', scores); // ✅ 로그 추가

    scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.time_taken !== b.time_taken) return a.time_taken - b.time_taken;
      return a.moves - b.moves;
    });

    const tbody = document.querySelector('#scoresTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    scores.forEach((score, idx) => {
      const row = tbody.insertRow();
      row.insertCell().innerHTML = medals[idx + 1] || (idx + 1);
      row.insertCell().textContent = score.player_name;
      row.insertCell().textContent = Math.floor(score.score);
      row.insertCell().textContent = score.difficulty;
      row.insertCell().textContent = `${score.time_taken}초`;
      row.insertCell().textContent = score.moves;
    });
    console.log('✅ 리더보드 테이블 채움 완료');
  } catch (error) {
    console.error('리더보드 불러오기 오류:', error);
  }
}

// 닉네임 입력 및 저장
function confirmNickname() {
  const input = document.getElementById('modal-nickname-input');
  const nickname = input.value.trim();
  if (!nickname) {
    showMessage('닉네임을 입력해주세요!', 'error', 2000);
    return;
  }
  localStorage.setItem('minion-nickname', nickname);
  document.getElementById('nickname-modal').style.display = 'none';
}

// 초기화 함수
window.onload = function() {
  localStorage.removeItem('minion-nickname');
  setGridSize(3);

  const nicknameModal = document.getElementById('nickname-modal');
  const nicknameInput = document.getElementById('modal-nickname-input');
  const confirmBtn = document.getElementById('confirm-nickname-btn');
  const showBtn = document.getElementById('showLeaderboardBtn');
  const closeBtn = document.getElementById('closeLeaderboardBtn');
  const leaderboardModal = document.getElementById('leaderboardModal');

  if (nicknameModal) {
    nicknameModal.style.display = 'flex';
    if (nicknameInput) {
      nicknameInput.focus();
      nicknameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          confirmNickname();
        }
      });
    }
  }

  if (confirmBtn) {
    confirmBtn.onclick = confirmNickname;
  }

  if (showBtn) {
    showBtn.onclick = function() {
      updateLeaderboard().then(showLeaderboardModal).catch(err => console.error('리더보드 오류:', err));
    };
  }

  if (closeBtn) {
    closeBtn.onclick = hideLeaderboardModal;
  }

  if (leaderboardModal) {
    leaderboardModal.addEventListener('click', (e) => {
      if (e.target === leaderboardModal) hideLeaderboardModal();
    });
    leaderboardModal.addEventListener('touchend', (e) => {
      if (e.target === leaderboardModal) hideLeaderboardModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideLeaderboardModal();
  });
};

function setGridSize(size) {
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.difficulty-btn[data-size="${size}"]`).classList.add('active');
  gridSize = size;
  if (isGameStarted) startGame();
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

function dragOver(e) {
  e.preventDefault();
}

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
    if (touch.clientX >= zoneRect.left && touch.clientX <= zoneRect.right && touch.clientY >= zoneRect.top && touch.clientY <= zoneRect.bottom) {
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

function showMessage(text, type, duration = 3000) {
  const existingMessage = document.getElementById('message');
  if (existingMessage) {
    existingMessage.remove();
  }
  const toast = document.createElement('div');
  toast.id = 'message';
  toast.className = `toast-message ${type}`;
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

function checkComplete() {
  const placedTiles = document.querySelectorAll('.puzzle-board .tile');
  if (placedTiles.length === gridSize * gridSize) {
    clearInterval(timerInterval);
    isGameStarted = false;
    showMessage(`축하합니다! (Congratulations) ${time}초, ${moves}회`, 'success', 1500);

    const score = calculateScore(time, moves);
    const nickname = localStorage.getItem('minion-nickname') || 'Anonymous';
    const difficulty = `${gridSize}x${gridSize}`;

    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_name: nickname,
        score: score,
        difficulty: difficulty,
        time_taken: time,
        moves: moves
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('점수 저장 실패');
        }
        return response.json();
      })
      .then(() => {
        return updateLeaderboard();
      })
      .then(() => {
        setTimeout(() => {
          showLeaderboardModal();
        }, 1500);
      })
      .catch(error => {
        console.error('점수 저장 오류:', error);
        showMessage('점수 저장 중 오류가 발생했습니다', 'error', 2000);
      });
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
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

function selectImage(el, path) {
  document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('selected'));
  el.classList.add('selected');
  originalImage = path;
  document.getElementById('preview-img').src = path;
  if (isGameStarted) startGame();
}
