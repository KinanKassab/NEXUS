(function () {
  'use strict';

  var CONFIG = {
    accessCode: 'NX-7C4E',
    engineerLocation: 'توجّهوا إلى غرفة الأرشيف في الطابق السفلي، خلف الرفّ رقم ٧ — هناك يوجد المهندس المفقود.',
    cityName: 'مدينة أوركيد'
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
  var clockTime = document.getElementById('clock-time');
  var clockDate = document.getElementById('clock-date');

  document.querySelectorAll('[data-bind="cityName"]').forEach(function (el) {
    el.textContent = CONFIG.cityName;
  });

  String(CONFIG.engineerLocation).split('\n').forEach(function (ln) {
    var div = document.createElement('div');
    div.className = 'location-line';
    div.textContent = ln;
    locationLines.appendChild(div);
  });

  function tick() {
    var now = new Date();
    var timeStr, dateStr;
    try { timeStr = now.toLocaleTimeString('ar-EG', { hour12: false }); } catch (e) { timeStr = now.toTimeString().slice(0, 8); }
    try { dateStr = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { dateStr = now.toDateString(); }
    clockTime.textContent = timeStr;
    clockDate.textContent = dateStr;
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
