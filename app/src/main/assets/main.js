var topicData;
var currentQ;
var qidx;
var answers;
var skipped;
var timerId = null;
var startTime = Date.now();
var wrongAnswers = [];


function hideAddr() {
    window.scrollTo(0,0);
    setTimeout(function() { window.scrollTo(0, 1); }, 0);
}


function topicMode(tmode) {
    hideAddr();
    if (tmode) {
        document.getElementById("t-list").classList.remove("hidden");
        document.getElementById("questions").classList.add("hidden");
    }
    else {
        document.getElementById("t-list").classList.add("hidden");
        document.getElementById("questions").classList.remove("hidden");
    }
}

function buildRandomQ() {
    var m = 0, t = 0, k = 0;

    while (m < qidx.length) {
        if (Math.random() * (topicData.length - t) < qidx.length - m)
            qidx[m++] = k;
        k++;
        t++;
    }
}

function formatTime(d) {
    var s, min, sec;
    d = d / 1000.0;
    d = d.toFixed(0);

    min = d > 59 ? Math.floor(d / 60) : 0;
    sec = d % 60;
    s =  min < 10 ? '0' + min : '' + min;
    return s + (sec < 10 ? ':0' + sec : ':' + sec);
}

function timerTick() {
    document.getElementById("q-time").innerHTML=formatTime(Date.now() - startTime);
}

function startTickTimer()
{
    startTime = Date.now();
    document.getElementById("q-time").innerHTML='00:00';
    timerId = window.setInterval(timerTick, 1000);
}

function stopTickTimer() {
    var t = Date.now() - startTime;
    window.clearInterval(timerId);
    return t;
}

function recordAnswer(a)
{
    answers[currentQ] = a;
}

function boolQuestion(q)
{
    if (q.k == 'True' || q.k == 'False')
        return true;
    else
        return false;
}

function answerCount(q)
{
    if (q.D)
        return 4;
    else if (q.C)
        return 3;
    else if (q.B)
        return 2;
    else if (q.A)
        return 1;
    else
        return 0;
}

function askQuestion(idx)
{
    var q = topicData[qidx[idx]];

    skipped[idx] = false;

    if (idx == 0)
    {
        var element = document.getElementById("q-back");
        element.classList.remove("q-back");
        element.classList.add("q-menu");
    }

    if (idx == 1)
    {
        var element = document.getElementById("q-back");
        element.style.visibility='visible';
        element.classList.remove("q-menu");
        element.classList.add("q-back");
    }

    document.getElementById("q-questions").classList.remove("hidden");
    document.getElementById("q-skip").style.visibility="visible";

    // set question
    document.getElementById("q").classList.remove("hidden");
    document.getElementById("q").innerHTML='<div>'+q.q+'</div>';
    document.getElementById("q-answers").classList.add("hidden");
    document.getElementById("q-details").classList.add("hidden");
    document.getElementById("q-details").innerHTML='<h3>Wrong answers</h3><div id="q-wa"></div>';

    if (boolQuestion(q)) {
        document.getElementById("q-options").classList.add("hidden");
        document.getElementById("q-words").classList.add("hidden");
        document.getElementById("q-yes-no").classList.remove("hidden");
    }
    else if (answerCount(q) > 0) {
        document.getElementById("q-words").classList.add("hidden");
        document.getElementById("q-yes-no").classList.add("hidden");
        document.getElementById("q-options").classList.remove("hidden");

        document.getElementById("q-a").innerHTML=q.A ? q.A : '';
        document.getElementById("q-b").innerHTML=q.A ? q.B : '';
        document.getElementById("q-c").innerHTML=q.A ? q.C : '';
        document.getElementById("q-d").innerHTML=q.A ? q.D : '';
    }
    else {
        document.getElementById("q-options").classList.add("hidden");
        document.getElementById("q-yes-no").classList.add("hidden");
        document.getElementById("q-words").classList.remove("hidden");
        document.getElementById("q-input").focus();
        document.getElementById('q-input').value = '';
    }

    document.getElementById("q-num").innerHTML='' + (idx+1);

    hideAddr();
}

function checkAnswer(i)
{
    var q, a, ka, ua, j, k, w = 0;

    q = topicData[qidx[i]];
    a = answers[i];
    if (answerCount(q) == 0) {
        ka = q.k.toLowerCase().split(' ');
        ua = a ? a.toLowerCase().split(' ') : [];

        if (ka.length == ua.length) {
            for (j = 0; j < ka.length; j++) {
                for (k = 0; k < ua.length; k++) {
                    if (ka[j] == ua[k]) {
                        w++;
                        break;
                    }
                }
            }
        }

        if (w == ka.length)
            return true;
    }

    else if (q.k == answers[i])
        return true;

    return false;
}

