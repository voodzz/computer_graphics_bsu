const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const histogramCanvas = document.getElementById('histogramCanvas');
const histCtx = histogramCanvas.getContext('2d');

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            histCtx.clearRect(0, 0, histogramCanvas.width, histogramCanvas.height);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

function drawHistogram(src) {
    if (!src || src.empty()) {
        return;
    }

    histogramCanvas.width = 300;
    histogramCanvas.height = 250;
    histCtx.clearRect(0, 0, histogramCanvas.width, histogramCanvas.height);

    const axisMargin = 20;
    const axisColor = '#333';
    const histWidth = histogramCanvas.width - axisMargin * 2;
    const histHeight = histogramCanvas.height - axisMargin * 2;

    const srcVector = new cv.MatVector();
    srcVector.push_back(src);

    const histSize = [256];
    const ranges = [0, 256];
    const accumulate = false;
    const hist = new cv.Mat();
    const mask = new cv.Mat();
    const colors = ['red', 'green', 'blue'];
    const channelData = [];
    const binWidth = histWidth / histSize[0];

    const channelCount = Math.min(src.channels(), colors.length);

    for (let channel = 0; channel < channelCount; channel++) {
        cv.calcHist(srcVector, [channel], mask, hist, histSize, ranges, accumulate);

        const { maxVal } = cv.minMaxLoc(hist);
        const safeMax = maxVal || 1;
        const normalizedValues = [];

        for (let j = 0; j < histSize[0]; j++) {
            const value = (hist.data32F[j] / safeMax) * histHeight;
            normalizedValues.push(value);
        }

        channelData.push(normalizedValues);
    }

    for (let i = 0; i < channelData.length; i++) {
        histCtx.strokeStyle = colors[i];
        histCtx.lineWidth = 1;
        histCtx.beginPath();

        for (let j = 0; j < histSize[0]; j++) {
            const x = axisMargin + j * binWidth;
            const y = histogramCanvas.height - axisMargin - channelData[i][j];

            if (j === 0) {
                histCtx.moveTo(x, y);
            } else {
                histCtx.lineTo(x, y);
            }
        }

        histCtx.stroke();
    }

    histCtx.strokeStyle = axisColor;
    histCtx.lineWidth = 1.5;
    histCtx.beginPath();
    histCtx.moveTo(axisMargin, axisMargin);
    histCtx.lineTo(axisMargin, histogramCanvas.height - axisMargin);
    histCtx.lineTo(histogramCanvas.width - axisMargin, histogramCanvas.height - axisMargin);
    histCtx.stroke();

    srcVector.delete();
    mask.delete();
    hist.delete();
}

document.getElementById('showHistogramButton').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const rgb = new cv.Mat();

    cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);

    drawHistogram(rgb);

    src.delete();
    rgb.delete();
});

document.getElementById('contrastButton').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    cv.convertScaleAbs(src, dst, 1.5, -64);
    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
});

document.getElementById('rgbHistogramEqualization').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    const channels = new cv.MatVector();
    cv.split(src, channels);

    for (let i = 0; i < channels.size(); i++) {
        if (channels.get(i).channels() === 1) {
            cv.equalizeHist(channels.get(i), channels.get(i));
        }
    }

    cv.merge(channels, dst);
    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
    channels.delete();
});

document.getElementById('hsvHistogramEqualization').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB);
    cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV);

    const channels = new cv.MatVector();
    cv.split(dst, channels);
    cv.equalizeHist(channels.get(2), channels.get(2));

    cv.merge(channels, dst);
    cv.cvtColor(dst, dst, cv.COLOR_HSV2RGB);
    cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
    channels.delete();
});

document.getElementById('blur').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    const ksize = new cv.Size(7, 7);

    cv.blur(src, dst, ksize);

    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
    ksize.delete();
});

document.getElementById('GaussBlur').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    const ksize = new cv.Size(7, 7);

    const sigmaX = 10;
    const sigmaY = 10;

    cv.GaussianBlur(src, dst, ksize, sigmaX, sigmaY);

    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
    ksize.delete();
});