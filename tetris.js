// One file Javascript tetris
// Tetris is simple game
////////////////////////////////////////////////////////////////////////////////////////////
// Data
// Shapes
const shapes = {
    A: [
        [0, 1, 0],
        [1, 0, 1],
        [0, 0, 0]
    ],
    C: [
        [1, 1, 0],
        [1, 0, 0],
        [1, 1, 0]
    ],
    I: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]

    ],
    J: [
        [0, 0, 1],
        [0, 0, 1],
        [0, 1, 1]
    ],
    L: [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0]
    ],
    O: [
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0]
    ],
    P: [
        [1, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [0, 1, 0],
        [1, 1, 0]
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    U: [
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
};

// Colours
const redTones = {
    red: '#FF0000',
    orange: '#FFA500',
    orangeRed: '#FF4500',
    coral: '#FF7F50',
    tomato: '#FF6347',
    goldenRod: 'DAA520'
};
const blueTones = {
    blue: '#0000FF',
    cyan: '#00FFFF',
    indigo: '#4B0082',
    teal: '#008080',
};
const greenTones = {
    green: '#008000',
    lime: '#00FF00',
    seaGreen: '#2E8B57',
    oliveGreen: '#6B8E23'
};

const colours = [redTones, blueTones, greenTones];

////////////////////////////////////////////////////////////////////////////////////////////
// Utils
// Random shape
function randomShape() {

    const keys = Object.keys(shapes);  // Gets the keys from shapes object
    const randomGrab = Math.floor(Math.random() * keys.length);   // Randomly grab one key
    const randomKey = keys[randomGrab]; // Extract the random key
    const shape = {
        key: randomKey,
        value: shapes[randomKey]
    };

    return shape.value

}

// Shapes Random Colour
function generateRandomColour(colour) {
    const keys = Object.keys(colour);
    const randomGrab = Math.floor(Math.random() * keys.length);
    const randomColour = colour[keys[randomGrab]];

    return randomColour
}

function randomColour() {
    // Randomly grab one colour tone
    const randomTone = Math.floor(Math.random() * colours.length);
    const oneTone = colours[randomTone];

    return generateRandomColour(oneTone);
}

////////////////////////////////////////////////////////////////////////////////////////////
// Initialize blocksize and grid
const blockSize = 30;
const grid = {
    rows: 20,
    columns: 10,
    blockSize: blockSize
};

// Set up canvas
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
// Set canvas size based on grid and cell size
canvas.width = grid.columns * grid.blockSize;
canvas.height = grid.rows * grid.blockSize;
// Set up Matrix
const gridMatrix = Array.from({ length: grid.rows }, () => Array(grid.columns).fill(0));
// Set up preview Canvas
const previewCanvas = document.getElementById('preview-canvas');
const previewCanvasContext = previewCanvas.getContext('2d');

////////////////////////////////////////////////////////////////////////////////////////////
// Piece Logic
class Piece {
    constructor(shape, color, grid, context) {
        this.shape = shape;                 // 2D array, represents the shape
        this.color = color;                 // Random color
        this.grid = grid;                   // Size of the grid
        this.context = context;             // Canvas context to draw on 
        this.position = { x: Math.floor(grid.columns / 2) - 1, y: -1 };     // Starting position, top-center
        this.blockSize = grid.blockSize;    // Block size in pixels
        // Matrix 2D Array
        this.gridMatrix = gridMatrix;
    }

    // Method to draw the piece
    draw() {
        this.context.fillStyle = this.color;

        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) { // If cell is 1, draw a block
                    this.context.fillRect(
                        (this.position.x + col) * this.blockSize,
                        (this.position.y + row) * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                    // Add a border for better visibility and style
                    this.context.strokeStyle = '#000';
                    this.context.strokeRect(
                        (this.position.x + col) * this.blockSize,
                        (this.position.y + row) * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                }
            }
        }
    }

    // Draw preview
    drawPreview(ctx, canvasSize) {
        const scale = canvasSize / (this.shape[0].length * this.grid.blocksize);
        ctx.scale(scale, scale);
        ctx.fillStyle = this.color;

        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillRect(
                        x * this.grid.blockSize,
                        y * this.grid.blockSize,
                        this.grid.blockSize,
                        this.grid.blockSize
                    )
                }
            });
        });
        
        ctx.scale(1 / scale, 1 / scale); // Reset scale
    }

    // Check movement
    canMove(dx, dy) {
        return this.shape.every((row, rowIndex) =>
            row.every((value, colIndex) => {
                if (value) {
                    const newX = this.position.x + colIndex + dx;
                    const newY = this.position.y + rowIndex + dy;

                    // Check grid boundaries
                    if (newX < 0 || newX >= this.grid.columns || newY < 0 || newY >= this.grid.rows) {
                        return false;
                    }

                    if (this.gridMatrix[newY] && this.gridMatrix[newY][newX]) {
                        return false
                    }
                }
                return true;
            }))
    }

    // Merge Pieces
    merge() {
        this.shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    const x = this.position.x + colIndex;
                    const y = this.position.y + rowIndex;
                    if (y >= 0) {
                        this.gridMatrix[y][x] = this.color;
                    }
                }
            })
        })
    }

    // Moving methods
    moveDown() {
        if (this.canMove(0, 1)) {
            this.position.y++
            return true;
        }
        return false;
    }

    moveLeft() {
        if (this.canMove(-1, 0)) {
            this.position.x--
        }
    }

    moveRight() {
        if (this.canMove(1, 0)) {
            this.position.x++
        }
    }

    rotate() {
        const newShape = this.shape[0].map((_, index) =>
            this.shape.map(row => row[index]).reverse())

        const oldShape = this.shape;
        this.shape = newShape;

        // Check if the newShape fits on the grid
        if (!this.canMove(0, 0)) {
            this.shape = oldShape
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
// Game state
class Game {
    constructor(grid, context) {
        this.grid = grid;
        this.context = context;
        // Preview Canvas
        this.previewCanvas = previewCanvas;
        this.previewCanvasContext = previewCanvasContext;
        // Piece
        this.currentPiece = null;
        this.nextPiece = null;
        // State
        this.score = 0;
        this.gameInterval = null;
        // Matrix 2D Array
        this.gridMatrix = gridMatrix;
        // Speed adjuster
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValue = document.getElementById('speed-value');
        this.currentSpeed = 500;
        this.speed();
        // Bind keys controls
        this.bindKeys();
        // Bind touch controls (mobile)
        this.bindTouchControls();
        // Restart game (without reload page)
        this.restartGame();
        // Fullscreen Button
        this.fullscreen();
    }
    // -----------------------------------------------------------------
    // Controls
    // Fullscreen btn
    fullscreen() {
        const fullscreen = document.getElementById('fullscreen-btn');
        const gameContainer = document.getElementById('game-container');
        fullscreen.addEventListener('click', (event) => {
            if (document.fullscreenElement) {
                // If there's a fullscreen element, exit fullscreen
                document.exitFullscreen();
                return;
            }
            // Make the game-container div fullscreen
            gameContainer.requestFullscreen();
        });
    }
    // Speed adjuster
    speed() {
        this.speedSlider.min = 100;
        this.speedSlider.max = 1000;
        this.speedSlider.step = 100;
        this.speedSlider.value = this.currentSpeed;
        this.speedValue.textContent = this.currentSpeed;

        this.speedSlider.addEventListener('input', (event) => {
            this.currentSpeed = parseInt(event.target.value);
            this.speedValue.textContent = this.currentSpeed;
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.emptyScore();
                this.currentPiece = null;
                this.emptyMatrix();
                this.startGame();
            }
        })
    }
    // Bind touch controls
    bindTouchControls() {
        document.getElementById('left-btn').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.currentPiece.moveLeft();
        });
        document.getElementById('right-btn').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.currentPiece.moveRight();
        })
        document.getElementById('down-btn').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.currentPiece.moveDown();
        })
        document.getElementById('up-btn').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.currentPiece.rotate();
        })
    }
    // Bind keys for movement
    bindKeys() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.currentPiece.moveLeft();
            } else if (event.key === 'ArrowRight') {
                this.currentPiece.moveRight();
            } else if (event.key === 'ArrowDown') {
                this.currentPiece.moveDown();
            } else if (event.key === 'ArrowUp') {
                this.currentPiece.rotate();
            }

        });
    }
    // Restart game (without reload page)
    restartGame() {
        document.getElementById('restart-btn').addEventListener('click', () => {
            clearInterval(this.gameInterval);
            this.emptyScore();
            this.currentPiece = null;
            this.emptyMatrix()

            // Start game
            this.startGame()
        });
    }
    // -----------------------------------------------------------------
    // Renderer methods
    // Draw grid lines (guides)
    drawGridLines() {
        this.context.strokeStyle = '#444';
        this.context.lineWidth = 0.5;

        // Draw vertical
        for (let x = 0; x <= canvas.width; x += grid.blockSize) {
            this.context.beginPath();                // Start a new path
            this.context.moveTo(x, 0);               // Move to the start point
            this.context.lineTo(x, canvas.height);   // Draw a line to the end point
            this.context.stroke();                   // Render path
        }

        // Draw horizontal
        for (let y = 0; y <= canvas.height; y += grid.blockSize) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(canvas.width, y);
            this.context.stroke();
        }
    }
    // Spawn a new piece
    spawnPiece() {
        this.currentPiece = this.nextPiece || new Piece(randomShape(), randomColour(), this.grid, this.context);
        this.nextPiece = new Piece(randomShape(), randomColour(), this.grid, this.context);
        this.drawNextPiece()
    }
    // Draw next Piece
    drawNextPiece() {
        this.previewCanvasContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        this.nextPiece.drawPreview(this.previewCanvasContext, this.previewCanvas.width);
    }
    // Draw stacked pieces
    drawFixedPieces() {
        // Iterate over each row in the matrix
        this.gridMatrix.forEach((row, rowIndex) => {
            // Iterate over each column in the matrix
            row.forEach((color, colIndex) => {
                if (color) { // Check if the cell is not empty
                    // Set the fill colour
                    this.context.fillStyle = color;

                    // Draw cell
                    this.context.fillRect(
                        colIndex * this.grid.blockSize, // X
                        rowIndex * this.grid.blockSize, // Y
                        this.grid.blockSize,            // Width
                        this.grid.blockSize             // Height 
                    );

                    // Draw border of the cell
                    this.context.strokeStyle = '#000';
                    this.context.strokeRect(
                        colIndex * this.grid.blockSize,
                        rowIndex * this.grid.blockSize,
                        this.grid.blockSize,
                        this.grid.blockSize
                    );
                }
            });
        });
    }
    // -----------------------------------------------------------------
    // Game State Methods
    // Check if line is full
    isLineFull(row) {
        return this.gridMatrix[row].every(cell => cell !== 0);
    }
    // Clear a full line
    clearLine(row) {
        // Remove the full line
        this.gridMatrix.splice(row, 1);
        // Add a new empty line at the top
        this.gridMatrix.unshift(new Array(this.grid.columns).fill(0));
    }
    // Clear lines and update score
    clearLines() {
        let linesCleared = 0;

        // Detect and clear full lines
        for (let row = this.grid.rows - 1; row >= 0; row--) {
            if (this.isLineFull(row)) {
                this.clearLine(row);
                linesCleared++;
                row++ // Recheck the current row after clearing
            }
        }

        // Update score
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
        }
    }
    // Update game score
    updateScore(linesCleared) {
        const points = linesCleared * 100;
        this.score += points;

        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Score: ${this.score}`;
    }
    // Update game state
    update() {
        // Handle piece movement, collision, stack
        if (!this.currentPiece.moveDown()) {
            this.currentPiece.merge();
            this.clearLines(); // Check for completed lines, clear if true
            this.spawnPiece(); // Spawn new piece after one lands

            console.log('Updated')

            // Check if new piece can move
            if (!this.currentPiece.canMove(0, 1)) {
                document.getElementById('game-over').style.visibility = 'visible'
                clearInterval(this.gameInterval);
                console.log('Cleared?')
                return;
            }
        }
    }
    // Empty the matrix
    emptyMatrix() {
        for (let x = 0; x < this.grid.rows; x++) {
            for (let y = 0; y < this.grid.columns; y++) {
                this.gridMatrix[x][y] = 0;
            }
        }
        console.log('Matrix Cleared');
    }
    // Empty the score
    emptyScore() {
        this.score = 0

        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Score: ${this.score}`;
    }
    // -----------------------------------------------------------------
    // Game loop and initialization
    // Game loop
    gameLoop() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.drawGridLines()
        this.update(); // update method to handle game state
        this.drawFixedPieces();
        this.currentPiece.draw();
    }

    // Start the game
    startGame() {
        document.getElementById('game-over').style.visibility = 'hidden';
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.spawnPiece();
        this.gameInterval = setInterval(() => this.gameLoop(), this.currentSpeed);
        console.log('Game Started!')
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
// Initialize the game
const game = new Game(grid, context);

// Start Game
game.startGame();