function showAnswers()
{
    var i, qc = qidx.length;
    var sc = 0, ra = 0;

    stopTickTimer();

    document.getElementById("q-back").classList.remove("q-back");
    document.getElementById("q-back").classList.add("q-menu");
    //document.getElementById("q-back").style.visibility='hidden';

    document.getElementById("q-questions").classList.add("hidden");
    document.getElementById("q-details").classList.add("hidden");
    document.getElementById("q-answers").classList.remove("hidden");

    document.getElementById("q-skip").style.visibility='hidden';

    document.getElementById("q-stime").innerHTML=document.getElementById("q-time").innerHTML;
    document.getElementById("q-total").innerHTML='' + qc;

    for (i = 0; i < qc; i++) {
        if (skipped[i] == true)
            sc++;
        else if (checkAnswer(i))
            ra++;
        else
            wrongAnswers.push(i);
    }

    document.getElementById("q-rimg").classList.remove('s');
    document.getElementById("q-rimg").classList.remove('u');
    document.getElementById("q-rimg").classList.add(ra < qc/2 ? 'u' : 's');

    document.getElementById("q-msg").classList.remove('s');
    document.getElementById("q-msg").classList.remove('u');
    document.getElementById("q-msg").classList.add(ra < qc/2 ? 'u' : 's');

    document.getElementById("q-ok").innerHTML='' + ra;
    document.getElementById("q-wrong").innerHTML='' + (qc - ra - sc);
    document.getElementById("q-skipped").innerHTML='' + sc;

    if (qc == ra)
        document.getElementById("q-show-details").classList.add('hidden');
    else
        document.getElementById("q-show-details").classList.remove('hidden');
}

function topicList() {
    stopTickTimer();
    topicMode(true);
}

function nextQuestion() {
    var mq = qidx.length - 1;
    if (currentQ < mq) {
        currentQ = currentQ + 1;
        askQuestion(currentQ);
    }
    else {
        showAnswers();
    }
}

function prevQuestion() {
    if (currentQ > 0) {
        currentQ = currentQ - 1;
        askQuestion(currentQ);
    }
}

function showTopic(tidx) {

    topicData = questionData[tidx].data;
    currentQ = 0;
    qidx = Array(Math.min(10, topicData.length));
    answers = Array(qidx.length);
    skipped = Array(qidx.length);
    wrongAnswers = [];
    topicMode(false);



    document.getElementById("q-topic").innerHTML=questionData[tidx].title;
    buildRandomQ();
    askQuestion(currentQ);
    startTickTimer();
}

document.getElementById("q-a").addEventListener("click",function(e) {
    recordAnswer("A");
    nextQuestion();
})
document.getElementById("q-b").addEventListener("click",function(e) {
    recordAnswer("B");
    nextQuestion();
})
document.getElementById("q-c").addEventListener("click",function(e) {
    recordAnswer("C");
    nextQuestion();
})
document.getElementById("q-d").addEventListener("click",function(e) {
    recordAnswer("D");
    nextQuestion();
})

document.getElementById("q-yes").addEventListener("click",function(e) {
    recordAnswer('True');
    nextQuestion();
});

document.getElementById("q-no").addEventListener("click",function(e) {
    recordAnswer('False');
    nextQuestion();
});

document.getElementById("q-words-ok").addEventListener("click",function(e) {
    var a = document.getElementById('q-input').value;
    recordAnswer(a);
    nextQuestion();
})

document.getElementById("q-skip").addEventListener("click",function(e) {
    skipped[currentQ] = true;
    nextQuestion();
});

document.getElementById("q-back").addEventListener("click",function(e) {
    if (document.getElementById("q-back").classList.contains('q-back'))
        prevQuestion();
    else
        //topicList();
        window.webkit.messageHandlers.goBack.postMessage('')
});

document.getElementById("q-show-details").addEventListener("click",function(e) {
    var i, q, s = [];

    document.getElementById("q-questions").classList.add('hidden');
    document.getElementById("q-answers").classList.add('hidden');
    document.getElementById("q-details").classList.remove('hidden');

    for (i = 0; i < wrongAnswers.length; i++) {
        q = topicData[qidx[wrongAnswers[i]]];
        s.push('<div>');
            s.push('<div class="t-q">');
            s.push(q.q);
            s.push('</div>');

            s.push('<div class="q-correct"></div>');

            s.push('<div class="q-opt">');
            s.push(answerCount(q) != 0 ? q[q.k]: q.k);
            s.push('</div>');
            s.push('<hr/>')
        s.push('</div>');
    }

    document.getElementById("q-wa").innerHTML=s.join('\n');
});


function initTopicList() {
    var s = [], i;
    for (i = 0; i < questionData.length; i++) {
        s.push('<div class="topic" id="t' + i + '" onclick="showTopic('+ i +')">');
        s.push(questionData[i].title);
        s.push('</div>');
    }

    document.getElementById("t-list").innerHTML=s.join('');

    document.getElementById("q-module").innerHTML=moduleName;
    topicMode(true);
}

initTopicList();
