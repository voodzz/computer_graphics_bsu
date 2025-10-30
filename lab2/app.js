const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
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
        cv.equalizeHist(channels.get(i), channels.get(i));
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