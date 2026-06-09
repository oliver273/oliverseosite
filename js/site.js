// Mobile nav
var mobBtn = document.getElementById('mob-btn');
var mobMenu = document.getElementById('mob-menu');
if (mobBtn && mobMenu) {
  mobBtn.addEventListener('click', function () {
    mobBtn.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
}

// Contact form (formsubmit.co ajax)
var contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = document.getElementById('cf-submit');
    var msg = document.getElementById('cf-msg');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    msg.className = 'form-msg';

    var services = [];
    contactForm.querySelectorAll('input[name="services"]:checked').forEach(function (c) {
      services.push(c.value);
    });

    fetch('https://formsubmit.co/ajax/oliver@oliverseo.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value || 'Not provided',
        business: contactForm.business.value || 'Not provided',
        budget: contactForm.budget.value || 'Not specified',
        services: services.join(', ') || 'None selected',
        message: contactForm.message.value || 'No message',
        _subject: 'New Lead from OliverSEO.com: ' + contactForm.name.value
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('send failed');
        msg.className = 'form-msg ok';
        msg.textContent = "Message sent! We'll be in touch within 2 hours.";
        contactForm.reset();
      })
      .catch(function () {
        msg.className = 'form-msg err';
        msg.textContent = 'Something went wrong. Please call us at (307) 228-0770.';
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      });
  });
}
