// Mobile nav
var mobBtn = document.getElementById('mob-btn');
var mobMenu = document.getElementById('mob-menu');
if (mobBtn && mobMenu) {
  mobBtn.addEventListener('click', function () {
    mobBtn.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
}

// Contact form (Web3Forms) — business questions first, name and email last
var contactForm = document.getElementById('contact-form');
if (contactForm) {
  var steps = contactForm.querySelectorAll('.q-step');
  var progress = document.getElementById('q-progress');
  var backBtn = document.getElementById('q-back');
  var nextBtn = document.getElementById('q-next');
  var errorEl = document.getElementById('q-error');
  var actions = document.getElementById('q-actions');
  var index = 0;

  contactForm.querySelectorAll('.choice').forEach(function (choice) {
    choice.addEventListener('click', function () {
      var group = choice.parentElement;
      group.querySelectorAll('.choice').forEach(function (other) {
        other.setAttribute('aria-pressed', 'false');
      });
      choice.setAttribute('aria-pressed', 'true');
      var hidden = choice.closest('.q-step').querySelector('input[type="hidden"]');
      hidden.value = choice.getAttribute('data-value');
      group.classList.remove('is-invalid');
      group.removeAttribute('aria-invalid');
      errorEl.hidden = true;
    });
  });

  function clearMarks(step) {
    step.querySelectorAll('.is-invalid').forEach(function (el) {
      el.classList.remove('is-invalid');
      el.removeAttribute('aria-invalid');
    });
  }

  function mark(el) {
    el.classList.add('is-invalid');
    el.setAttribute('aria-invalid', 'true');
  }

  function problems(i) {
    var step = steps[i];
    var need = step.getAttribute('data-need');
    clearMarks(step);
    var list = [];
    if (need === 'text') {
      var field = step.querySelector('input');
      if (!field.value.trim()) {
        mark(field);
        list.push(step.getAttribute('data-error'));
      }
    }
    if (need === 'choice') {
      var hidden = step.querySelector('input[type="hidden"]');
      if (!hidden.value) {
        mark(step.querySelector('.choices'));
        list.push(step.getAttribute('data-error'));
      }
    }
    if (need === 'contact') {
      if (!contactForm.business.value.trim()) {
        mark(contactForm.business);
        list.push('Add the business name.');
      }
      if (!contactForm.name.value.trim()) {
        mark(contactForm.name);
        list.push('Add your name.');
      }
      var email = contactForm.email.value.trim();
      var emailOk = email.indexOf('@') > 0 && email.indexOf('.', email.indexOf('@')) > email.indexOf('@') + 1;
      if (!emailOk) {
        mark(contactForm.email);
        list.push(email ? 'That email does not look complete.' : 'Add an email Oliver can reply to.');
      }
    }
    return list;
  }

  function showProblem(list) {
    errorEl.hidden = false;
    errorEl.textContent = list.length > 1 ? 'Fill the marked fields.' : list[0];
    var first = steps[index].querySelector('input.is-invalid');
    if (first) first.focus();
  }

  function show(i) {
    index = i;
    steps.forEach(function (step, n) { step.hidden = n !== i; });
    progress.textContent = (i + 1) + ' of ' + steps.length;
    backBtn.hidden = i === 0;
    var last = i === steps.length - 1;
    nextBtn.hidden = last;
    document.getElementById('cf-submit').hidden = !last;
    errorEl.hidden = true;
    var title = steps[i].querySelector('h2');
    if (title) title.focus({ preventScroll: true });
  }

  function goNext() {
    var list = problems(index);
    if (list.length) {
      showProblem(list);
      return;
    }
    if (index < steps.length - 1) show(index + 1);
  }

  contactForm.addEventListener('input', function (e) {
    if (!e.target.classList || !e.target.classList.contains('is-invalid')) return;
    var list = problems(index);
    if (!list.length) errorEl.hidden = true;
    else errorEl.textContent = list.length > 1 ? 'Fill the marked fields.' : list[0];
  });

  steps.forEach(function (step) {
    var title = step.querySelector('h2');
    if (title) title.tabIndex = -1;
  });
  show(0);

  nextBtn.addEventListener('click', goNext);
  backBtn.addEventListener('click', function () {
    if (index > 0) show(index - 1);
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (index < steps.length - 1) {
      goNext();
      return;
    }
    var list = problems(index);
    if (list.length) {
      showProblem(list);
      return;
    }

    var btn = document.getElementById('cf-submit');
    var msg = document.getElementById('cf-msg');
    btn.disabled = true;
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    btn.textContent = 'Sending';
    msg.className = 'form-msg';

    var note = [
      'Trade: ' + contactForm.trade.value.trim(),
      'Town: ' + contactForm.city.value.trim(),
      'Needs: ' + contactForm.need.value
    ].join('\n');

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: 'ccdf3061-ccc5-42cd-a0ef-4d3839be4e8f',
        subject: 'New Lead from OliverSEO.com: ' + contactForm.business.value.trim(),
        from_name: 'OliverSEO Contact Form',
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        phone: contactForm.phone.value.trim() || 'Not provided',
        business: contactForm.business.value.trim(),
        trade: contactForm.trade.value.trim(),
        city: contactForm.city.value.trim(),
        need: contactForm.need.value,
        message: note
      })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok || data.success === false) throw new Error(data.message || 'send failed');
          return data;
        });
      })
      .then(function () {
        msg.className = 'form-msg ok';
        msg.textContent = 'Sent. Oliver will reply by email.';
        contactForm.reset();
        steps.forEach(function (step) { step.hidden = true; });
        actions.hidden = true;
        progress.hidden = true;
      })
      .catch(function () {
        msg.className = 'form-msg err';
        msg.textContent = 'Something went wrong. Please call us at (307) 228-0770.';
      })
      .finally(function () {
        btn.disabled = false;
        btn.classList.remove('is-loading');
        btn.removeAttribute('aria-busy');
        btn.textContent = 'Send';
      });
  });
}
