// import React from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { login } from './authService'; // Importez la fonction login

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const Login = () => {
  const handleSubmit = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    try {
      const data = await login(values.email, values.password);
      console.log('Connexion réussie', data); // Traitez la réponse de l'API ici, par exemple, stockez les informations de l'utilisateur dans le contexte ou les cookies
    } catch (error) {
      console.error('Erreur de connexion'/*, error.message*/); // Gérez les erreurs de connexion, par exemple, affichez un message d'erreur à l'utilisateur
    } finally {
      actions.setSubmitting(false); // Arrêtez l'indicateur de soumission, indépendamment du succès ou de l'échec de la connexion
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Connexion
      </Typography>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
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
                  Se connecter
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
