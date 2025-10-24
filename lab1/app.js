const colorInput = document.getElementById('color');
const rInput = document.getElementById('r');
const gInput = document.getElementById('g');
const bInput = document.getElementById('b');
const rRange = document.getElementById('r-range');
const gRange = document.getElementById('g-range');
const bRange = document.getElementById('b-range');

const cInput = document.getElementById('c');
const mInput = document.getElementById('m');
const yInput = document.getElementById('y');
const kInput = document.getElementById('k');
const cRange = document.getElementById('c-range');
const mRange = document.getElementById('m-range');
const yRange = document.getElementById('y-range');
const kRange = document.getElementById('k-range');

const hInput = document.getElementById('h');
const sInput = document.getElementById('s');
const vInput = document.getElementById('v');
const hRange = document.getElementById('h-range');
const sRange = document.getElementById('s-range');
const vRange = document.getElementById('v-range');

function updateAllRGB() {
    colorInput.value = rgbToHex(rInput.value, gInput.value, bInput.value);

    const cmyk = rgbToCmyk(rInput.value, gInput.value, bInput.value);
    [cInput.value, mInput.value, yInput.value, kInput.value] = cmyk;
    [cRange.value, mRange.value, yRange.value, kRange.value] = cmyk;

    const hsv = rgbToHsv(rInput.value, gInput.value, bInput.value);
    [hInput.value, sInput.value, vInput.value] = hsv;
    [hRange.value, sRange.value, vRange.value] = hsv;

    rRange.value = rInput.value;
    gRange.value = gInput.value;
    bRange.value = bInput.value;
}

function updateAllCMYK() {
    const c = parseFloat(cInput.value);
    const m = parseFloat(mInput.value);
    const y = parseFloat(yInput.value);
    const k = parseFloat(kInput.value);

    const [r, g, b] = cmykToRgb(c, m, y, k);
    rInput.value = r;
    gInput.value = g;
    bInput.value = b;
    rRange.value = r;
    gRange.value = g;
    bRange.value = b;

    colorInput.value = cmykToHex(c, m, y, k);

    const [h, s, v] = cmykToHsv(c, m, y, k);
    hInput.value = h;
    sInput.value = s;
    vInput.value = v;
    hRange.value = h;
    sRange.value = s;
    vRange.value = v;

    cRange.value = c;
    mRange.value = m;
    yRange.value = y;
    kRange.value = k;
}

function updateAllHSV() {
    let h = parseFloat(hInput.value);
    let s = parseFloat(sInput.value);
    let v = parseFloat(vInput.value);

    const [r, g, b] = hsvToRgb(h, s, v);
    rInput.value = r;
    gInput.value = g;
    bInput.value = b;
    rRange.value = r;
    gRange.value = g;
    bRange.value = b;

    colorInput.value = hsvToHex(h, s, v);

    const [c, m, y, k] = hsvToCmyk(h, s, v);
    cInput.value = c;
    mInput.value = m;
    yInput.value = y;
    kInput.value = k;
    cRange.value = c;
    mRange.value = m;
    yRange.value = y;
    kRange.value = k;

    hRange.value = h;
    sRange.value = s;
    vRange.value = v;
}


function cmykToRgb(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return [Math.round(r), Math.round(g), Math.round(b)];
}

function cmykToHex(c, m, y, k) {
    const [r, g, b] = cmykToRgb(c, m, y, k);
    return rgbToHex(r, g, b);
}


function cmykToHsv(c, m, y, k) {
    const [r, g, b] = cmykToRgb(c, m, y, k);
    return rgbToHsv(r, g, b);
}

function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let rPrime, gPrime, bPrime;

    if (h >= 0 && h < 60) {
        rPrime = c;
        gPrime = x;
        bPrime = 0;
    } else if (h >= 60 && h < 120) {
        rPrime = x;
        gPrime = c;
        bPrime = 0;
    } else if (h >= 120 && h < 180) {
        rPrime = 0;
        gPrime = c;
        bPrime = x;
    } else if (h >= 180 && h < 240) {
        rPrime = 0;
        gPrime = x;
        bPrime = c;
    } else if (h >= 240 && h < 300) {
        rPrime = x;
        gPrime = 0;
        bPrime = c;
    } else {
        rPrime = c;
        gPrime = 0;
        bPrime = x;
    }

    const r = Math.round((rPrime + m) * 255);
    const g = Math.round((gPrime + m) * 255);
    const b = Math.round((bPrime + m) * 255);

    return [Math.round(r), Math.round(g), Math.round(b)];
}

function hsvToHex(h, s, v) {
    const [r, g, b] = hsvToRgb(h, s, v);
    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

function hsvToCmyk(h, s, v) {
    const [r, g, b] = hsvToRgb(h, s, v);
    return rgbToCmyk(Math.round(r), Math.round(g), Math.round(b));
}

function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + +b).toString(16).slice(1).toUpperCase();
}

