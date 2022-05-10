const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
	Category.findAll({
		attributes: ['id', 'category_name'],
		include: [
			{
				model: Product,
				attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
			}
		]
	}).then(categoryData => {
		res.json(categoryData);
	}).catch(error => {
		console.log(error);
		res.status(500).json(error);
	})
});

router.get('/:id', (req, res) => {
	Category.findOne({
		where: {
			id: req.params.id
		},
		attributes: ['id', 'category_name'],
		include: [
			{
				model: Product,
				attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
			}
		]
	}).then((categoryData) => {
		if (!categoryData) {
			res.status(404).json('There is no such category with that id!');
			return;
		};
		res.json(categoryData);
	}).catch(error => {
		console.log(error);
		res.status(500).json(error);
	})
});

router.post('/', (req, res) => {
	Category.create({
		category_name: req.body.category_name
	})
	.then(newCategory => {
		res.json(newCategory);
	}).catch(error => {
		console.log(error);
		res.status(500).json(error);
	})
});

router.put('/:id', (req, res) => {
	Category.update(
		{
			where: {
				id: req.params.id
			}
		},
		{
			category_name: req.body.category_name
		}
	)
	.then((updatedCategory) => {
		if (!updatedCategory) {
			res.status(404).json('There is no such category with that id!')
		}
		res.json(updatedCategory);
	})
	.catch((error) => {
		console.log(error);
		res.json(error);
	});
});

router.delete('/:id', (req, res) => {
	Category.destroy({
		where: {
			id: req.params.id,
		}
	})
	.then((deletedCategory) => {
		if (!deletedCategory) {
			res.status(404).json('There is no such category with that id!')
		}
		res.json(deletedCategory);
	})
	.catch((error) => {
		console.log(error);
		res.status(500).json(error);
	})
});

module.exports = router;
