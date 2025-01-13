export default async function handler(req, res) {
    console.log('=== Démarrage auth handler ===');
    
    // Récupération des credentials
    const clientId = process.env.TIKTOK_CLIENT_ID;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    
    try {
      // Log de la requête complète pour debug
      console.log('Query params reçus:', req.query);
      console.log('Headers:', req.headers);
  
      const { code, state } = req.query;
      
      // Vérification du code d'autorisation
      if (!code) {
        console.log('❌ Code d\'autorisation manquant');
        return res.status(400).json({
          success: false,
          message: 'Code d\'autorisation manquant'
        });
      }
  
      console.log('✅ Code d\'autorisation reçu:', code);
  
      // Échange du code contre un token
      const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          client_key: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
        })
      });
  
      const tokenData = await tokenResponse.json();
      console.log('✅ Réponse token reçue:', tokenData);
  
      return res.status(200).json({
        success: true,
        message: 'Authentification réussie',
        data: tokenData
      });
  
    } catch (error) {
      console.error('❌ Erreur d\'authentification:', error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }