export default function handler(req, res) {
  // Log de démarrage
  console.log('=== Démarrage du webhook ===');
  
  // Récupération et log des credentials
  const clientId = process.env.TIKTOK_CLIENT_ID;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  console.log('Vérification des credentials:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret
  });

  if (req.method === 'POST') {
    try {
      // Log détaillé de la requête
      console.log('Requête reçue:', {
        method: req.method,
        headers: req.headers,
        body: req.body,
        timestamp: new Date().toISOString()
      });

      // Vérification des credentials
      if (!clientId || !clientSecret) {
        console.error('❌ Credentials manquants');
        return res.status(500).json({
          success: false,
          message: 'Configuration incorrecte'
        });
      }

      // Log de succès
      console.log('✅ Webhook traité avec succès');

      return res.status(200).json({
        success: true,
        message: 'Webhook reçu et traité',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Log d'erreur
      console.error('❌ Erreur:', error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Log pour méthode non autorisée
  console.log('❌ Méthode non autorisée:', req.method);
  return res.status(405).json({
    success: false,
    error: 'Méthode non autorisée',
    message: 'Seules les requêtes POST sont acceptées'
  });
}