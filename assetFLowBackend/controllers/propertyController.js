const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
  const properties = await Property.find({ owner: req.user.id });
  res.json(properties);
};

exports.createProperty = async (req, res) => {
  const { name, location, price, description } = req.body;

  const property = new Property({
    name,
    location,
    price,
    description,
    owner: req.user.id,
  });

  const createdProperty = await property.save();
  res.status(201).json(createdProperty);
};

exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, location, price, description } = req.body;

  const property = await Property.findById(id);

  if (property.owner.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  property.name = name || property.name;
  property.location = location || property.location;
  property.price = price || property.price;
  property.description = description || property.description;

  const updatedProperty = await property.save();
  res.json(updatedProperty);
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id);

  if (property.owner.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  await property.remove();
  res.json({ message: 'Property removed' });
};
