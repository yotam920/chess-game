'use strict';
/**TO DO:
 * הכתרה "לרגלי" 
 * אכילת שחקן יריב
 * בדיקת ניצחון
 * "הצרחה"
 */
// Pieces Types
var KING_WHITE = '♔';
var QUEEN_WHITE = '♕';
var ROOK_WHITE = '♖';
var BISHOP_WHITE = '♗';
var KNIGHT_WHITE = '♘';
var PAWN_WHITE = '♙';
var KING_BLACK = '♚';
var QUEEN_BLACK = '♛';
var ROOK_BLACK = '♜';
var BISHOP_BLACK = '♝';
var KNIGHT_BLACK = '♞';
var PAWN_BLACK = '♟';

// The Chess Board
var gBoard;
var gPrevSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    var size = 8;
    var board = [];
    // build the board 8 * 8
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            if (i === 1) board[i][j] = PAWN_WHITE;
            else if (i === 6) board[i][j] = PAWN_BLACK;
            else board[i][j] = '';
        }
    }
    board[0][0] = board[0][7] = ROOK_WHITE;
    board[0][1] = board[0][6] = KNIGHT_WHITE;
    board[0][2] = board[0][5] = BISHOP_WHITE;
    board[0][3] = KING_WHITE;
    board[0][4] = QUEEN_WHITE;

    board[7][0] = board[7][7] = ROOK_BLACK;
    board[7][1] = board[7][6] = KNIGHT_BLACK;
    board[7][2] = board[7][5] = BISHOP_BLACK;
    board[7][3] = KING_BLACK;
    board[7][4] = QUEEN_BLACK;

    //board[4][4] = KING_BLACK;
    // board[4][4] = QUEEN_BLACK
    // board[4][4] = BISHOP_BLACK;
    // board[4][4] = ROOK_BLACK;
    //board[4][4] = KNIGHT_BLACK

    return board;

}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black';
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" ' +
                'class="    ' + className + '">' + cell + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {
    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        console.log('moving piece!');
        movePiece(gPrevSelectedElCell, elCell);
        cleanBoard();
        return;
    }
    cleanBoard();

    elCell.classList.add('selected');
    gPrevSelectedElCell = elCell;

    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            break;
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord);
            break;
    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
    var fromCoord = getCellCoord(elFromCell.id);
    var toCoord = getCellCoord(elToCell.id);
    var piece = gBoard[fromCoord.i][fromCoord.j];
    gBoard[fromCoord.i][fromCoord.j] = '';
    elFromCell.innerText = '';

    gBoard[toCoord.i][toCoord.j] = piece;
    elToCell.innerText = piece;
}

function markCells(coords) {
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var selector = getSelector(coord);
        var elTd = document.querySelector(selector);
        elTd.classList.add('mark');
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-');
    coord.i = +parts[1]
    coord.j = +parts[2];
    return coord;
}



function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j;
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === '';
}


function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];
    var direction = isWhite ? 1 : -1;
    // add "הכתרה"
    // eat
    res.push({
        i: pieceCoord.i + direction,
        j: pieceCoord.j
    });

    if (isWhite && pieceCoord.i === 1 || !isWhite && pieceCoord.i === 6) {
        res.push({
            i: pieceCoord.i + (direction * 2),
            j: pieceCoord.j
        });
    }
    return res;
}



function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];
    for (var i = pieceCoord.i + 1; i < 8; i++) {
        var coord = { i: i, j: pieceCoord.j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var i = pieceCoord.i - 1; i > -1; i--) {
        var coord = { i: i, j: pieceCoord.j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var j = pieceCoord.j + 1; j < 8; j++) {
        var coord = { i: pieceCoord.i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var j = pieceCoord.j - 1; j > -1; j--) {
        var coord = { i: pieceCoord.i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    var i = pieceCoord.i - 1;
    for (var j = pieceCoord.j + 1; i >= 0 && j < 8; j++) {
        var coord = { i: i--, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i - 1;
    for (var j = pieceCoord.j - 1; i >= 0 && j >= 0; j--) {
        var coord = { i: i--, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j - 1; i < 8 && j >= 0; j--) {
        var coord = { i: i++, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j + 1; i < 8 && j < 8; j++) {
        var coord = { i: i++, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];
    for (var i = pieceCoord.i - 2; i < pieceCoord.i + 3 && pieceCoord.i < 8; i++) {
        if (i < 0 || i >= 8) continue;
        for (var j = pieceCoord.j - 2; j < pieceCoord.j + 3 && pieceCoord.j < 8; j++) {
            if (j < 0 || j >= 8) continue;
            var coord = { i: i, j: j };
            var distans = Math.abs(i - pieceCoord.i) + Math.abs(j - pieceCoord.j);
            if (distans === 3) {
                res.push(coord);
            }
        }
    }
    return res;
}

function getAllPossibleCoordsQueen(pieceCoord) {
    var res = [];
    var resBishop = getAllPossibleCoordsBishop(pieceCoord);
    var resRook = getAllPossibleCoordsRook(pieceCoord);
    res = resBishop.concat(resRook);
    return res;
}

function getAllPossibleCoordsKing(pieceCoord) {
    var res = [];
    for (var i = pieceCoord.i - 1; i < pieceCoord.i + 2 && pieceCoord.i < 8; i++) {
        if (i < 0 || i >= 8) continue;
        for (var j = pieceCoord.j - 1; j < pieceCoord.j + 2 && pieceCoord.j < 8; j++) {
            if (j < 0 || j >= 8) continue;
            var coord = { i: i, j: j };
            if (isEmptyCell(coord)) {
                res.push(coord);
            }
        }
    }
    return res;
}