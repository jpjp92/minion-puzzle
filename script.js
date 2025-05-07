// script.js

const difficulties = document.querySelectorAll('.difficulty-card');
const startBtn = document.getElementById('start-btn');
const imageSelector = document.getElementById('image-select');
const previewImage = document.getElementById('preview-img');
let selectedDifficulty = 'easy';
let selectedImage = 'image1';

// Handle difficulty selection
difficulties.forEach(card => {
  card.addEventListener('click', () => {
    difficulties.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedDifficulty = card.dataset.difficulty;
  });
});

// Handle image selection
imageSelector.addEventListener('change', (e) => {
  selectedImage = e.target.value;
  previewImage.src = `config/${selectedImage}.jpg`;
});

// Handle game start
startBtn.addEventListener('click', () => {
  console.log(`Start game with difficulty: ${selectedDifficulty}, image: ${selectedImage}`);
  // Add game initialization logic here
});
