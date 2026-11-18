(function () {
  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Menu tabs
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.querySelector('.panel[data-panel="' + tab.dataset.tab + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  // Open / closed status (Westbrook time). Tue–Sat 10am–7pm.
  try {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
    var get = function (type) { return (parts.find(function (p) { return p.type === type; }) || {}).value; };
    var dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var hour = parseInt(get('hour'), 10) % 24;
    var openDay = dayIdx >= 2 && dayIdx <= 6;
    var isOpen = openDay && hour >= 10 && hour < 19;
    var status = document.getElementById('openStatus');
    if (status) {
      status.textContent = isOpen ? 'Open now · until 7pm' : 'Closed now · Tue–Sat 10am–7pm';
      status.classList.add(isOpen ? 'is-open' : 'is-closed');
    }
    var row = document.querySelector('.hours tr[data-day="' + dayIdx + '"]');
    if (row) row.classList.add('today');
  } catch (e) { /* older browsers: keep static hours */ }

  // Inquiry form
  var form = document.getElementById('inquiryForm');
  var msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.phone) {
        msg.className = 'form-msg err';
        msg.textContent = 'Please add your name and phone number.';
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.body.error || 'Something went wrong.');
          form.reset();
          msg.className = 'form-msg ok';
          msg.textContent = 'Got it! We’ll be in touch soon. Need it fast? Call (207) 409-5822.';
        })
        .catch(function (err) {
          msg.className = 'form-msg err';
          msg.textContent = err.message + ' You can also call (207) 409-5822.';
        })
        .finally(function () { btn.disabled = false; btn.textContent = 'Send Request'; });
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
