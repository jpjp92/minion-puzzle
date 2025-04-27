let gridSize = 3;
let originalImage = 'config/image1.jpeg';
let tiles = [];
let timerInterval;
let time = 0;
let moves = 0;
let isGameStarted = false;
let touchStartX, touchStartY; // 터치 시작 위치
let activeTouchTile = null; // 현재 터치 중인 타일

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
    
    // 데스크톱 이벤트 리스너 추가
    div.addEventListener('dragstart', dragStart);
    div.addEventListener('dragend', dragEnd);
    
    // 모바일 터치 이벤트 리스너 추가
    div.addEventListener('touchstart', touchStart);
    div.addEventListener('touchmove', touchMove);
    div.addEventListener('touchend', touchEnd);
    
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
      
      // 데스크톱 이벤트 리스너 추가
      dropzone.addEventListener('dragover', dragOver);
      dropzone.addEventListener('dragenter', dragEnter);
      dropzone.addEventListener('dragleave', dragLeave);
      dropzone.addEventListener('drop', drop);
      
      // 모바일 터치 이벤트를 위한 드롭존 식별
      dropzone.setAttribute('data-dropzone', 'true');
      
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

// 데스크톱 드래그 앤 드롭 이벤트 핸들러
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
  
  // 이동 횟수 증가 및 타일 배치 시도
  placeTile(draggedTile, tileX, tileY, dropzoneX, dropzoneY, e.target);
}

// 모바일 터치 이벤트 핸들러
function touchStart(e) {
  if (!e.target.classList.contains('tile')) return;
  
  e.preventDefault(); // 이벤트 기본 동작 방지
  
  // 터치 시작 위치 저장
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  
  // 현재 타일 저장
  activeTouchTile = e.target;
  activeTouchTile.classList.add('dragging');
  activeTouchTile.style.opacity = '0.5';
  
  // 타일을 최상위로 표시
  activeTouchTile.style.zIndex = '100';
}

function touchMove(e) {
  if (!activeTouchTile) return;
  
  e.preventDefault(); // 스크롤 방지
  
  const touch = e.touches[0];
  
  // 타일 이동
  activeTouchTile.style.position = 'fixed';
  activeTouchTile.style.left = `${touch.clientX - (activeTouchTile.offsetWidth / 2)}px`;
  activeTouchTile.style.top = `${touch.clientY - (activeTouchTile.offsetHeight / 2)}px`;
  
  // 현재 위치에서 드롭존 확인
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(zone => {
    zone.classList.remove('highlight');
    
    const zoneRect = zone.getBoundingClientRect();
    if (
      touch.clientX >= zoneRect.left && 
      touch.clientX <= zoneRect.right && 
      touch.clientY >= zoneRect.top && 
      touch.clientY <= zoneRect.bottom
    ) {
      // 드롭존 위에 있는 경우 하이라이트
      zone.classList.add('highlight');
    }
  });
}

function touchEnd(e) {
  if (!activeTouchTile) return;
  
  e.preventDefault();
  
  // 타일 정보 가져오기
  const tileX = parseInt(activeTouchTile.dataset.x);
  const tileY = parseInt(activeTouchTile.dataset.y);
  
  // 터치 종료 위치 확인
  const touch = e.changedTouches[0];
  let droppedOnZone = false;
  
  // 모든 드롭존 검사
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(zone => {
    zone.classList.remove('highlight');
    
    const zoneRect = zone.getBoundingClientRect();
    if (
      touch.clientX >= zoneRect.left && 
      touch.clientX <= zoneRect.right && 
      touch.clientY >= zoneRect.top && 
      touch.clientY <= zoneRect.bottom
    ) {
      // 드롭존 위에서 터치 종료
      const dropzoneX = parseInt(zone.dataset.x);
      const dropzoneY = parseInt(zone.dataset.y);
      
      // 타일 배치 시도
      placeTile(activeTouchTile, tileX, tileY, dropzoneX, dropzoneY, zone);
      droppedOnZone = true;
    }
  });
  
  // 드롭존 위가 아니면 원래 위치로 복귀
  if (!droppedOnZone) {
    activeTouchTile.style.position = '';
    activeTouchTile.style.left = '';
    activeTouchTile.style.top = '';
    activeTouchTile.style.zIndex = '';
  }
  
  // 드래깅 스타일 제거
  activeTouchTile.classList.remove('dragging');
  activeTouchTile.style.opacity = '1';
  activeTouchTile = null;
}

// 타일 배치 공통 함수 (드래그&드롭과 터치에서 모두 사용)
function placeTile(tile, tileX, tileY, dropzoneX, dropzoneY, dropzone) {
  // 이동 횟수 증가
  moves++;
  document.getElementById('moves').textContent = `이동 횟수: ${moves}`;
  
  // 올바른 위치에 놓았는지 확인
  if (tileX === dropzoneX && tileY === dropzoneY) {
    // 올바른 위치에 타일 배치
    if (dropzone.classList.contains('dropzone') && !dropzone.hasChildNodes()) {
      dropzone.appendChild(tile);
      tile.style.position = 'relative';
      tile.style.left = '0';
      tile.style.top = '0';
      tile.style.zIndex = '';
      tile.setAttribute('draggable', false);
      
      // 터치 이벤트 제거 (정확한 위치에 배치된 타일)
      tile.removeEventListener('touchstart', touchStart);
      tile.removeEventListener('touchmove', touchMove);
      tile.removeEventListener('touchend', touchEnd);
      
      // 성공 메시지 표시
      showMessage('정확합니다!(Correct)', 'success', 1000);
      
      // 퍼즐 완성 체크
      checkComplete();
    }
  } else {
    // 잘못된 위치에 놓은 경우
    showMessage('다시 시도하세요! (Try again)', 'error', 1000);
    
    // 원래 위치로 복귀
    tile.style.position = '';
    tile.style.left = '';
    tile.style.top = '';
    tile.style.zIndex = '';
    
    // 틀린 위치임을 시각적으로 표시 (흔들림 효과)
    tile.classList.add('wrong');
    setTimeout(() => {
      tile.classList.remove('wrong');
    }, 500);
  }
}

// 토스트 메시지 표시 함수
function showMessage(text, type, duration = 3000) {
  // 기존 메시지 요소가 있으면 제거
  const existingMessage = document.getElementById('message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // 새 토스트 메시지 요소 생성
  const toast = document.createElement('div');
  toast.id = 'message';
  toast.className = `toast-message ${type}`;
  toast.textContent = text;
  
  // body에 추가
  document.body.appendChild(toast);
  
  // 토스트 애니메이션
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 지정된 시간 후 토스트 제거
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300); // 페이드 아웃 애니메이션 시간
  }, duration);
}

function checkComplete() {
  const placedTiles = document.querySelectorAll('.puzzle-board .tile');
  
  // 모든 타일이 배치되었는지 확인
  if (placedTiles.length === gridSize * gridSize) {
    // 타이머 중지
    clearInterval(timerInterval);
    isGameStarted = false;
    
    // 축하 메시지를 토스트로 표시
    showMessage(`축하합니다! (Congratulations) 걸린 시간: ${time}초, 이동 횟수: ${moves}회`, 'success', 5000); // 더 오래 표시
    
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
