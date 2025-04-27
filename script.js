let gridSize = 3;
let originalImage = 'config/image1.jpeg';
let tiles = [];
let timerInterval;
let time = 0;
let moves = 0;
let isGameStarted = false;

// 초기화 함수
window.onload = function() {
  // 기본적으로 3x3 버튼이 활성화되도록 설정
  setGridSize(3);
};

function setGridSize(size) {
  // 이전에 선택된 버튼의 active 클래스 제거
  const buttons = document.querySelectorAll('.size-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // 현재 선택된 버튼에 active 클래스 추가
  document.getElementById(`size-${size}`).classList.add('active');
  
  gridSize = size;
  
  // 게임이 진행 중이면 새 크기로 재시작
  if (isGameStarted) {
    startGame();
  }
}

function startGame() {
  // 게임 상태 초기화
  clearInterval(timerInterval);
  time = 0;
  moves = 0;
  isGameStarted = true;
  
  // UI 초기화
  document.getElementById('timer').textContent = `시간: 0초`;
  document.getElementById('moves').textContent = `이동 횟수: 0`;
  
  if (document.getElementById('message')) {
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = 'message';
  }
  
  // 퍼즐 설정
  setupPuzzle();
  
  // 타이머 시작
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
  
  // 기존 타일과 드롭존 제거
  tileContainer.innerHTML = '';
  puzzleBoard.innerHTML = '';
  
  // 타일 크기 계산 (컨테이너 크기에 맞춰서)
  const containerSize = 300; // 기본 컨테이너 크기
  const tileSize = Math.floor(containerSize / gridSize) - 4; // 마진 고려하여 계산
  
  // 타일 배열 초기화
  tiles = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      tiles.push({ x, y });
    }
  }
  
  // 타일 섞기
  shuffleArray(tiles);
  
  // 타일 컨테이너 스타일 설정
  tileContainer.style.width = `${containerSize}px`;
  tileContainer.style.height = `${containerSize}px`;
  tileContainer.style.display = 'grid';
  tileContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  tileContainer.style.gridTemplateRows = `repeat(${Math.ceil(tiles.length / gridSize)}, 1fr)`;
  tileContainer.style.gap = '4px';
  
  // 퍼즐 보드 스타일 설정
  puzzleBoard.style.width = `${containerSize}px`;
  puzzleBoard.style.height = `${containerSize}px`;
  puzzleBoard.style.display = 'grid';
  puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  puzzleBoard.style.gap = '4px';
  
  // 타일 생성
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
    
    // 이벤트 리스너 추가
    div.addEventListener('dragstart', dragStart);
    div.addEventListener('dragend', dragEnd);
    
    tileContainer.appendChild(div);
  });
  
  // 드롭존 생성
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const dropzone = document.createElement('div');
      dropzone.className = 'dropzone';
      dropzone.style.width = `${tileSize}px`;
      dropzone.style.height = `${tileSize}px`;
      dropzone.dataset.x = x;
      dropzone.dataset.y = y;
      
      // 이벤트 리스너 추가
      dropzone.addEventListener('dragover', dragOver);
      dropzone.addEventListener('dragenter', dragEnter);
      dropzone.addEventListener('dragleave', dragLeave);
      dropzone.addEventListener('drop', drop);
      
      puzzleBoard.appendChild(dropzone);
    }
  }
  
  // 동적으로 타일 컨테이너 높이 조정 (4x4, 5x5에서 모든 타일이 보이도록)
  if (gridSize > 3) {
    // 타일이 더 많으므로 컨테이너 높이를 동적으로 조정
    const rowsNeeded = Math.ceil(tiles.length / gridSize);
    const adjustedHeight = (tileSize + 4) * rowsNeeded; // gap 4px 고려
    tileContainer.style.height = `${adjustedHeight}px`;
    tileContainer.style.minHeight = `${adjustedHeight}px`;
  }
}

