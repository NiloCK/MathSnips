﻿/// <reference path="MultQuiz.js" />
/// <reference path="../Scripts/moment.js" />


function Question(id, min, max, maxmin, quiz) {
    min = parseInt(min);
    max = parseInt(max);
    maxmin = parseInt(maxmin);
    do {
        this.a = getRandomInt((min), (max) + 1);
        this.b = getRandomInt((min), (max) + 1);
    } while (this.a > (maxmin) || this.b > (maxmin)); 
    if (this.a == 0 || this.a == 1) {
        this.a = getRandomInt(min, max + 1);
    }
    if (this.b == 0 || this.b == 1) {
        this.b = getRandomInt(min, max + 1);
    }

    this.id = id;
    this.quiz = quiz;

    this.correct = null;
    this.dom = null;

    this.getDom = function () {
        if (this.dom){
            return this.dom;
        }

        var ret = document.createElement('div');
        ret.classList = "question complete";
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

function applyJumboStyle(qDiv) {
    var style = new CSSStyleDeclaration();
    
}

Question.prototype.ask = function () {
    this.getDom().className = "question display";
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
    this.getDom().className = "question complete";
    //alert(this.getDom().classList);
    this.quiz.nextQ();
}
Question.prototype.grade = function () {
    this.getDom().style.backgroundColor = this.correct ? 'green' : 'red';
    return this.correct;
}

function Quiz(numQ, min, max, maxmin) {
    this.startTime = new Date();
    this.questions = [];
    this.dom = null;
    for (var i = 0; i < numQ; i++) {
        this.questions.push(new Question(i, min, max, maxmin, this));
    }

    this.getDom = function () {
        if (this.dom) {
            return this.dom;
        }

        var ret = document.createElement('div');
        var title = document.createElement('div');
        title.id = "QuizTitle";
        ret.style.paddingTop = "50px";
        title.innerHTML = "<p>This quiz has <strong>" + this.questions.length +
                          "</strong> questions.</p>";
        title.innerHTML += "<br>"

        var button = document.createElement('button');
        button.innerHTML = "Start the Quiz";
        button.onclick = this.nextQ.bind(this);
        title.appendChild(button);
        ret.appendChild(title);

        button.focus();
        this.dom = ret;
        return ret;
    };
    this.index = 0;

    this.nextQ = function () {
        if (this.index === 0) {
            this.getDom().removeChild(document.getElementById("QuizTitle"));
        }
        if (this.index < this.questions.length) {
            if (this.index >= 1) {
                //this.getDom().removeChild(this.questions[this.index - 1].getDom());
                this.questions[this.index - 1].getDom().style.display = "none";
            }
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
            this.questions[i].getDom().style.display = "inline";
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