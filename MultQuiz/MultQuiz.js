﻿/// <reference path="../Scripts/jquery-2.1.3.js" />
/// <reference path="../Scripts/moment.js" />

var scores = [];
for (var i = 0; i < 11; i++) {
    scores.push([]);
    for (var j = 0; j < 11; j++) {
        scores[i].push([]);
    }
}

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

    this.userAnswer;
    this.correct = null;

    this.getDom = function () {
        if (this.dom){
            return this.dom;
        }

        var ret = document.createElement('div');
        ret.classList = "question complete";
        var multStatement = document.createElement('div');
        multStatement.innerHTML = this.a + '&nbsp;&times;&nbsp;' + this.b + "&nbsp;=&nbsp;";
        multStatement.style.display = "inline";
        ret.appendChild(multStatement);

        var form = document.createElement('form');
        form.style.display = "inline";
        var input = document.createElement('input');
        input.type = 'number';
        input.autocomplete = 'off';
        input.style.display = "inline";
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
    this.dom = this.getDom();
}

function applyJumboStyle(qDiv) {
    var style = new CSSStyleDeclaration();
    
}

Question.prototype.ask = function () {
    this.getDom().className = "question display";
}

Question.prototype.onAnswer = function(){
    this.userAnswer = parseInt(document.getElementById('q' + this.id).value);
    if (this.userAnswer === this.a * this.b) {
        this.correct = true;
        //this.getDom().style.backgroundColor = 'green';
    }
    else {
        this.correct = false;
        //this.getDom().style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    }
    scores[this.a][this.b].push(this.correct);

    this.getDom().className = "question complete";
    //alert(this.getDom().classList);
    this.quiz.nextQ();
}
Question.prototype.grade = function () {
    this.dom = document.createElement('div');
    this.dom.innerHTML = this.a + "&nbsp;&times;&nbsp;" + this.b +
        "&nbsp;=&nbsp;";
    var ans = document.createElement('span');
    ans.innerHTML = this.userAnswer;
    ans.style.backgroundColor = this.correct ? 'green' : 'red';
    this.dom.appendChild(ans);
    //this.getDom().style.backgroundColor = this.correct ? 'green' : 'red';
    return this.correct;
}

function Quiz(numQ, min, max, maxmin, reset) {
    $('#QuizResults').hide();
    this.min = min;
    this.max = max;
    this.numQ = numQ;
    this.maxmin = maxmin;
    this.startTime = null;
    this.endTime = null;
    this.questions = [];
    this.dom = null;
    for (var i = 0; i < numQ; i++) {
        this.questions.push(new Question(i, min, max, maxmin, this));
    }

    if (reset)
        this.reset();

    this.getDom = function () {
        if (this.dom) {
            return this.dom;
        }

        var ret = document.createElement('div');
        var title = document.createElement('div');
        title.id = "QuizTitle";
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
            // first question - eg, the quiz is starting now.
            this.getDom().removeChild(document.getElementById("QuizTitle"));
            this.startTime = new Date();
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
            this.questions[this.index - 1].getDom().style.display = "none";
            this.showScore();
        }
    };

    this.showScore = function () {
        this.endTime = new Date();
        var scoreDiv = document.createElement('div');
        var score = 0;

        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i].grade()) {
                score++;
            }
            this.getDom().appendChild(this.questions[i].getDom());
        }

        this.appendNewScore(score);
        scoreDiv.innerHTML = "<br>You scored: <strong>" + score + " out of " + this.questions.length +
                             "</strong><br>You took: <strong>" + moment(this.endTime).diff(moment(this.startTime), 'seconds') + " seconds</strong>."
        
        var tryAgain = document.createElement('div');
        tryAgain.innerHTML = "<br>Beat your best score! Beat your best time!";
        var button = document.createElement('button');
        button.onclick = this.constructor.bind(this, this.numQ, this.min, this.max, this.maxmin, true);
        button.innerHTML = 'Try Again!';
        
        tryAgain.appendChild(button);
        scoreDiv.appendChild(tryAgain);
        this.getDom().appendChild(scoreDiv);
    };

    this.appendNewScore = function (score) {
        var scoreRow = document.createElement('tr');
        var rowScore = document.createElement('td');
        rowScore.innerHTML = score + " / " + this.numQ;
        var rowTime = document.createElement('td');
        rowTime.innerHTML = moment(this.endTime).diff(moment(this.startTime), 'seconds') + 's';
        scoreRow.appendChild(rowScore);
        scoreRow.appendChild(rowTime);

        $('#QuizResultsTable').append(scoreRow);
        $('#MainRow').prepend($('#QuizResults'));
        $('#QuizResults').css('display', 'inline');
    }

    this.reset = function () {
        $('#QuizDiv').empty();
        $('#QuizDiv').append(this.getDom());
    }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}