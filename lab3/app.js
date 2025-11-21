const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const algorithmSelect = document.getElementById('algorithm');
const status = document.getElementById('status');
const gridSizeSlider = document.getElementById('gridSize');

let cellSize = parseInt(gridSizeSlider.value);
let startX = null,
    startY = null;
let endX = null,
    endY = null;

function updateGridSize() {
    cellSize = parseInt(gridSizeSlider.value);
    clearAndDrawGrid();
    startX = startY = endX = endY = null;
    status.textContent = "Нажмите на полотно, чтобы выбрать начальную и конечную точки.";
}

function clearAndDrawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#d3d3d3";

    for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.fillText(x / cellSize, x + 2, 12);
    }

    for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.fillText(y / cellSize, 2, y + 12);
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    if (startX === null && startY === null) {
        startX = x;
        startY = y;
        status.textContent = `Начальная точка выбрана: (${startX}, ${startY}). Выберите конечную точку.`;
    } else {
        endX = x;
        endY = y;
        status.textContent = `Конечная точка выбрана: (${endX}, ${endY}). Нажмите "Нарисовать".`;
    }
    clearAndDrawGrid();
    drawPoint(startX, startY, 'green');
    if (endX !== null && endY !== null) drawPoint(endX, endY, 'red');
});

function drawPoint(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function draw() {
    if (startX === null || startY === null || endX === null || endY === null) {
        status.textContent = "Выберите начальную и конечную точки.";
        return;
    }
    clearAndDrawGrid();
    drawPoint(startX, startY, 'green');
    drawPoint(endX, endY, 'red');

    const algorithm = algorithmSelect.value;
    switch (algorithm) {
        case 'step':
            stepAlgorithm(startX, startY, endX, endY);
            break;
        case 'dda':
            ddaAlgorithm(startX, startY, endX, endY);
            break;
        case 'bresenham':
            bresenhamLine(startX, startY, endX, endY);
            break;
        case 'bresenham_circle':
            bresenhamCircle(startX, startY, Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2));
            break;
    }

    startX = startY = endX = endY = null;
    status.textContent = "Нажмите на полотно, чтобы выбрать начальную и конечную точки.";
}

function stepAlgorithm(x0, y0, x1, y1) {
    ctx.fillStyle = 'black';
    const startTime = performance.now();
    const dx = Math.abs(x1 - x0);
    console.log(`Вычисляем dx: ${dx} клеток`);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    console.log(`Вычисляем dy: ${dy} клеток`);
    const sy = y0 < y1 ? 1 : -1;

    let x = x0,
        y = y0;

    if (dx > dy) {
        console.log(`x - доминирующая ось`);
        let error = dx / 2;
        for (let i = 0; i <= dx; i++) {
            console.log(`Красим клетку (${Math.round(x)} ${Math.round(y)})`);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            x += sx;
            error -= dy;
            if (error < 0) {
                y += sy;
                error += dx;
            }
        }
    } else {
        console.log(`y - доминирующая ось`);
        let error = dy / 2;
        for (let i = 0; i <= dy; i++) {
            console.log(`Красим клетку (${Math.round(x)} ${Math.round(y)})`);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            y += sy;
            error -= dx;
            if (error < 0) {
                x += sx;
                error += dy;
            }
        }
    }
    const endTime = performance.now();
    const averageTime = (endTime - startTime) * 1000;
    console.log(`Время выполнения для пошагового алгоритма: ${averageTime.toFixed(2)} микросекунд`);
}


function ddaAlgorithm(x0, y0, x1, y1) {
    ctx.fillStyle = 'red';
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xIncrement = dx / steps;
    const yIncrement = dy / steps;
    let x = x0,
        y = y0;
    for (let i = 0; i <= steps; i++) {
        ctx.fillRect(Math.round(x) * cellSize, Math.round(y) * cellSize, cellSize, cellSize);
        x += xIncrement;
        y += yIncrement;
    }
}

function bresenhamLine(x0, y0, x1, y1) {
    ctx.fillStyle = 'blue';
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        ctx.fillRect(x0 * cellSize, y0 * cellSize, cellSize, cellSize);
        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function bresenhamCircle(xc, yc, r) {
    ctx.fillStyle = 'brown';
    let x = 0;
    let y = Math.round(r);
    let d = 3 - 2 * r;
    drawCirclePoints(xc, yc, x, y);

    while (y >= x) {
        if (d > 0) {
            d = d + 4 * (x - y) + 10;
            y--;
        } else {
            d = d + 4 * x + 6;
        }
        x++;
        drawCirclePoints(xc, yc, x, y);
    }
}

function drawCirclePoints(xc, yc, x, y) {
    ctx.fillRect((xc + x) * cellSize, (yc + y) * cellSize, cellSize, cellSize);
    ctx.fillRect((xc - x) * cellSize, (yc + y) * cellSize, cellSize, cellSize);
    ctx.fillRect((xc + x) * cellSize, (yc - y) * cellSize, cellSize, cellSize);
    ctx.fillRect((xc - x) * cellSize, (yc - y) * cellSize, cellSize, cellSize);
    ctx.fillRect((xc + y) * cellSize, (yc + x) * cellSize, cellSize, cellSize);
    ctx.fillRect((xc - y) * cellSize, (yc + x) * cellSize, cellSize, cellSize);
    ctx.fillRect((xc + y) * cellSize, (yc - x) * cellSize, cellSize, cellSize);
    ctx.fillRect((xc - y) * cellSize, (yc - x) * cellSize, cellSize, cellSize);
}

const h = window.innerHeight;
const w = window.innerWidth;

let size = 0;
if (w < 1000) {
    size = Math.floor(0.5 * Math.min(h, w));
} else {
    size = Math.floor(0.7 * Math.min(h, w));
}
canvas.width = size;
canvas.height = size;
clearAndDrawGrid();

function testAlgorithms() {
   const numberOfTests = 100000;

   const results = {
       step: [],
       dda: [],
       bresenham: [],
       bresenham_circle: []
   };

   for (let i = 0; i < numberOfTests; i++) {
       const startX = 235;
       const startY = 826;
       const endX = 18923;
       const endY = 16394;

       window.startX = startX;
       window.startY = startY;
       window.endX = endX;
       window.endY = endY;

       for (const algorithm of ['step', 'dda', 'bresenham', 'bresenham_circle']) {
           algorithmSelect.value = algorithm;
           const startTime = performance.now();
           draw();
           const endTime = performance.now();

           const timeTaken = (endTime - startTime) * 1000;
           results[algorithm].push(timeTaken);
       }
   }

   for (const algorithm in results) {
       const averageTime = results[algorithm].reduce((sum, time) => sum + time, 0) / numberOfTests;
       console.log(`Среднее время выполнения для ${algorithm}: ${averageTime.toFixed(2)} микросекунд`);
   }
}