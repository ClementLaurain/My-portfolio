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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      });
      const result = await response.json();

      if (!response.ok) {
        contactStatus.textContent = result.error || 'Le message n’a pas pu être envoyé. Réessaie plus tard.';
        return;
      }

      contactStatus.textContent = result.message;
      contactForm.reset();
    } catch (error) {
      console.error('Erreur lors de l’envoi du formulaire de contact.', error);
      contactStatus.textContent = 'Une erreur est survenue. Vérifie ta connexion et réessaie.';
    } finally {
      submitButton.disabled = false;
    }
  });
}
