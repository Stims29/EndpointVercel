// Fonction principale du webhook
export default function handler(req, res) {
  // Log de démarrage
  console.log('=== Démarrage du webhook ===');
  
  // Récupération des credentials
  const clientId = process.env.TIKTOK_CLIENT_ID;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  
  // Log des credentials (sécurisé)
  console.log('Vérification des credentials:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret
  });

  if (req.method === 'POST') {
    try {
      // Validation de base des données
      if (!req.body) {
        throw new Error('Corps de requête manquant');
      }

      // Log des données reçues
      console.log('Données reçues:', {
        method: req.method,
        headers: req.headers,
        body: req.body,
        timestamp: new Date().toISOString()
      });

      // Validation des credentials
      if (!clientId || !clientSecret) {
        console.error('❌ Credentials manquants');
        return res.status(500).json({
          success: false,
          message: 'Configuration incorrecte'
        });
      }

      // Validation de la structure des données
      validateWebhookData(req.body);

      // Log de succès
      console.log('✅ Webhook traité avec succès');

      // Réponse positive
      return res.status(200).json({
        success: true,
        message: 'Webhook reçu et traité',
        timestamp: new Date().toISOString(),
        data: req.body
      });

    } catch (error) {
      // Log et gestion des erreurs
      console.error('❌ Erreur webhook:', error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Gestion des méthodes non autorisées
  console.log('❌ Méthode non autorisée:', req.method);
  return res.status(405).json({
    success: false,
    error: 'Méthode non autorisée',
    message: 'Seules les requêtes POST sont acceptées'
  });
}

// Fonction de validation des données
function validateWebhookData(data) {
  // Vérification du type d'événement
  if (!data.event_type) {
    throw new Error('Type d\'événement manquant');
  }

  // Vérification du timestamp
  if (!data.timestamp || !isValidTimestamp(data.timestamp)) {
    throw new Error('Timestamp invalide ou manquant');
  }

  // Si des données vidéo sont présentes, les valider
  if (data.data) {
    validateVideoData(data.data);
  }
}

// Validation des données vidéo
function validateVideoData(videoData) {
  if (videoData.video_id && typeof videoData.video_id !== 'string') {
    throw new Error('ID de vidéo invalide');
  }

  if (videoData.metrics) {
    const { views, likes, comments, shares } = videoData.metrics;
    if (
      (views && typeof views !== 'number') ||
      (likes && typeof likes !== 'number') ||
      (comments && typeof comments !== 'number') ||
      (shares && typeof shares !== 'number')
    ) {
      throw new Error('Métriques invalides');
    }
  }

  if (videoData.themes && !Array.isArray(videoData.themes)) {
    throw new Error('Thèmes doivent être un tableau');
  }
}

// Validation du format timestamp
function isValidTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date instanceof Date && !isNaN(date);
}