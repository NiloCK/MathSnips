

function Fraction(num, den) {
    if (num > den) {
        throw new RangeException();
    }

    this.num = num;
    this.den = den;
}

Fraction.prototype.getCanvasDrawing = function (size) {
    var canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
    var con = canvas.getContext('2d');

    var mid = size / 2;
    var angle = 2 * Math.PI / this.den;

    con.fillStyle = 'orange';

    con.beginPath();
    con.arc(mid, mid, mid, 0, angle * this.num);
    con.fill();

    for (var i = 0; i < this.den; i++) {
        con.beginPath();
        con.moveTo(mid, mid);
        con.lineTo(mid + mid * Math.sin(i * angle), mid + mid * Math.cos(i * angle));
        con.stroke();
    }
    con.beginPath();
    con.arc(mid, mid, mid, 0, 2 * Math.PI);
    con.stroke();

    return canvas;
}