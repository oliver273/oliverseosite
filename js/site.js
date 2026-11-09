// Mobile nav
var mobBtn = document.getElementById('mob-btn');
var mobMenu = document.getElementById('mob-menu');
if (mobBtn && mobMenu) {
  mobBtn.addEventListener('click', function () {
    mobBtn.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
}

// Contact form (Web3Forms)
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

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: 'ccdf3061-ccc5-42cd-a0ef-4d3839be4e8f',
        subject: 'New Lead from OliverSEO.com: ' + contactForm.name.value,
        from_name: 'OliverSEO Contact Form',
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value || 'Not provided',
        business: contactForm.business.value || 'Not provided',
        budget: contactForm.budget.value || 'Not specified',
        services: services.join(', ') || 'None selected',
        message: contactForm.message.value || 'No message'
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
