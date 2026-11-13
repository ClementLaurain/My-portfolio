PORTFOLIO — GUIDE RAPIDE

Fichiers :
- index.html : contenu et structure du portfolio
- legal.html : mentions légales et informations de confidentialité
- style.css : design, responsive et animations
- script.js : menu mobile, apparition au scroll et barre de progression
- api/contact.js : fonction Vercel qui transmet les messages via Resend

Pour lancer :
1. Décompresse le ZIP.
2. Ouvre index.html dans ton navigateur.
3. Pour modifier le contenu, ouvre index.html avec VS Code ou un éditeur.

Pour déployer le formulaire sur Vercel :
1. Importe le projet dans Vercel et déploie-le ; la route api/contact.js est automatiquement publiée comme fonction serverless.
2. Crée un compte Resend, vérifie un domaine expéditeur et choisis une adresse de ce domaine.
3. Dans les paramètres Vercel du projet, ajoute les variables d’environnement RESEND_API_KEY et CONTACT_FROM_EMAIL. Utilise la clé API Resend comme valeur de RESEND_API_KEY et l’adresse vérifiée comme valeur de CONTACT_FROM_EMAIL, puis redéploie.
4. Les messages sont envoyés à clement.laurain.dev@proton.me. Pour tester la fonction en local, utilise Vercel CLI et configure les mêmes variables d’environnement.

À personnaliser avant publication :
- Fais vérifier le site et la page legal.html par ton parent / représentant légal avant de le publier.
- Fais vérifier les mentions légales par ton parent / représentant légal et les règles de confidentialité avant publication ; ne publie pas d’adresse personnelle sans son accord.
- Le formulaire collecte le nom, l’adresse e-mail et le message du visiteur ; vérifie les informations de confidentialité dans legal.html avec ton parent avant publication.
- Vercel demande actuellement d’avoir au moins 16 ans pour utiliser ses services. À 15 ans, ne crée pas ni ne gère toi-même un compte Vercel ; demande à ton parent de vérifier les conditions et de gérer l’hébergement, ou de choisir un autre hébergeur adapté.
- Le site officiel Pizza di Scala (https://pizzadiscala.fr/) est intégré dans la fiche projet et peut être ouvert dans un nouvel onglet.

Le portfolio n’emploie pas de mesure d’audience, de polices Google Fonts ni de traceurs publicitaires. L’aperçu du site Pizza di Scala ne se charge qu’après un clic et peut transmettre des données au site tiers. Le site n’a pas de dépendance de construction ; le formulaire utilise l’API Resend depuis une fonction Vercel.
