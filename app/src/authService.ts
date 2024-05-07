// import bcrypt from 'bcryptjs'; // Importez bcryptjs

export const login = async (email: string, password: string) => {
  try {
    // Cryptez le mot de passe avant de l'envoyer au serveur
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Ensuite, envoyez le mot de passe crypté au serveur
    const apiUrl = "http://localhost:3001/api/auth/login";

    if (!apiUrl) {
      throw new Error('L\'URL de l\'API n\'est pas définie.'); // Gérez l'absence d'URL de l'API
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Envoyez le mot de passe crypté
      // body: JSON.stringify({ email, password: hashedPassword }), // Envoyez le mot de passe crypté
    });

    if (!response.ok) {
      throw new Error('Identifiants invalides'); // Gérez les erreurs de l'API selon votre cas
    }

    const data = await response.json();
    return data; // Vous pouvez retourner des données supplémentaires de l'utilisateur ici si nécessaire
  } catch (error) {
    throw new Error('Une erreur s\'est produite lors de la connexion.'); // Gérez les erreurs de requête
  }
};
