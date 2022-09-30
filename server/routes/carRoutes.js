const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');


// App Routes

router.get('/', carController.homepage);
router.get('/blog/:id', carController.exploreBlog);
router.get('/categories', carController.exploreCategories);
router.get('/categories/:id', carController.exploreCategoriesByID);
router.get('/explore-latest', carController.exploreLatest);
router.get('/about', carController.aboutus);
router.get('/contact', carController.contact);
router.post('/search', carController.searchBlog);
router.get('/submit-blog', carController.submitBlog);
router.post('/submit-blog', carController.submitBlogOnPost);


module.exports = router;