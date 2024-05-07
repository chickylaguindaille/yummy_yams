import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

const DiceGame = () => {
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [wonPastries, setWonPastries] = useState(0);
  const [diceValues, setDiceValues] = useState([] as number[]);

  const rollDice = () => {
    if (remainingAttempts === 0) return;

    const userId = localStorage.getItem('userId');

    fetch(`http://localhost:3001/api/dice/roll/${userId}`)
      .then(response => response.json())
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
    <div>
      <Typography variant="h4" gutterBottom>
        Jeu de Dés
      </Typography>
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
      {/* {remainingAttempts === 0 && (
        <Button variant="contained" color="secondary" onClick={resetGame}>
          Recommencer
        </Button>
      )} */}
    </div>
  );
};

export default DiceGame;
