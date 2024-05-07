const User = require('../models/user');
const argon2 = require('argon2');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    argon2.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// exports.login = (req, res, next) => {
//     User.findOne({ email: req.body.email })
//     .then(user => {
//         if (!user) {
//             return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
//         }
//         bcrypt.compare(req.body.password, user.password)
//             .then(valid => {
//                 if (!valid) {
//                     return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
//                 }
//                 res.status(200).json({
//                     userId: user._id,
//                     token: jwt.sign(
//                         { userId: user._id },
//                         'RANDOM_TOKEN_SECRET',
//                         { expiresIn: '1h' }
//                     )
//                 });
//             })
//             .catch(error => res.status(500).json({ error }));
//     })
//     .catch(error => res.status(500).json({ error }));
// };


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        argon2.verify(user.password, req.body.password)
            .then(match => {
                if (!match) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.RANDOM_TOKEN_SECRET,
                        { expiresIn: '1h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};