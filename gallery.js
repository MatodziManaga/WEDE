/* ==========================================================
   gallery.js - lightbox for the About page gallery.
   Uses the native <dialog> element (focus trap + Escape close).
   ========================================================== */
(function () {
  'use strict';

  var gallery = document.getElementById('gallery');
  var dialog = document.getElementById('lightbox');
  if (!gallery || !dialog) { return; }

  var img = document.getElementById('lb-img');
  var caption = document.getElementById('lb-caption');
  var buttons = Array.prototype.slice.call(gallery.querySelectorAll('button'));
  var current = 0;
  var opener = null; // remember which thumbnail opened the lightbox so focus can return to it

  function show(index) {
    current = (index + buttons.length) % buttons.length;
    var btn = buttons[current];
    img.src = btn.getAttribute('data-full');
    img.alt = btn.querySelector('img').alt;       // reuse the thumbnail's alt text
    caption.textContent = btn.getAttribute('data-caption'); // textContent avoids HTML injection
  }

  function open(index, trigger) {
    opener = trigger;
    show(index);
    if (typeof dialog.showModal === 'function') { dialog.showModal(); }
    else { dialog.setAttribute('open', ''); } // very old browsers
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () { open(i, btn); });
  });

  document.getElementById('lb-next').addEventListener('click', function () { show(current + 1); });
  document.getElementById('lb-prev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lb-close').addEventListener('click', function () { dialog.close(); });

  // Click on the backdrop (outside the dialog box) closes it
  dialog.addEventListener('click', function (e) {
    var r = dialog.getBoundingClientRect();
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) { dialog.close(); }
  });

  // Arrow keys move between images while the lightbox is open
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { show(current + 1); }
    else if (e.key === 'ArrowLeft') { show(current - 1); }
  });

  // Return focus to the thumbnail that opened the lightbox
  dialog.addEventListener('close', function () { if (opener) { opener.focus(); } });
})();
