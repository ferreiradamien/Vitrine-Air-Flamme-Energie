document.addEventListener('DOMContentLoaded', function () {
// Reconstruction de l'adresse depuis des fragments séparés
const u = 'contact';
const d = 'airflamme';
const t = 'fr';
const email = u + '\u0040' + d + '.' + t; // \u0040 = @

// Remplace tous les éléments marqués data-email-protect
document.querySelectorAll('[data-email-protect]').forEach(function (el) {
    el.textContent = email;
    if (el.tagName === 'A') {
    el.href = 'mailto:' + email;
    }
});
});