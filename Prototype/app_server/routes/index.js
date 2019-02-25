var express = require('express');
var router = express.Router();
var ctrlMain = require("../controllers/main");


/*
 * GET Home Page.
 */
router.get('/', ctrlMain.index);

/*
 * GET Add Crime Page.
 */
router.get('/addcrime', ctrlMain.get_addcrime);
router.get('/register', ctrlMain.get_register);

router.get('/viewcrime', ctrlMain.get_viewcrime);
router.get('/login', ctrlMain.get_login);
router.get('/logout', ctrlMain.get_logout);

/*
 * POST text fields page.
 */
router.post('/addcrime', ctrlMain.post_addcrime);
router.post('/register', ctrlMain.post_register);
router.post('/login', ctrlMain.post_login);


module.exports = router;



























module.exports = router;
