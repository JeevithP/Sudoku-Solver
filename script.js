// Initialize the `arr` array with DOM elements representing each cell
let arr = [[], [], [], [], [], [], [], [], []];
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);  // Assuming each cell has unique IDs in the format "0", "1", ..., "80"
        
        // Add click event to each cell to allow user to input a number
        arr[i][j].addEventListener('click', () => {
			console.log(selectedNumber);
            if (selectedNumber !== null) {  // Only allow placing a number if one is selected
                if (board[i][j] === 0) {  // Don't overwrite pre-filled cells
                    board[i][j] = selectedNumber;  // Set the selected number in the board
                    arr[i][j].innerText = selectedNumber;  // Update the cell's text in the UI
                }
            }
        });
    }
}

// This will hold the board values fetched from the API
let board = [[], [], [], [], [], [], [], [], []];

// Function to fill the board in the UI
function FillBoard(board) {
	//console.log(board);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';  // Empty cells are represented as empty strings
            }
        }
    }
}

// Button references
let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');
let Reset = document.getElementById('Reset');
let CheckSolution = document.getElementById('CheckSolution');

// Variable to store the selected number
let selectedNumber = null;

// Add event listeners for number buttons
document.querySelectorAll('.number-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        selectedNumber = parseInt(e.target.getAttribute('data-number'));  // Set the selected number
        console.log('Selected Number:', selectedNumber);
    });
});

// Get Puzzle from the API
GetPuzzle.onclick = function () {
    let xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
        let response = JSON.parse(xhrRequest.response);
        console.log(response);

        // Access the board data from the response
        board = response.newboard.grids[0].value;  // This will give you a 9x9 grid of numbers
        FillBoard(board);  // Fill the board in the UI with values from the API
    };
    
    // Correct URL for fetching the puzzle
    xhrRequest.open('get', 'https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}');
    xhrRequest.send();
};

// Solve Puzzle
SolvePuzzle.onclick = () => {
    if (SudokuSolver(board, 0, 0, 9)) {
        FillBoard(board);  // Update the board in the UI after solving
    } else {
        console.log("No solution exists for the given puzzle.");
    }
};

// Reset Puzzle
// Reset Puzzle
Reset.onclick = () => {
    emptyBoard(board);  // Reset the board values to 0
    FillBoard(board);  // Reflect the empty board in the UI

    // Reset any highlighted red background color (e.g., from CheckSolution)
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            arr[i][j].style.backgroundColor = '';  // Clear the background color
        }
    }
};


CheckSolution.onclick = () => {
    let isValidSolution = true;
    console.log(arr);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let value = parseInt(arr[i][j].innerText);

            // Only check cells that are filled (not 0 or empty)
            if (value !== 0) {
                if (!isValid(arr, i, j, value)) {
                    isValidSolution = false;
                    arr[i][j].style.backgroundColor = 'red';  // Highlight invalid cell in red
                } else {
                    arr[i][j].style.backgroundColor = '';  // Reset background color for valid cells
                }
            }
			
        }
    }

    if (isValidSolution) {
        alert("Congratulations! The solution is correct.");
    } else {
        alert("There are errors in your solution. Please check again.");
    }
};

// Sudoku Solver function
function SudokuSolver(board, i, j, n) {
    if (i === n) {
        return true;
    }

    if (j === n) {
        return SudokuSolver(board, i + 1, 0, n);
    }

    if (board[i][j] !== 0) return SudokuSolver(board, i, j + 1, n);

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, i, j, num)) {
            board[i][j] = num;
            if (SudokuSolver(board, i, j + 1, n)) {
                return true;
            }
            board[i][j] = 0; // Reset cell if num does not lead to solution
        }
    }
    return false;
}

// Check if it's valid to place a number at the given cell
function isValid(arr, i, j, num) {
    const n = 9;

    // Check row
    for (let col = 0; col < n; col++) {
        let value = parseInt(arr[i][col].innerText);  // Get the value from arr (user input)
        if (value === num) return false;  // If the number is already in the row, it's not valid
    }

    // Check column
    for (let row = 0; row < n; row++) {
        let value = parseInt(arr[row][j].innerText);  // Get the value from arr (user input)
        if (value === num) return false;  // If the number is already in the column, it's not valid
    }

    // Check 3x3 subgrid
    const subgridStartRow = Math.floor(i / 3) * 3;
    const subgridStartCol = Math.floor(j / 3) * 3;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let value = parseInt(arr[subgridStartRow + row][subgridStartCol + col].innerText);  // Get the value from arr (user input)
            if (value === num) {
                return false;  // If the number is already in the 3x3 subgrid, it's not valid
            }
        }
    }

    return true;
}


// Function to reset the board to all 0s
function emptyBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = 0;
        }
    }
}
