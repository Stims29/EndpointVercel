export default function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Log les données reçues
        console.log('Webhook reçu:', req.body);
        
        // Vérification basique de la signature (à implémenter avec votre clé secrète TikTok)
        const signature = req.headers['x-tiktok-signature'];
        
        // TODO: Ajouter la vérification de la signature
        // if (!validateSignature(signature, req.body)) {
        //   return res.status(403).json({ error: 'Signature invalide' });
        // }
  
        // Traitement des données
        const webhookData = req.body;
        
        // Répondre à TikTok
        return res.status(200).json({
          success: true,
          message: 'Webhook reçu et traité',
          timestamp: new Date().toISOString()
        });
  
      } catch (error) {
        console.error('Erreur webhook:', error);
        return res.status(500).json({ 
          error: 'Erreur interne du serveur',
          message: error.message 
        });
      }
    }
  
    // Pour toute autre méthode que POST
    return res.status(405).json({ 
      error: 'Méthode non autorisée',
      message: 'Seules les requêtes POST sont acceptées' 
    });
  }