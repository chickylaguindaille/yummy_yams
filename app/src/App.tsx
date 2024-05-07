import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { login, register } from './authService'; // Importer les fonctions login et register
import DiceGame from './DiceGame'; // Importer le composant DiceGame

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // État pour suivre si l'utilisateur est en train de se connecter ou de s'inscrire
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour suivre si l'utilisateur est connecté

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      if (isLogin) {
        const data = await login(values.email, values.password);
        console.log('Connexion réussie', data);
        setIsLoggedIn(true); // Mettre à jour l'état pour indiquer que l'utilisateur est connecté
        localStorage.setItem('userId', data.userId);
      } else {
        const data = await register(values.email, values.password, values.firstName, values.lastName);
        console.log('Inscription réussie', data);
        setIsLoggedIn(true); // Mettre à jour l'état pour indiquer que l'utilisateur est connecté après l'inscription
        localStorage.setItem('userId', data.userId);
      }
    } catch (error) {
      console.error('Erreur', /*error.message*/);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // Bascule entre l'état de connexion et l'état d'inscription
  };

  return (
    <Container maxWidth="xs">
      {isLoggedIn ? (
        <div>
          <Typography variant="h4" align="center" gutterBottom>
            Vous êtes connecté
          </Typography>
          <DiceGame /> {/* Afficher le jeu de dés uniquement si l'utilisateur est connecté */}
        </div>
      ) : (
        <div>
          <Typography variant="h4" align="center" gutterBottom>
            {isLogin ? 'Connexion' : 'Inscription'}
          </Typography>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {!isLogin && (
                      <Field
                        as={TextField}
                        name="firstName"
                        label="Prénom"
                        variant="outlined"
                        fullWidth
                        required
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    {!isLogin && (
                      <Field
                        as={TextField}
                        name="lastName"
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        required
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="password"
                      label="Mot de passe"
                      type="password"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isLogin ? 'Se connecter' : 'S\'inscrire'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Button onClick={toggleForm}>
                {isLogin ? 'Pas encore de compte? S\'inscrire' : 'Déjà un compte? Se connecter'}
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </Container>
  );
};

export default Login;
