// Sends first-time visitors to the intro page. Loaded in <head> so it runs before the page renders.
// Bump the version in KEY (here and in intro.js) to show the intro to everyone again.
(function () {
  var KEY = 'olqw-ack-v1';
  var ok = false;
  try {
    ok = localStorage.getItem(KEY) === 'yes';
  } catch (e) {}
  // Fallback for browsers that block storage: intro.html passes ?ack=1 instead.
  if (!ok && /[?&]ack=1(&|$)/.test(location.search)) ok = true;
  if (!ok) {
    var page = location.pathname.split('/').pop() || 'index.html';
    location.replace('intro.html?next=' + encodeURIComponent(page));
  }
})();
