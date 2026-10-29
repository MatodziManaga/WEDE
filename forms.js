/* ==========================================================
   forms.js - client-side validation for enquiry.html and contact.html
   - Custom JavaScript validation (formats, lengths, dates)
   - Inline error messages (aria-live) and focus on the first error
   - Enquiry form: AJAX with fetch() -> data/enquiry-rates.json,
     then shows a cost + availability response
   - Contact form: compiles a validated email (mailto link to the
     recipient set in RECIPIENT) and, if FORM_ENDPOINT is set,
     also posts the data asynchronously with fetch().
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Configuration ---------- */
  var RECIPIENT = 'hello@ubuntupaws.example'; // recipient of contact emails (fictional address, change to a real one)
  var FORM_ENDPOINT = '';                     // optional: URL of a form service (e.g. Netlify Forms / Formspree); '' = mailto only

  /* ---------- Shared helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function trim(v) { return (v || '').replace(/^\s+|\s+$/g, ''); }

  function setError(id, message) {
    var input = $(id);
    var wrapper = input.closest('.field');
    var out = $(id + '-error');
    if (out) { out.textContent = message; }
    wrapper.classList.toggle('invalid', !!message);
    if (message) { input.setAttribute('aria-invalid', 'true'); }
    else { input.removeAttribute('aria-invalid'); }
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var NAME_RE = /^[A-Za-zÀ-ɏ' -]+$/;
  // South African numbers: 0 or +27 followed by 9 digits (spaces, dashes and brackets are ignored)
  var PHONE_RE = /^(?:\+27|0)\d{9}$/;

  var rules = {
    name: function (v) {
      v = trim(v);
      if (!v) { return 'Please enter your name.'; }
      if (v.length < 2 || v.length > 60) { return 'Your name must be between 2 and 60 characters.'; }
      if (!NAME_RE.test(v)) { return 'Use letters, spaces, hyphens and apostrophes only.'; }
      return '';
    },
    email: function (v) {
      v = trim(v);
      if (!v) { return 'Please enter your email address.'; }
      if (!EMAIL_RE.test(v)) { return 'Enter a valid email address, for example name@example.com.'; }
      return '';
    },
    phone: function (v, optional) {
      v = trim(v);
      if (!v) { return optional ? '' : 'Please enter your phone number.'; }
      if (!PHONE_RE.test(v.replace(/[\s\-()]/g, ''))) { return 'Enter a valid South African number, for example 082 123 4567 or +27 82 123 4567.'; }
      return '';
    },
    required: function (label) {
      return function (v) { return v ? '' : 'Please choose ' + label + '.'; };
    },
    length: function (label, min, max) {
      return function (v) {
        v = trim(v);
        if (!v) { return 'Please enter ' + label + '.'; }
        if (v.length < min) { return 'Please write at least ' + min + ' characters (you have ' + v.length + ').'; }
        if (v.length > max) { return 'Please keep this under ' + max + ' characters.'; }
        return '';
      };
    }
  };

  // Parse yyyy-mm-dd as a LOCAL date (new Date('2026-01-05') would be UTC and can shift the day)
  function parseDate(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) { return null; }
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return (d.getFullYear() === +m[1] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[3]) ? d : null;
  }

  function validateDate(value) {
    if (!value) { return 'Please choose a date.'; }
    var d = parseDate(value);
    if (!d) { return 'Enter a valid date.'; }
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    var limit = new Date(today); limit.setFullYear(today.getFullYear() + 1);
    if (d < tomorrow) { return 'Please choose a date from tomorrow onwards.'; }
    if (d > limit) { return 'Please choose a date within the next 12 months.'; }
    return '';
  }

  function validateQuantity(value) {
    if (value === '') { return 'Please enter a number.'; }
    var n = Number(value);
    if (!/^\d+$/.test(String(value)) || n < 1 || n > 50) { return 'Enter a whole number between 1 and 50.'; }
    return '';
  }

  /* Wire up a form: schema = [{ id, check: function(value) -> message }] */
  function wire(form, schema, onValid) {
    function valueOf(id) {
      var el = $(id);
      return el.type === 'checkbox' ? el.checked : el.value;
    }
    function checkOne(item) {
      var msg = item.check(valueOf(item.id));
      setError(item.id, msg);
      return msg;
    }
    schema.forEach(function (item) {
      var el = $(item.id);
      el.addEventListener('blur', function () { checkOne(item); });
      el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', function () {
        // Re-check live only once a field has already been flagged, so we don't nag while typing
        if (el.closest('.field').classList.contains('invalid')) { checkOne(item); }
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      schema.forEach(function (item) {
        if (checkOne(item) && !firstBad) { firstBad = item.id; }
      });
      if (firstBad) { $(firstBad).focus(); return; }
      onValid();
    });
  }

  function counter(textareaId, countId, max, min) {
    var ta = $(textareaId), out = $(countId);
    if (!ta || !out) { return; }
    function update() { out.textContent = ta.value.length + ' / ' + max + ' characters (minimum ' + min + ')'; }
    ta.addEventListener('input', update);
    update();
  }

  function showResponse(box, build, failed) {
    box.textContent = '';
    box.classList.toggle('fail', !!failed);
    build(box);
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function el(tag, text, className) {
    var n = document.createElement(tag);
    if (text !== undefined) { n.textContent = text; }
    if (className) { n.className = className; }
    return n;
  }

  /* ==========================================================
     ENQUIRY FORM (enquiry.html)
     ========================================================== */
  var enquiryForm = $('enquiry-form');
  if (enquiryForm) {
    // Set the earliest selectable date in the date picker (tomorrow)
    var dateInput = $('preferredDate');
    var t = new Date(); t.setDate(t.getDate() + 1);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    dateInput.min = t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate());

    counter('message', 'message-count', 500, 10);

    wire(enquiryForm, [
      { id: 'fullName', check: rules.name },
      { id: 'email', check: rules.email },
      { id: 'phone', check: function (v) { return rules.phone(v, false); } },
      { id: 'enquiryType', check: rules.required('what you would like to enquire about') },
      { id: 'preferredDate', check: validateDate },
      { id: 'quantity', check: validateQuantity },
      { id: 'message', check: rules.length('a message', 10, 500) },
      { id: 'consent', check: function (checked) { return checked ? '' : 'Please tick the box so we may contact you.'; } }
    ], submitEnquiry);

    function submitEnquiry() {
      var box = $('enquiry-response');
      var button = enquiryForm.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Checking...';

      var data = {
        name: trim($('fullName').value),
        email: trim($('email').value),
        type: $('enquiryType').value,
        date: parseDate($('preferredDate').value),
        qty: parseInt($('quantity').value, 10)
      };

      // AJAX: load the rate table asynchronously, then compute the response (no page reload)
      fetch('data/enquiry-rates.json')
        .then(function (r) {
          if (!r.ok) { throw new Error('HTTP ' + r.status); }
          return r.json();
        })
        .then(function (rates) {
          var info = rates[data.type];
          if (!info) { throw new Error('Unknown enquiry type'); }
          showResponse(box, function (b) { buildEnquiryResponse(b, data, info); }, false);
        })
        .catch(function () {
          showResponse(box, function (b) {
            b.appendChild(el('h2', 'Sorry, something went wrong'));
            b.appendChild(el('p', 'We could not check availability right now. Please try again, or use the contact page to reach us.'));
          }, true);
        })
        .then(function () {
          button.disabled = false;
          button.textContent = 'Check cost and availability';
        });
    }

    function buildEnquiryResponse(b, data, info) {
      var dateOpts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      var wanted = data.date.toLocaleDateString('en-ZA', dateOpts);

      b.appendChild(el('h2', 'Thank you, ' + data.name));
      b.appendChild(el('p', 'Enquiry: ' + info.label + ' (' + data.qty + ' ' + info.unit + ')'));

      // Cost
      var total = info.cost * data.qty;
      var costText;
      if (info.cost === 0) { costText = 'There is no cost for this.'; }
      else if (info.perMonth) { costText = 'Estimated cost: R' + total.toLocaleString('en-ZA') + ' per month (R' + info.cost + ' per animal).'; }
      else { costText = 'Estimated cost: R' + total.toLocaleString('en-ZA') + ' (R' + info.cost + ' per ' + info.unit.replace(/s$/, '') + ').'; }
      b.appendChild(el('p', costText));

      // Availability: is the chosen weekday one of the open days? If not, find the next one.
      if (info.openDays.indexOf(data.date.getDay()) !== -1) {
        b.appendChild(el('p', 'Good news: we are available on ' + wanted + ' between ' + info.hours + '.'));
      } else {
        var next = new Date(data.date);
        for (var i = 0; i < 7 && info.openDays.indexOf(next.getDay()) === -1; i++) { next.setDate(next.getDate() + 1); }
        b.appendChild(el('p', 'We are not available for this on ' + wanted + '. The next available day is ' +
          next.toLocaleDateString('en-ZA', dateOpts) + ' between ' + info.hours + '.'));
      }
      b.appendChild(el('p', info.note));
      b.appendChild(el('p', 'We will confirm by email to ' + data.email + ' within two working days.'));
    }
  }

  /* ==========================================================
     CONTACT FORM (contact.html)
     ========================================================== */
  var contactForm = $('contact-form');
  if (contactForm) {
    counter('contactMessage', 'contactMessage-count', 1000, 20);

    wire(contactForm, [
      { id: 'contactName', check: rules.name },
      { id: 'contactEmail', check: rules.email },
      { id: 'contactPhone', check: function (v) { return rules.phone(v, true); } },
      { id: 'messageType', check: rules.required('a type of message') },
      { id: 'subject', check: rules.length('a subject', 3, 80) },
      { id: 'contactMessage', check: rules.length('a message', 20, 1000) }
    ], prepareEmail);

    function prepareEmail() {
      var name = trim($('contactName').value);
      var email = trim($('contactEmail').value);
      var phone = trim($('contactPhone').value);
      var type = $('messageType').value;
      var subject = trim($('subject').value).replace(/[\r\n]+/g, ' '); // strip line breaks from the subject
      var message = trim($('contactMessage').value);

      var emailSubject = '[' + type + '] ' + subject;
      var body = 'Message type: ' + type + '\n' +
                 'Name: ' + name + '\n' +
                 'Email: ' + email + '\n' +
                 'Phone: ' + (phone || 'not provided') + '\n\n' +
                 message + '\n';
      var mailto = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(emailSubject) + '&body=' + encodeURIComponent(body);

      var box = $('contact-response');
      showResponse(box, function (b) {
        b.appendChild(el('h2', 'Your email is ready'));
        b.appendChild(el('p', 'Check the details below, then send the email to ' + RECIPIENT + '.'));
        var pre = el('pre', 'To: ' + RECIPIENT + '\nSubject: ' + emailSubject + '\n\n' + body);
        pre.className = 'email-preview';
        b.appendChild(pre);
        var link = el('a', 'Open in my email app', 'btn');
        link.href = mailto;
        b.appendChild(link);
        var status = el('p', '');
        status.id = 'contact-status';
        b.appendChild(status);
      }, false);

      // Optional asynchronous submission to a form service (AJAX)
      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name: name, email: email, phone: phone, type: type, subject: subject, message: message })
        }).then(function (r) {
          $('contact-status').textContent = r.ok ? 'Your message was also sent to our team online.' : 'We could not send it online, please use the email button above.';
        }).catch(function () {
          $('contact-status').textContent = 'We could not send it online, please use the email button above.';
        });
      }
    }
  }
})();
