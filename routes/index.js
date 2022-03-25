const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Pages. */
router.get('/page/:page', async function (req, res) {
  let p = rootDir + '/views/pages/' + req.params.page;
  // console.log("P:", p);
  let exist = fs.existsSync(p + ".ejs");
  // console.log("EXIST:", exist);
  if (exist) {
    if(p === 'unauthorized') {
      return res.status(401).render(rootDir + '/views/pages/unauthorized' );
    }
    let d = {};
    res.render(p, d);
  } else {
    res.render('views/pages/404.ejs');
  }
});

module.exports = router;
