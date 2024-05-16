import { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DiceGame = () => {
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [wonPastries, setWonPastries] = useState(0);
  const [diceValues, setDiceValues] = useState([] as number[]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Charger la liste des utilisateurs lorsque le composant est monté
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
        const userToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/auth', {
          headers: {
            'Authorization': `Bearer ${userToken}` // Inclure le token dans l'en-tête Authorization
          }
        })
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    };

  const rollDice = () => {
    if (remainingAttempts === 0) return;

    const userId = localStorage.getItem('userId');
    const userToken = localStorage.getItem('token');

    fetch(`http://localhost:3001/api/dice/roll/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}` // Inclure le token dans l'en-tête Authorization
        }
      })
      .then(response => {
        if (response.status === 403) {
          throw new Error('Vous avez épuisé votre nombre d\'essais');
        }
        return response.json();
      })
      .then(data => {
        setDiceValues(data.diceValues);

        const uniqueValues = new Set(data.diceValues);

        if (uniqueValues.size === 1) {
          // YAM'S (5 dés identiques)
          setWonPastries(3);
        } else if (uniqueValues.size === 2) {
          // CARRÉ (4 dés identiques) ou DOUBLE (2 paires de dés identiques)
          const countMap = new Map();
          data.diceValues.forEach((value: number) => {
            countMap.set(value, (countMap.get(value) || 0) + 1);
          });          

          const counts = Array.from(countMap.values());
          if (counts.includes(4)) {
            // CARRÉ (4 dés identiques)
            setWonPastries(2);
          } else if (counts.includes(2) && counts.length === 3) {
            // DOUBLE (2 paires de dés identiques)
            setWonPastries(1);
          }
        }

        setRemainingAttempts(remainingAttempts - 1);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des valeurs des dés :', error);
      });
  };

  // const resetGame = () => {
  //   setRemainingAttempts(3);
  //   setWonPastries(0);
  //   setDiceValues([]);
  // };

  return (
    <div align="center">
      <Typography variant="body1" gutterBottom>
        Tentatives restantes : {remainingAttempts}
      </Typography>
      <Button variant="contained" color="primary" onClick={rollDice} disabled={remainingAttempts === 0}>
        Lancer les dés
      </Button>
      {diceValues.length > 0 && (
        <Typography variant="body1" gutterBottom>
          Résultats des dés : {diceValues.map((value, index) => (
            <span key={index}>{value} </span>
          ))}
        </Typography>
      )}
      {wonPastries > 0 && (
        <Typography variant="body1" gutterBottom>
          Félicitations ! Vous avez gagné {wonPastries} pâtisserie{wonPastries > 1 ? 's' : ''}.
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Pâtisseries Gagnées</TableCell> {/* Nouvelle en-tête de colonne */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <ul> {/* Liste des pâtisseries gagnées par chaque utilisateur */}
                    {user.pastriesWon.map((pastry: any) => (
                      <li key={pastry._id}>{pastry.name}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DiceGame;
