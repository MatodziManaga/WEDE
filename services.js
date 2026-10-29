/* ==========================================================
   services.js - dynamic content for services.html
   Loads data/services.json with fetch() (AJAX), builds the cards
   with DOM methods, and supports search, category filter and sort.
   ========================================================== */
(function () {
  'use strict';

  var list = document.getElementById('service-list');
  if (!list) { return; }

  var searchInput = document.getElementById('search');
  var categorySelect = document.getElementById('category');
  var sortSelect = document.getElementById('sort');
  var countEl = document.getElementById('result-count');
  var services = [];

  function formatPrice(item) {
    return item.price === 0 ? 'Free' : 'R' + item.price.toLocaleString('en-ZA');
  }

  // Build one card using createElement + textContent (never innerHTML) so data can't inject markup
  function buildCard(item) {
    var card = document.createElement('article');
    card.className = 'card';

    var badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = item.category;

    var title = document.createElement('h3');
    title.textContent = item.name;

    var desc = document.createElement('p');
    desc.textContent = item.description;

    var price = document.createElement('p');
    var strong = document.createElement('span');
    strong.className = 'price';
    strong.textContent = formatPrice(item);
    price.appendChild(strong);
    price.appendChild(document.createTextNode(' ' + item.priceNote));

    var link = document.createElement('a');
    link.href = 'enquiry.html';
    link.textContent = 'Enquire about ' + item.name.toLowerCase();

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);
    card.appendChild(link);
    return card;
  }

  function render() {
    var query = searchInput.value.trim().toLowerCase();
    var category = categorySelect.value;
    var sort = sortSelect.value;

    var results = services.filter(function (s) {
      var matchesText = !query || (s.name + ' ' + s.description + ' ' + s.category).toLowerCase().indexOf(query) !== -1;
      var matchesCategory = category === 'all' || s.category === category;
      return matchesText && matchesCategory;
    });

    results.sort(function (a, b) {
      switch (sort) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.price - b.price || a.name.localeCompare(b.name);
        case 'price-desc': return b.price - a.price || a.name.localeCompare(b.name);
        default: return a.name.localeCompare(b.name);
      }
    });

    list.textContent = ''; // clear previous cards
    results.forEach(function (s) { list.appendChild(buildCard(s)); });
    countEl.textContent = results.length === 0
      ? 'No services match your search. Try a different word or choose All categories.'
      : 'Showing ' + results.length + ' of ' + services.length + ' services.';
  }

  function fillCategories() {
    var seen = {};
    services.forEach(function (s) {
      if (!seen[s.category]) {
        seen[s.category] = true;
        var opt = document.createElement('option');
        opt.value = s.category;
        opt.textContent = s.category;
        categorySelect.appendChild(opt);
      }
    });
  }

  fetch('data/services.json')
    .then(function (response) {
      if (!response.ok) { throw new Error('HTTP ' + response.status); }
      return response.json();
    })
    .then(function (data) {
      services = data;
      fillCategories();
      render();
    })
    .catch(function () {
      countEl.textContent = 'Sorry, we could not load the services right now. Please refresh the page or contact us.';
    });

  searchInput.addEventListener('input', render);
  categorySelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);
})();
