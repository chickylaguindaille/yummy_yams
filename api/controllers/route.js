const Yummy = require('../models/yummy');

exports.createYummy = (req, res, next) => {
  const yummy = new Yummy({
    name: req.body.name,
    image: req.body.image,
    stock: req.body.stock,
    quantityWon: req.body.quantityWon
  });
  yummy.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
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

exports.getOneYummy = (req, res, next) => {
    Yummy.findOne({
      _id: req.params.id
    }).then(
      (yummy) => {
        res.status(200).json(yummy);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.modifyYummy = (req, res, next) => {
    const yummy = new Yummy({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId
    });
    Yummy.updateOne({_id: req.params.id}, yummy).then(
      () => {
        res.status(201).json({
          message: 'Yummy updated successfully!'
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
  
  exports.deleteYummy = (req, res, next) => {
    Yummy.deleteOne({_id: req.params.id}).then(
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
  
  exports.getAllRoute = (req, res, next) => {
    Yummy.find().then(
      (yummies) => {
        res.status(200).json(yummies);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };