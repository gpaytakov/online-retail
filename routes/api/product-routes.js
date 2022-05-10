const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
	Product.findAll({
		attributes: ['id', 'prduct_name', 'price', 'stock', 'category_id'],
		include: [
			{
				model: Category,
				attributes: ['id', 'category_name']
			},
			{
				model: Tag,
				as: 'tagged_item',
				attributes: ['id', 'tag_name']
			}
		]
	}).then((productData) => {
		res.json(productData);
	}).catch(error => {
		console.log(error);
		res.status(500).json(error)
	})
});

// get one product
router.get('/:id', (req, res) => {
	// find a single product by its `id`
	// be sure to include its associated Category and Tag data
	Product.findOne({
		attributes: ['id', 'prduct_name', 'price', 'stock', 'category_id'],
		include: [
			{
				model: Category,
				attributes: ['id', 'category_name']
			},
			{
				model: Tag,
				as: 'tagged_item',
				attributes: ['id', 'tag_name']
			}
		],
		where: {
			id: req.params.id
		}
	}).then((productData) => {
		if (!productData) {
			res.status(404).json('There is no such product with that id!')
		}
		res.json(productData);
	}).catch(error => {
		console.log(error);
		res.status(500).json(error)
	})
});

// create new product
	router.post('/', (req, res) => {
	/* req.body should look like this...
		{
		product_name: "Basketball",
		price: 200.00,
		stock: 3,
		tagIds: [1, 2, 3, 4]
		}
	*/
	Product.create(req.body)
		.then(product => {
		// if there's product tags, we need to create pairings to bulk create in the ProductTag model
		if (req.body.tagIds.length) {
			const arrProductTagId = req.body.tagIds.map((tag_id) => {
			return {
				product_id: product.id,
				tag_id,
			};
			});
			return ProductTag.bulkCreate(arrProductTagId);
		}
		// if no product tags, just respond
		res.status(200).json(product);
		})
		.then((productTagIds) => res.status(200).json(productTagIds))
		.catch(error => {
			console.log(error);
			res.status(404).json(error);
		});
	});

// update product
router.put('/:id', (req, res) => {
	// update product data
	Product.update(req.body, {
		where: {
			id: req.params.id,
		},
	})
	.then((product) => {
		// find all associated tags from ProductTag
		return ProductTag.findAll({ 
			where: {
				product_id: req.params.id
			} 
		});
	})
	.then(productTags => {
		// get list of current tag_ids
		const tagIds = productTags.map(({tag_id}) => tag_id);
		// create filtered list of new tag_ids
		const newTagIds = req.body.tagIds
			.filter(tag_id => !tagIds.includes(tag_id))
			.map(tag_id => {
				return {
					product_id: req.params.id,
					tag_id,
				};
			});
		// figure out which ones to remove
		const productTagsRemove = productTags
			.filter(({tag_id}) => !req.body.tagIds.includes(tag_id))
			.map(({id}) => id);

		// run both actions
		return Promise.all([
			ProductTag.destroy({
				where: {
					id: productTagsRemove
				} 
			}),
			ProductTag.bulkCreate(newTagIds),
		]);
	})
	.then((updatedTags) => res.json(updatedTags))
	.catch((error) => {
		res.status(400).json(error);
	});
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
	Product.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(deletedProduct => {
			if (!deletedProduct) {
				res.status(404).json('There is no such product with that id!')
			}
			res.json(deletedProduct);
		})
		.catch((error) => res.json(error));
});

module.exports = router;
