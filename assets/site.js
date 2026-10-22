(function () {
  'use strict';

  var raw = (typeof ANNOUNCEMENTS !== 'undefined' && Array.isArray(ANNOUNCEMENTS)) ? ANNOUNCEMENTS : [];

  // Parse "YYYY-MM-DD" as a local date (new Date("YYYY-MM-DD") would use UTC and can land on the wrong day).
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.getMonth() === +m[2] - 1 ? d : null;
  }

  function dayKey(d) {
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  var todayKey = dayKey(new Date());

  // Group valid, non-future entries by day, newest day first.
  var groupsByKey = {};
  raw.forEach(function (a, i) {
    var d = a && parseDate(a.date);
    if (!d || !(a.title || a.body)) {
      console.warn('Skipping announcement #' + (i + 1) + ': needs a YYYY-MM-DD date and a title or body.', a);
      return;
    }
    var key = dayKey(d);
    if (key > todayKey) return; // scheduled for a later day
    if (!groupsByKey[key]) groupsByKey[key] = { key: key, date: d, items: [] };
    groupsByKey[key].items.push({ title: String(a.title || ''), body: String(a.body || '') });
  });
  var groups = Object.keys(groupsByKey)
    .map(function (k) { return groupsByKey[k]; })
    .sort(function (a, b) { return b.key - a.key; });

  // Home shows today's group, or the most recent one if nothing is posted today.
  var featured = groups[0] || null;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderItems(items) {
    var list = el('div', 'cards');
    items.forEach(function (item) {
      var card = el('article', 'card');
      if (item.title) card.appendChild(el('h3', 'card-title', item.title));
      if (item.body) card.appendChild(el('p', 'card-body', item.body));
      list.appendChild(card);
    });
    return list;
  }

  function renderGroup(group) {
    var section = el('section', 'day');
    var heading = el('h2', 'day-heading');
    var time = el('time', null, formatDate(group.date));
    var k = String(group.key);
    time.setAttribute('datetime', k.slice(0, 4) + '-' + k.slice(4, 6) + '-' + k.slice(6, 8));
    heading.appendChild(time);
    section.appendChild(heading);
    section.appendChild(renderItems(group.items));
    return section;
  }

  function renderEmpty(target, title, text) {
    var box = el('div', 'empty');
    box.appendChild(el('p', 'empty-title', title));
    if (text) box.appendChild(el('p', 'empty-text', text));
    target.appendChild(box);
  }

  function renderHome(target) {
    if (!featured) {
      renderEmpty(target, 'No announcements have been posted yet.', 'Check back soon.');
      return;
    }
    if (featured.key !== todayKey) {
      target.appendChild(el('p', 'note',
        'Nothing has been posted yet today. Showing the most recent announcements, from ' + formatDate(featured.date) + '.'));
    }
    target.appendChild(renderGroup(featured));
  }

  function renderPast(target, searchInput) {
    var past = groups.filter(function (g) { return g !== featured; });

    function draw() {
      target.textContent = '';
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var shown = past
        .map(function (g) {
          if (!q) return g;
          var items = g.items.filter(function (it) {
            return (it.title + '\n' + it.body).toLowerCase().indexOf(q) !== -1;
          });
          return items.length ? { key: g.key, date: g.date, items: items } : null;
        })
        .filter(Boolean);

      if (!past.length) {
        renderEmpty(target, 'No past announcements yet.', 'Older announcements will appear here automatically.');
      } else if (!shown.length) {
        renderEmpty(target, 'No announcements match your search.');
      } else {
        shown.forEach(function (g) { target.appendChild(renderGroup(g)); });
      }
    }

    if (searchInput) {
      searchInput.disabled = !past.length;
      searchInput.addEventListener('input', draw);
    }
    draw();
  }

  var target = document.getElementById('announcements');
  if (!target) return;
  var page = document.body.getAttribute('data-page');
  if (page === 'home') renderHome(target);
  if (page === 'past') renderPast(target, document.getElementById('search'));
})();
