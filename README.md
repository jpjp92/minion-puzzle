# Minion Puzzle Game

![Minion Puzzle Game](https://img.shields.io/badge/Game-Puzzle-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

A responsive, interactive drag-and-drop puzzle game built with HTML, CSS, and vanilla JavaScript.

## 🎮 Features

- **Multiple Difficulty Levels**: Easy (3×3), Medium (4×4), and Hard (5×5) grid options
- **Image Selection**: Choose from 10 different sports-themed puzzle images
- **Real-time Feedback**: Shows if puzzle pieces are placed correctly or incorrectly
- **Game Statistics**: Tracks elapsed time and number of moves
- **Responsive Design**: Functions on both desktop and mobile devices
- **Touch Support**: Full touch screen support for mobile devices
- **Visual Animations**: Feedback animations for correct and incorrect placements

## 📱 Screenshots
 >  ![image](https://github.com/user-attachments/assets/015169f0-758b-4865-98fe-7397ede5d75c)




## 🛠️ Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- Vanilla JavaScript (ES6+)
- Font Awesome icons

## 📋 Game Instructions

1. **Choose Difficulty Level**: Select from Easy (3×3), Medium (4×4), or Hard (5×5)
2. **Select an Image**: Choose from 10 different sports-themed images
3. **Start the Game**: Click the "Start Game" button
4. **Play**: Drag puzzle pieces from the Pieces area and drop them into the correct positions on the Board
5. **Win**: Complete the puzzle by correctly placing all pieces in their original positions

## 🎯 Game Mechanics

- **Timer**: Starts when the game begins and stops when the puzzle is completed
- **Move Counter**: Counts each time a puzzle piece is placed
- **Feedback**: Visual and text feedback for correct and incorrect placements
- **Completion**: Animation and congratulatory message when the puzzle is solved

## 💻 Technical Implementation

### Core Functions

- `setGridSize(size)`: Changes the difficulty level of the puzzle
- `startGame()`: Initializes the game with the selected difficulty and image
- `setupPuzzle()`: Creates and shuffles puzzle pieces
- `placeTile()`: Handles the logic of placing tiles on the board
- `checkComplete()`: Checks if the puzzle is solved

### Event Handling

- Desktop: Implements standard drag-and-drop API events
- Mobile: Custom touch event handlers for smooth drag-and-drop on touch devices

### Responsive Design

- Adapts to different screen sizes
- Specialized layout for mobile devices
- Dynamic resizing of game elements

## 🔧 Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/minion-puzzle-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd minion-puzzle-game
   ```

3. Open `index.html` in your web browser

*No server or build process required!*



## 📝 Future Enhancements

- Leaderboard with high scores
- More puzzle image options
- Custom image upload feature
- Additional difficulty levels
- Social media sharing

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author
- johnnyworld9278@gmail.com
