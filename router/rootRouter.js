const express = require('express');
const router = express.Router();


const page = require('../lib/page');
const author = require('../lib/author');

router.get('/', (req, res) => {
    page.login_page(req, res);
});

router.get('/login', (req, res) => {
    page.login_page(req, res);
});

router.post('/login_process', (req, res) => {
    page.login_process(req, res);
});

router.get('/logout_process', (req, res) => {
    page.logout_process(req, res);
})
router.get('/proxy_login', (req, res) => {
    page.login_process_proxy(req, res);
})

router.get('/register', (req, res) => {
    page.register(req, res);
});

router.post('/register_process', (req, res) => {
    page.register_process(req, res);
})

router.get('/findPassword', (req, res) => {
    page.findPassword(req, res);
})

router.get('/home', (req, res) => {
    page.home(req, res);
})


module.exports = router;