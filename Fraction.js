﻿

function Fraction(num, den) {
    if (num > den) {
        throw new RangeException();
    }

    this.num = num;
    this.den = den;
}

Fraction.prototype.getCanvasDrawing = function (size) {
    if (size === undefined) {
        console.log("Fraction defaulting to 100 px");
        size = 100;
    }
    // todo: the 'cutoff' effect at the tops and sides is worse as the image shrinks. Fix it.

    var canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
    var con = canvas.getContext('2d');

    var mid = size / 2;
    var radius = mid * 0.95;
    var angle = 2 * Math.PI / this.den;

    con.fillStyle = 'orange';

    // the 'arc' fills
    for (var i = 0; i < this.num; i++) {
        con.beginPath();
        con.arc(mid, mid, mid, angle * i, angle * (i + 1));
        con.fill();
    }

    // the 'triangular' segments
    con.beginPath();
    con.moveTo(mid, mid);
    for (var i = 0; i <= this.num; i++) {
        con.lineTo(mid + mid * Math.cos(angle * i),
                   mid + mid * Math.sin(angle * i));
    }
    con.moveTo(mid, mid);
    con.fill();

    // the dividing spokes
    if (this.den > 1) {
        // prevents drawing of 'solitary' spoke in 1/1
        for (var i = 0; i < this.den; i++) {
            con.beginPath();
            con.moveTo(mid, mid);
            con.lineTo(mid + mid * Math.cos(i * angle), mid + mid * Math.sin(i * angle));
            con.stroke();
        }
    }

    // the exterior circle
    con.beginPath();
    con.arc(mid, mid, mid, 0, 2 * Math.PI);
    con.stroke();

    return canvas;
}