const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

// Reveal les éléments au fur et à mesure du défilement.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Charge le site tiers uniquement après une action explicite du visiteur.
const previewButton = document.querySelector('.preview-load');
if (previewButton) {
  previewButton.addEventListener('click', () => {
    const preview = document.createElement('iframe');
    preview.className = 'pizza-site-preview';
    preview.src = 'https://pizzadiscala.fr/';
    preview.title = 'Aperçu du site officiel Pizza di Scala';
    preview.loading = 'lazy';
    previewButton.closest('.pizza-preview-placeholder').replaceWith(preview);
  });
}

// Barre de progression de lecture.
const progressBar = document.querySelector('.progress');
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Année automatique dans le pied de page.
document.querySelector('#year').textContent = new Date().getFullYear();

// Envoi du formulaire via la fonction serverless Vercel.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('.contact-submit');
  const contactStatus = document.querySelector('#contact-status');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    contactStatus.textContent = 'Envoi en cours…';

    try {
      const formData = new FormData(contactForm);
      const honeypot = formData.get('_honey');
      if (typeof honeypot === 'string' && honeypot.trim()) {
        contactStatus.textContent = 'Le formulaire ne peut pas être envoyé.';
        return;
      }

      const payload = Object.fromEntries(formData);
      payload._replyto = payload.email;

      const response = await fetch('https://formsubmit.co/ajax/clement.laurain.dev@proton.me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('FormSubmit a renvoyé une réponse non JSON.', {
          status: response.status,
          contentType: response.headers.get('content-type'),
          url: response.url
        });
        contactStatus.textContent = 'Le service de formulaire est momentanément indisponible. Réessaie plus tard.';
        return;
      }

      const succeeded = result && (result.success === true || result.success === 'true');
      if (!response.ok || !succeeded) {
        console.error('FormSubmit a refusé le message.', {
          status: response.status,
          message: result && result.message
        });
        contactStatus.textContent = result && result.message
          ? result.message
          : 'Le message n’a pas pu être envoyé. Réessaie plus tard.';
        return;
      }

      contactStatus.textContent = result.message || 'Merci, ton message a bien été envoyé.';
      contactForm.reset();
    } catch (error) {
      console.error('Erreur lors de l’envoi du formulaire de contact.', error);
      contactStatus.textContent = 'Une erreur est survenue. Vérifie ta connexion et réessaie.';
    } finally {
      submitButton.disabled = false;
    }
  });
}
