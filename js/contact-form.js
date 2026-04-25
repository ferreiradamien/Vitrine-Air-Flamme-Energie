(function() {
    const form = document.getElementById('rdv-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
    
        // Validation basique côté client
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(function(field) {
        if (!field.value.trim()) {
            field.style.borderColor = '#e24b4a';
            valid = false;
        } else {
            field.style.borderColor = '';
        }
        });
    
        if (!valid) {
        showStatus('error', 'Veuillez remplir tous les champs obligatoires (*).');
        return;
        }
    
        // Envoi
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours…';
    
        try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });
    
        if (response.ok) {
            showStatus('success', '✅ Votre demande a bien été envoyée ! Nous vous recontacterons rapidement.');
            form.reset();
            submitBtn.textContent = 'Demande envoyée ✓';
        } else {
            const json = await response.json();
            if (json.errors) {
            showStatus('error', 'Erreur : ' + json.errors.map(function(e){ return e.message; }).join(', '));
            } else {
            showStatus('error', 'Une erreur est survenue. Veuillez nous appeler directement au 06 12 20 11 51.');
            }
            submitBtn.disabled = false;
            submitBtn.textContent = '📅 Envoyer ma demande de rendez-vous';
        }
        } catch (err) {
        showStatus('error', 'Problème de connexion. Veuillez nous appeler directement au 06 12 20 11 51.');
        submitBtn.disabled = false;
        submitBtn.textContent = '📅 Envoyer ma demande de rendez-vous';
        }
    });
    
    function showStatus(type, msg) {
        status.style.display = 'block';
        status.style.padding = '12px 16px';
        status.style.borderRadius = '6px';
        status.style.margin = '12px 0';
        status.style.fontSize = '14px';
        if (type === 'success') {
        status.style.background = '#EAF3DE';
        status.style.color = '#3B6D11';
        status.style.border = '1px solid #C0DD97';
        } else {
        status.style.background = '#FCEBEB';
        status.style.color = '#A32D2D';
        status.style.border = '1px solid #F7C1C1';
        }
        status.textContent = msg;
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
})();