function rgbToCmyk(r, g, b) {
    let rNorm = r / 255;
    let gNorm = g / 255;
    let bNorm = b / 255;

    let k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return [0, 0, 0, 100];

    let c = (1 - rNorm - k) / (1 - k);
    let m = (1 - gNorm - k) / (1 - k);
    let y = (1 - bNorm - k) / (1 - k);

    return [
        Math.round(c * 100),
        Math.round(m * 100),
        Math.round(y * 100),
        Math.round(k * 100)
    ];
}


function rgbToHsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs);
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    if (diff === 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

colorInput.addEventListener('input', function () {
    const hex = colorInput.value;
    [rInput.value, gInput.value, bInput.value] = hexToRgb(hex);
    updateAllRGB();
});

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [Math.round(r), Math.round(g), Math.round(b)];
}

function handleRgbChange() {
    updateAllRGB();
}

function handleCMYKChange() {
    updateAllCMYK();
}

function handleHSVChange() {
    updateAllHSV();
}

rRange.addEventListener('input', function () {
    rInput.value = rRange.value;
    handleRgbChange();
});

gRange.addEventListener('input', function () {
    gInput.value = gRange.value;
    handleRgbChange();
});

bRange.addEventListener('input', function () {
    bInput.value = bRange.value;
    handleRgbChange();
});

rInput.addEventListener('input', function () {
    let value = parseInt(rInput.value);
    if (value < 0) {
        rInput.value = 0;
    } else if (value > 255) {
        rInput.value = 255;
    }
    rRange.value = rInput.value;
    handleRgbChange();
});

gInput.addEventListener('input', function () {
    let value = parseInt(gInput.value);
    if (value < 0) {
        gInput.value = 0;
    } else if (value > 255) {
        gInput.value = 255;
    }
    gRange.value = gInput.value;
    handleRgbChange();
});

bInput.addEventListener('input', function () {
    let value = parseInt(bInput.value);
    if (value < 0) {
        bInput.value = 0;
    } else if (value > 255) {
        bInput.value = 255;
    }
    bRange.value = bInput.value;
    handleRgbChange();
});


cRange.addEventListener('input', function () {
    cInput.value = cRange.value;
    handleCMYKChange();
});

mRange.addEventListener('input', function () {
    mInput.value = mRange.value;
    handleCMYKChange();
});

yRange.addEventListener('input', function () {
    yInput.value = yRange.value;
    handleCMYKChange();
});

kRange.addEventListener('input', function () {
    kInput.value = kRange.value;
    handleCMYKChange();
});

cInput.addEventListener('input', function () {
    let value = parseInt(cInput.value);
    if (value < 0) {
        cInput.value = 0;
    } else if (value > 100) {
        cInput.value = 100;
    }
    cRange.value = cInput.value;
    handleCMYKChange();
});

mInput.addEventListener('input', function () {
    let value = parseInt(mInput.value);
    if (value < 0) {
        mInput.value = 0;
    } else if (value > 100) {
        mInput.value = 100;
    }
    mRange.value = mInput.value;
    handleCMYKChange();
});

yInput.addEventListener('input', function () {
    let value = parseInt(yInput.value);
    if (value < 0) {
        yInput.value = 0;
    } else if (value > 100) {
        yInput.value = 100;
    }
    yRange.value = yInput.value;
    handleCMYKChange();
});

kInput.addEventListener('input', function () {
    let value = parseInt(kInput.value);
    if (value < 0) {
        kInput.value = 0;
    } else if (value > 100) {
        kInput.value = 100;
    }
    kRange.value = kInput.value;
    handleCMYKChange();
});

hRange.addEventListener('input', function () {
    hInput.value = hRange.value;
    handleHSVChange();
});

sRange.addEventListener('input', function () {
    sInput.value = sRange.value;
    handleHSVChange();
});

vRange.addEventListener('input', function () {
    vInput.value = vRange.value;
    handleHSVChange();
});

hInput.addEventListener('input', function () {
    let value = parseInt(hInput.value);
    if (value < 0) {
        hInput.value = 0;
    } else if (value > 360) {
        hInput.value = 360;
    }
    hRange.value = hInput.value;
    handleHSVChange();
});

sInput.addEventListener('input', function () {
    let value = parseInt(sInput.value);
    if (value < 0) {
        sInput.value = 0;
    } else if (value > 100) {
        sInput.value = 100;
    }
    sRange.value = sInput.value;
    handleHSVChange();
});

vInput.addEventListener('input', function () {
    let value = parseInt(vInput.value);
    if (value < 0) {
        vInput.value = 0;
    } else if (value > 100) {
        vInput.value = 100;
    }
    vRange.value = vInput.value;
    handleHSVChange();
});

document.addEventListener("DOMContentLoaded", () => {
    colorInput.value = rgbToHex(0, 0, 0)
});

document.addEventListener('DOMContentLoaded', function() {
    cInput.value = 0;
    mInput.value = 29;
    yInput.value = 14;
    kInput.value = 37;

    handleCMYKChange();
});