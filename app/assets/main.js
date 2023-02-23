
x$(window).load(function() {

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
			x$('#t-list').removeClass('hidden');
			x$('#questions').addClass('hidden');
		}
		else {
			x$('#questions').removeClass('hidden');
			x$('#t-list').addClass('hidden');
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
		x$('#q-time').html(formatTime(Date.now() - startTime));
	}

	function startTickTimer()
	{
		startTime = Date.now();
		x$('#q-time').html('00:00');
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
			x$('#q-back')
				.removeClass('q-back')
				.addClass('q-menu');

		if (idx == 1)
			x$('#q-back')
				.removeClass('q-menu')
				.addClass('q-back');

		x$('#q-questions').removeClass('hidden');
		x$('#q-skip').css({ visibility: 'visible'});

		// set question
		x$('#q').removeClass('hidden');
		x$('#q').html('inner', '<div>' + q.q + '</div>');
		x$('#q-answers', '#q-details').addClass('hidden');
		x$('#q-details').clean();
		x$('#q-details').html('inner', '<h3>Wrong answers</h3><div id="q-wa"></div>');

		if (boolQuestion(q)) {
			x$(['#q-options', '#q-words']).addClass('hidden');
			x$('#q-yes-no').removeClass('hidden');
		}
		else if (answerCount(q) > 0) {
			x$(['#q-words', '#q-yes-no']).addClass('hidden');
			x$('#q-options').removeClass('hidden');

			x$('#q-a').inner(q.A ? q.A : '');
			x$('#q-b').inner(q.B ? q.B : '');
			x$('#q-c').inner(q.C ? q.C : '');
			x$('#q-d').inner(q.D ? q.D : '');
		}
		else {
			x$(['#q-options', '#q-yes-no']).addClass('hidden');
			x$('#q-words').removeClass('hidden');
			document.getElementById('q-input').value = '';
		}

		x$('#q-num').html('' + (idx+1));

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

		x$('#q-back')
			.removeClass('q-back')
			.addClass('q-menu');

		x$('#q-questions', '#q-details').addClass('hidden');
		x$('#q-answers').removeClass('hidden');

		x$('#q-skip').css({ visibility: 'hidden'});

		x$('#q-stime').html(x$('#q-time').html());
		x$('#q-total').html('' + qc);

		for (i = 0; i < qc; i++) {
			if (skipped[i] == true)
				sc++;
			else if (checkAnswer(i))
				ra++;
			else
				wrongAnswers.push(i);
		}

		x$('#q-rimg')
			.removeClass('s')
			.removeClass('u')
			.addClass(ra < qc/2 ? 'u' : 's');

		x$('#q-msg')
			.removeClass('s')
			.removeClass('u')
			.addClass(ra < qc/2 ? 'u' : 's');
		x$('#q-ok').html('' + ra);
		x$('#q-wrong').html('' + (qc - ra - sc));
		x$('#q-skipped').html('' + sc);

		if (qc == ra)
			x$('#q-show-details').addClass('hidden');
		else
			x$('#q-show-details').removeClass('hidden');
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



		x$('#q-topic').html(questionData[tidx].title);
		buildRandomQ();
		askQuestion(currentQ);
		startTickTimer();
	}

	x$('.q-opt').on('click', function(e) {
		var a = this.id.substring(2).toUpperCase();
		recordAnswer(a);
		nextQuestion();
	})

	x$('#q-yes').on('click', function () {
		recordAnswer('True');
		nextQuestion();
	});

	x$('#q-no').on('click', function () {
		recordAnswer('False');
		nextQuestion();
	});

	x$('#q-words-ok').on('click', function () {
		var a = document.getElementById('q-input').value;
		recordAnswer(a);
		nextQuestion();
	})

	x$('#q-skip').on('click', function () {
		skipped[currentQ] = true;
		nextQuestion();
	});

	x$('#q-back').on('click', function() {
		if (x$('#q-back').hasClass('q-back'))
			prevQuestion();
		else
			topicList();
	});

	x$('#q-show-details').on('click', function () {
		var i, q, s = [];

		x$(['#q-questions', '#q-answers']).addClass('hidden');
		x$('#q-details').removeClass('hidden');

		for (i = 0; i < wrongAnswers.length; i++) {
			q = topicData[qidx[wrongAnswers[i]]];
			s.push('<div>');
				s.push('<div class="t-q">');
				s.push(q.q);
				s.push('</div>');

				if (answerCount(q) != 0 && !boolQuestion(q)) {
					s.push('<ul class="q-options">');
					if (q.A)
						s.push('<li class="q-opt">' + q.A + '</li>');
					if (q.B)
						s.push('<li class="q-opt">' + q.B + '</li>');
					if (q.C)
						s.push('<li class="q-opt">' + q.C + '</li>');
					if (q.D)
						s.push('<li class="q-opt">' + q.D + '</li>');
					s.push('</ul>');
				}

				s.push('<div class="q-correct"></div>');

				s.push('<div class="q-opt">');
				s.push(answerCount(q) != 0 ? q[q.k]: q.k);
				s.push('</div>');
				s.push('<hr/>')
			s.push('</div>');
		}

		x$('#q-wa').html(s.join('\n'));
	});


	function initTopicList() {
		var s = [], i;
		for (i = 0; i < questionData.length; i++) {
			s.push('<div class="topic" id="t' + i + '">');
			s.push(questionData[i].title);
			s.push('</div>');
		}

		x$('#t-list').html(s.join(''));

		x$('#t-list .topic').on('click', function (e) {
			var tid = e.target.id.substr(1);
			showTopic(parseInt(tid));
		});

		x$('#q-module').html(moduleName);
		topicMode(true);
	}

	initTopicList();
});

