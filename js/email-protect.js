document.addEventListener('DOMContentLoaded', function () {
const parts = ['cont', 'act', '\u0040', 'airfl', 'amme', '.fr'];

document.querySelectorAll('[data-email-protect]').forEach(function (el) {
    // Affiche l'email en clair dans le texte visible
    el.textContent = parts.join('');

    if (el.tagName === 'A') {
    // Garde href="#" dans le DOM — le mailto est construit uniquement au clic
    el.setAttribute('href', '#');
    el.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = ['mail', 'to:', parts.join('')].join('');
    });
    }
});
});
