/* ============================================================
   BURGER.JS — Menu hamburger mobile
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const burger = document.getElementById('burger-btn');
    const menu   = document.getElementById('nav-menu');
    const links  = menu ? menu.querySelectorAll('a') : [];

    if (!burger || !menu) return;

    /* Ouvre / ferme le menu */
    burger.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        burger.classList.toggle('is-open', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
        /* Bloque le scroll du body quand le menu est ouvert */
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Ferme le menu au clic sur un lien */
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('is-open');
            burger.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* Ferme le menu si on clique à l'extérieur (overlay) */
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !burger.contains(e.target)) {
            menu.classList.remove('is-open');
            burger.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});
