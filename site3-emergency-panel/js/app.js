(function () {
  'use strict';

  var CONFIG = {
    accessCode: 'NX-7C4E',
    engineerLocation: 'توجّهوا إلى غرفة الأرشيف في الطابق السفلي، خلف الرفّ رقم ٧ — هناك يوجد المهندس المفقود.',
    cityName: 'مدينة أوركيد',
    countdown: {
      startHour: 16,        // العدّ يبدأ الساعة 4:55 مساءً بالتوقيت المحلّي
      startMinute: 55,
      durationMinutes: 25
    }
  };

  var state = { attempts: 0 };

  var lockedView = document.getElementById('locked-view');
  var solvedView = document.getElementById('solved-view');
  var codeInput = document.getElementById('code-input');
  var submitBtn = document.getElementById('submit-btn');
  var resetBtn = document.getElementById('reset-btn');
  var errorBox = document.getElementById('error-box');
  var attemptsCount = document.getElementById('attempts-count');
  var locationLines = document.getElementById('location-lines');
  var countdownTime = document.getElementById('countdown-time');
  var countdownStatus = document.getElementById('countdown-status');

  document.querySelectorAll('[data-bind="cityName"]').forEach(function (el) {
    el.textContent = CONFIG.cityName;
  });

  String(CONFIG.engineerLocation).split('\n').forEach(function (ln) {
    var div = document.createElement('div');
    div.className = 'location-line';
    div.textContent = ln;
    locationLines.appendChild(div);
  });

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function tick() {
    var now = new Date();
    var cd = CONFIG.countdown;
    var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), cd.startHour, cd.startMinute, 0);
    var end = new Date(start.getTime() + cd.durationMinutes * 60 * 1000);
    var remainingMs, statusStr;

    if (now < start) {
      remainingMs = cd.durationMinutes * 60 * 1000;
      statusStr = 'يبدأ العدّ عند ' + pad2(cd.startHour % 12 || 12) + ':' + pad2(cd.startMinute);
    } else if (now < end) {
      remainingMs = end - now;
      statusStr = 'العدّ التنازلي جارٍ…';
    } else {
      remainingMs = 0;
      statusStr = 'انتهى الوقت';
    }

    var totalSec = Math.ceil(remainingMs / 1000);
    countdownTime.textContent = pad2(Math.floor(totalSec / 60)) + ':' + pad2(totalSec % 60);
    countdownTime.classList.toggle('clock-time--warn', now >= start && totalSec > 0 && totalSec <= 5 * 60);
    countdownStatus.textContent = statusStr;
  }
  tick();
  setInterval(tick, 1000);

  function norm(s) { return (s || '').toUpperCase().replace(/\s+/g, ''); }

  function setError(on) {
    errorBox.hidden = !on;
    codeInput.classList.toggle('is-error', on);
  }

  function submit() {
    var target = norm(CONFIG.accessCode);
    if (target.length && norm(codeInput.value) === target) {
      setError(false);
      lockedView.hidden = true;
      solvedView.hidden = false;
    } else {
      state.attempts += 1;
      attemptsCount.textContent = state.attempts;
      setError(true);
    }
  }

  function reset() {
    codeInput.value = '';
    setError(false);
    solvedView.hidden = true;
    lockedView.hidden = false;
  }

  codeInput.addEventListener('input', function () { setError(false); });
  codeInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  });
  submitBtn.addEventListener('click', submit);
  resetBtn.addEventListener('click', reset);
})();
