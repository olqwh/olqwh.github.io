(function () {
  var KEY = 'olqw-ack-v1';
  var ALLOWED = ['index.html', 'past.html'];

  var params = new URLSearchParams(location.search);
  var next = params.get('next');
  if (ALLOWED.indexOf(next) === -1) next = 'index.html';

  var box = document.getElementById('agree');
  var btn = document.getElementById('continue');

  box.addEventListener('change', function () {
    btn.disabled = !box.checked;
  });

  document.getElementById('ack-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!box.checked) return;
    var saved = false;
    try {
      localStorage.setItem(KEY, 'yes');
      saved = localStorage.getItem(KEY) === 'yes';
    } catch (err) {}
    location.replace(saved ? next : next + '?ack=1');
  });
})();
