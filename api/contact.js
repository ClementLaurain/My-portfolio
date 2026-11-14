module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const body = typeof req.body === 'string'
    ? parseBody(req.body)
    : req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Le formulaire est invalide.' });
  }

  if (typeof body.website === 'string' && body.website.trim()) {
    return res.status(400).json({ error: 'Le formulaire est invalide.' });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (
    !name || name.length > 100 ||
    !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message || message.length > 5000
  ) {
    return res.status(400).json({ error: 'Vérifie les champs du formulaire et réessaie.' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error('WEB3FORMS_ACCESS_KEY doit être configurée.');
    return res.status(503).json({ error: 'Le formulaire n’est pas encore configuré. Réessaie plus tard.' });
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        message,
        subject: 'Nouveau message depuis le portfolio',
        from_name: 'Portfolio de Clément',
        replyto: email
      })
    });
    const result = await response.json();

    if (!response.ok || result.success !== true) {
      console.error('Web3Forms a refusé le message. Code HTTP :', response.status);
      return res.status(502).json({ error: 'Le message n’a pas pu être envoyé. Réessaie plus tard.' });
    }

    return res.status(200).json({ message: 'Merci, ton message a bien été envoyé.' });
  } catch (error) {
    console.error('Erreur lors de la communication avec Web3Forms.', error);
    return res.status(502).json({ error: 'Le message n’a pas pu être envoyé. Réessaie plus tard.' });
  }
};

function parseBody(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}
