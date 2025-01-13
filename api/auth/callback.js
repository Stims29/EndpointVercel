export default function handler(req, res) {
    // Gérer la redirection après authentification TikTok
    const { code, state } = req.query;
    
    // Log pour debug
    console.log('Auth callback received:', { code, state });
    
    return res.status(200).json({
      message: 'Authentification réussie',
      code: code
    });
  }