const express = require('express');
const router = express.Router();

const Yummy = require('../models/yummy');

router.post('/', (req, res, next) => {
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
});

router.get('/:id', (req, res, next) => {
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
});

router.put('/:id', (req, res, next) => {
  const yummy = new Yummy({
    _id: req.params.id,
    name: req.body.name,
    image: req.body.image,
    stock: req.body.stock,
    quantityWon: req.body.quantityWon
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
});

router.delete('/:id', (req, res, next) => {
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
});

router.get('/' +
  '', (req, res, next) => {
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
});

const routeCtrl = require('../controllers/route');

router.get('/', routeCtrl.getAllRoute);
router.post('/', routeCtrl.createYummy);
router.get('/:id', routeCtrl.getOneYummy);
router.put('/:id', routeCtrl.modifyYummy);
router.delete('/:id', routeCtrl.deleteYummy);

module.exports = router;