var express = require('express');
var router = express.Router();
var ctrlMain = require("../controllers/main");

/*
 * GET home page.
 */
router.get('/', ctrlMain.home);

/*
* Text Fields
*/
router.get('/textfields', ctrlMain.get_textfields);
router.post('/textfields', ctrlMain.post_textfields);


/*
* Check Boxes
*/
router.get('/checkboxes', ctrlMain.get_checkboxes);
router.post('/checkboxes', ctrlMain.post_checkboxes);

/*
* Radio
*/

router.get('/radiobuttons', ctrlMain.get_radiobuttons);
router.post('/radiobuttons', ctrlMain.post_radiobuttons);

/*
*Menu
*/
router.get('/menu', ctrlMain.get_menu);
router.post('/menu', ctrlMain.post_menu);



module.exports = router;
