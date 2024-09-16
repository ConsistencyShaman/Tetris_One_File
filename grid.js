const blocksize = 30;
const grid = {
    rows: 20,
    columns: 10,
    blocksize: blocksize
}

const gridPortrait = {
    rows: 40,
    columns: 12,
    blocksize: blocksize
}

// change canvas on screen res
function gridCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (height > 1080) {
        return gridPortrait;
    } else {
        return grid
    }  