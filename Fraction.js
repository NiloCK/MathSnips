
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

/**
 * Returns the sum of fractions A and B.
 */
Fraction.sum = function (A,B) {
    Fraction.setCommonDenominators(A, B);
    return new Fraction(A.num + B.num, A.den);
}

/**
 * Finds a common denominator for fractions A and B so that
 * they can be added or subtracted.
 */
Fraction.setCommonDenominators = function (A, B) {
    // todo: this is not how to validate input in js. Fix it.
    //if (typeof A != 'Fraction' || typeof B != 'Fraction') {
    //    throw 1;
    //}

    if (A.den == B.den) {
        return false; // indicate that A and B already had common denominators
    } else {
        // todo: Replace / supplement this with LCM
        var aDen = A.den;
        A.num *= B.den;
        A.den *= B.den;
        B.num *= aDen;
        B.den *= aDen;
        return true;
    }
}

/**
 * Returns simple string representation, eg "3/4"
 */
Fraction.prototype.toString = function () {
    return this.num + "/" + this.den;
}

/**
 * Reduces the fraction to simplest terms
 */
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

            // indicate that the fraction may be
            // able to be reduced further.
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

    // providing a randomized rotation for the drawing.
    // (outputs feel less 'mechanized' this way
    con.translate(mid, mid);
    con.rotate(Math.random() * Math.PI * 2); // param rotate?
    con.translate(-mid, -mid);

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

/**
 * Returns a square-based representation of the fraction.
 */
Fraction.prototype.getSquareCanvasDrawing = function (size) {
    // todo: Do we want the area of a circle representation
    // and a square representation to be equal for a given 'size' input?
    if (!size) { size = 100 }

    var canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
    var con = canvas.getContext('2d');

    con.translate(size / 20, size / 20);
    size = 0.9 * size;

    // The 'filled in' bits
    con.fillStyle = 'orange';
    for (var i = 0; i < this.num; i++) {
        con.fillRect(i * size / this.den, 0, size / this.den, size);
    }

    // The vertical bars
    for (var i = 1; i < this.den; i++) {
        con.beginPath();
        con.moveTo(i * size / this.den, 0);
        con.lineTo(i * size / this.den, size);
        con.stroke();
    }

    // the outer box
    con.strokeRect(0, 0, size, size);

    return canvas;
}