const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll().then((tag) => {
    res.json(tag);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id).then((tag) => {
    res.json(tag);
  });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req, body)
    .then((newTag) => {
      res.json(newTag);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {
      tag_name: req.body.tag_name  
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then((updatedTag) => {
    res.json(updatedTag);
  })
  .catch((error) => {
    console.log(error);
    res.json(error);
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((deletedTag) => {
    res.json(deletedTag);
  })
  .catch((error) => res.json(error));
});

module.exports = router;