function dragStart(e) {
  // 타일 정보를 dataTransfer에 저장
  e.dataTransfer.setData('text/plain', `${e.target.dataset.x},${e.target.dataset.y}`);
  e.target.classList.add('dragging');
  
  // 약간의 지연 시간을 두고 드래그 이미지 설정 (더 자연스러운 효과)
  setTimeout(() => {
    e.target.style.opacity = '0.5';
  }, 0);
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
  e.target.style.opacity = '1';
}

function dragOver(e) {
  e.preventDefault(); // 기본 동작 방지 (드롭 허용)
}

function dragEnter(e) {
  e.preventDefault();
  // 드래그가 드롭존 위에 있을 때 시각적 피드백
  if (e.target.classList.contains('dropzone')) {
    e.target.classList.add('highlight');
  }
}

function dragLeave(e) {
  // 드래그가 드롭존을 벗어났을 때 시각적 피드백 제거
  if (e.target.classList.contains('dropzone')) {
    e.target.classList.remove('highlight');
  }
}

function drop(e) {
  e.preventDefault();
  
  // 시각적 피드백 제거
  if (e.target.classList.contains('dropzone')) {
    e.target.classList.remove('highlight');
  }
  
  // 드래그한 타일의 정보 가져오기
  const data = e.dataTransfer.getData('text/plain').split(',');
  const tileX = parseInt(data[0]);
  const tileY = parseInt(data[1]);
  
  // 드롭존의 정보 가져오기
  const dropzoneX = parseInt(e.target.dataset.x);
  const dropzoneY = parseInt(e.target.dataset.y);
  
  // 타일 찾기
  const draggedTile = document.querySelector(`.tile[data-x="${tileX}"][data-y="${tileY}"]`);
  
  // 이동 횟수 증가
  moves++;
  document.getElementById('moves').textContent = `이동 횟수: ${moves}`;
  
  // 올바른 위치에 놓았는지 확인
  if (tileX === dropzoneX && tileY === dropzoneY) {
    // 올바른 위치에 타일 배치
    if (e.target.classList.contains('dropzone') && !e.target.hasChildNodes()) {
      e.target.appendChild(draggedTile);
      draggedTile.style.position = 'relative';
      draggedTile.style.left = '0';
      draggedTile.style.top = '0';
      draggedTile.setAttribute('draggable', false);
      
      // 성공 메시지 표시
      if (document.getElementById('message')) {
        showMessage('정확한 위치입니다!', 'success', 1000);
      }
      
      // 퍼즐 완성 체크
      checkComplete();
    }
  } else {
    // 잘못된 위치에 놓은 경우
    if (document.getElementById('message')) {
      showMessage('잘못된 위치입니다. 다시 시도하세요.', 'error', 1000);
    }
    
    // 틀린 위치임을 시각적으로 표시 (흔들림 효과)
    draggedTile.classList.add('wrong');
    setTimeout(() => {
      draggedTile.classList.remove('wrong');
    }, 500);
  }
}

function showMessage(text, type, duration = 3000) {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;
  
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  
  // 일정 시간 후 메시지 숨기기
  setTimeout(() => {
    messageEl.className = 'message';
  }, duration);
}

function checkComplete() {
  const placedTiles = document.querySelectorAll('.puzzle-board .tile');
  
  // 모든 타일이 배치되었는지 확인
  if (placedTiles.length === gridSize * gridSize) {
    // 타이머 중지
    clearInterval(timerInterval);
    isGameStarted = false;
    
    // 축하 메시지 표시
    if (document.getElementById('message')) {
      showMessage(`축하합니다! 퍼즐을 완성했습니다! 걸린 시간: ${time}초, 이동 횟수: ${moves}회`, 'success');
    } else {
      setTimeout(() => {
        alert(`축하합니다! 퍼즐을 완성했습니다! 걸린 시간: ${time}초, 이동 횟수: ${moves}회`);
      }, 100);
    }
    
    // 애니메이션 효과 (모든 타일에 완성 효과 추가)
    placedTiles.forEach((tile, idx) => {
      setTimeout(() => {
        tile.classList.add('complete');
      }, idx * 100);
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

// 브라우저 크기 변경에 대응
window.addEventListener('resize', function() {
  if (isGameStarted) {
    setupPuzzle();
  }
});
