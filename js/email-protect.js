document.addEventListener('DOMContentLoaded', function () {
  const parts = ['cont', 'act', '\u0040', 'airfl', 'amme', '.fr'];
  const email = parts.join('');

  document.querySelectorAll('[data-email-protect]').forEach(function (el) {
    el.textContent = email;
    if (el.tagName === 'A') {
      el.setAttribute('href', 'mail' + 'to:' + email);
    }
  });
});
