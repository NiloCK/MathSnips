/// <reference path="MultQuiz.js" />


function Question(id, max, quiz) {
    this.a = getRandomInt(0, parseInt(max) + 1);
    this.b = getRandomInt(0, parseInt(max) + 1);
    this.id = id;
    this.quiz = quiz;

    this.correct = null;
    this.dom = null;

    this.getDom = function () {
        if (this.dom){
            return this.dom;
        }

        var ret = document.createElement('div');
        var multStatement = document.createElement('div');
        multStatement.innerHTML = this.a + ' &times; ' + this.b + " = ";
        ret.appendChild(multStatement);

        var form = document.createElement('form');
        form.style.display = "inline";
        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'q' + this.id;
        form.appendChild(input);
        var submit = document.createElement('button');
        submit.innerHTML = 'Submit';
        form.appendChild(submit);

        var corAns = this.a * this.b;
        form.action = "javascript:void(0);";

        form.onsubmit = this.onAnswer.bind(this);

        ret.appendChild(form);
        ret.className = 'question';

        this.dom = ret;
        return ret;   
    }
}

Question.prototype.onAnswer = function(){
    if (parseInt(document.getElementById('q' + this.id).value) === this.a * this.b) {
        this.correct = true;
        //this.getDom().style.backgroundColor = 'green';
    }
    else {
        this.correct = false;
        //this.getDom().style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    }
    this.quiz.nextQ();
}
Question.prototype.grade = function () {
    this.getDom().style.backgroundColor = this.correct ? 'green' : 'red';
    return this.correct;
}

function Quiz(numQ, max) {
    this.startTime = new Date();
    this.questions = [];
    this.dom = null;
    for (var i = 0; i < numQ; i++) {
        this.questions.push(new Question(i, max, this));
    }

    this.getDom = function () {
        if (this.dom) {
            return this.dom;
        }
        var ret = document.createElement('div');

        this.dom = ret;
        return ret;
    };
    this.index = 0;

    this.nextQ = function () {
        if (this.index < this.questions.length) {
            this.getDom().appendChild(this.questions[this.index].getDom());
            document.getElementById('q' + this.index).focus();
            this.index++;
        } else {
            this.showScore();
        }
    };
    this.showScore = function () {
        var scoreDiv = document.createElement('div');
        var score = 0;

        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i].grade()) {
                score++;
            }
        }
        scoreDiv.innerHTML = "You scored " + score + " out of " + this.questions.length;
        this.getDom().appendChild(scoreDiv);
    };
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}