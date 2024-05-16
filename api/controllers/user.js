const User = require('../models/user');
const argon2 = require('argon2');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// CONNEXION/INSCRIPTION

exports.signup = async (req, res, next) => {
    try {
        const hashedPassword = await argon2.hash(req.body.password, 10);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            try: 3,
            pastriesWon: [],
        });
        await user.save();
        const token = jwt.sign(
            { userId: user._id },
            // 'RANDOM_TOKEN_SECRET',
            process.env.RANDOM_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({ message: 'Utilisateur créé !', token: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
                        // 'RANDOM_TOKEN_SECRET',
                        process.env.RANDOM_TOKEN_SECRET,
                        { expiresIn: '1h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// MODIFICATION USER

exports.getOneUser = (req, res, next) => {
    User.findOne({
      _id: req.params.id
    }).then(
      (user) => {
        res.status(200).json(user);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.modifyUser = (req, res, next) => {
    const user = new User({
      _id: req.params.id,
      try: req.body.try,
      pastriesWon: req.body.pastriesWon,
    });
    User.updateOne({_id: req.params.id}, user).then(
      () => {
        res.status(201).json({
          message: 'User updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  
  exports.deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.id}).then(
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  
  exports.getAllUser = (req, res, next) => {
    User.find().then(
      (users) => {
        res.status(200).json(users);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };