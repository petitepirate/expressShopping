const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb");

items.push(  {
  name: 'popsicle', 
  price: 1.45
},
{
  name: 'cheerios', 
  price: 3.40
});

router.get('/', (req,res) => {
  res.json({items})
});

router.post('/', (req, res, next) => {
  try {
    if(!req.body.name || !req.body.price) throw new ExpressError('Item name and price required', 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({added: newItem});
  } catch (e) {
    return next(e);
  }
})

router.get('/:name', (req, res, next) => {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404)
  }
  res.json(foundItem)
})

router.patch('/:name', (req, res, next) => {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404)
  }
  foundItem.name = req.body.name
  foundItem.price = req.body.price
  res.json({updated: foundItem})
})

router.delete('/:name', (req, res, next) => {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404)
  }
  const idx = items.indexOf(foundItem);
  items.splice(idx, 1);
  res.json({message: 'deleted'});
})

module.exports = router;
