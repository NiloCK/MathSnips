
/**
 * ctor for a Fraction
 * 
 * @constructor
 * @param {(Number|String)} num The Numerator, if an int, or a String represntation. Eg, 3/4
 * @param {Number} [den] The Denominator
 */
function Fraction(num, den) {
    
    if (den === undefined && typeof num === "string") {
        // string constructor
        // todo: better parsing / error handling here.
        var split = num.split('/');
        num = parseInt(split[0], 10);
        den = parseInt(split[1], 10);
    }

    if (num > den) {
        throw new RangeException();
    }

    this.num = num;
    this.den = den;
}

Fraction.prototype.simplify = function () {
    // reduce until no further reductions possible
    while (this.reduce());
}

/**
 * Performs one step of 'reduction' on the fraction.
 * This is not an efficient implementation and should
 * not be used in any 'demanding' scenario.
 * 
 * @returns {Boolean} False if the fraction was in lowest
 * terms before the call to reduce(). True otherwise.
 */
Fraction.prototype.reduce = function () {
    for (var i = 2; i <= this.num && i <= this.den; i++) {
        if (this.num % i === 0 && this.den % i === 0) {
            this.num = this.num / i;
            this.den = this.den / i;

            return true;
        }
    }
    // indicate that the fraction is in lowest terms
    return false;
}

/**
 * Generates an html5 canvas drawing representing the fraction.
 * 
 * @param {int} size The width and height in pixels of the generated canvas element
 * @returns {HTMLElement} A (size) by (size) canvas which represents the fraction.
 */
Fraction.prototype.getCanvasDrawing = function (size) {
    if (size === undefined) {
        console.log("Fraction defaulting to 100 px");
        size = 100;
    }
    
    var canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
    var con = canvas.getContext('2d');

    var mid = size / 2;
    var radius = mid * 0.9;
    var angle = 2 * Math.PI / this.den;

    con.fillStyle = 'orange';

    // the 'arc' fills
    for (var i = 0; i < this.num; i++) {
        con.beginPath();
        con.arc(mid, mid, radius, angle * i, angle * (i + 1));
        con.fill();
    }

    // the 'triangular' segments
    con.beginPath();
    con.moveTo(mid, mid);
    for (var i = 0; i <= this.num; i++) {
        con.lineTo(mid + radius * Math.cos(angle * i),
                   mid + radius * Math.sin(angle * i));
    }
    con.moveTo(mid, mid);
    con.fill();

    // the dividing spokes
    if (this.den > 1) {
        // prevents drawing of 'solitary' spoke in 1/1
        for (var i = 0; i < this.den; i++) {
            con.beginPath();
            con.moveTo(mid, mid);
            con.lineTo(mid + radius * Math.cos(i * angle),
                       mid + radius * Math.sin(i * angle));
            con.stroke();
        }
    }

    // the exterior circle
    con.beginPath();
    con.arc(mid, mid, radius, 0, 2 * Math.PI);
    con.stroke();

    return canvas;
}