let gridSize = 3;
let selectedImage = 'config/image1.jpeg';

function setGridSize(size) {
  gridSize = size;
  document.querySelectorAll('.difficulty-card').forEach(card => card.classList.remove('active'));
  document.getElementById(`size-${size}`).classList.add('active');
}

function changeImage() {
  const select = document.getElementById('image-select');
  selectedImage = `config/${select.value}`;
  document.getElementById('preview-img').src = selectedImage;

  if (gridSize > 0) {
    startGame(); // 선택 시 바로 퍼즐 재생성
  }
}

function startGame() {
  document.getElementById('moves').textContent = '0';
  document.getElementById('timer').textContent = '0s';

  createPuzzleBoard(gridSize, selectedImage);
}

function createPuzzleBoard(size, imageSrc) {
  const tileContainer = document.getElementById('tile-container');
  const puzzleBoard = document.getElementById('puzzle-board');
  tileContainer.innerHTML = '';
  puzzleBoard.innerHTML = '';

  const totalTiles = size * size;
  const indices = Array.from({ length: totalTiles }, (_, i) => i).sort(() => Math.random() - 0.5);

  tileContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  puzzleBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    const x = indices[i] % size;
    const y = Math.floor(indices[i] / size);
    tile.style.backgroundImage = `url('${imageSrc}')`;
    tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
    tile.style.backgroundPosition = `-${x * 100}% -${y * 100}%`;
    tile.style.aspectRatio = '1 / 1';
    tile.draggable = true;
    tileContainer.appendChild(tile);
  }
}
