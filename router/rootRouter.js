const express = require('express');
const router = express.Router();


const page = require('../lib/page');
const author = require('../lib/author');

router.get('/',(req, res) => {
    page.login_page(req, res);
});

router.get('/login', (req, res) => {
    page.login(req, res);
});

router.post('/login_process',(req, res) => {
    page.login_process(req, res);
});

router.get('/logout_process',(req, res) => {
    page.logout_process(req, res);
});

router.get('/register',(req, res) => {
    page.register(req,res);
});

router.get('/findPassword',(req,res) => {
    page.findPassword(req,res);
})

router.get('/home',(req, res) => {
    page.home(req,res);
})

router.get('/page/:id', (req,res) =>{
    page.page(req,res);
});

router.get('/create', (req,res) => {
    page.create(req, res);
});

router.post('/create_process',(req, res) => {
    page.create_process(req, res);
});

router.get('/update/:pageId', (req, res) => {
    page.update(req, res);
});

router.post('/update_process', (req, res) => {
    page.update_process(req, res);
});

router.get('/delete/:pageId', (req, res) => {
    page.delete_process(req, res);
});

router.get('/author', (req, res) => {
    author.create(req, res);
});

router.post('/author/create_process', (req, res) => {
    author.create_process(req, res);
});

router.get('/author/update/:pageId', (req, res) => {
    author.update(req, res);
});

router.post('/author/update_process', (req, res) => {
    author.update_process(req, res);
});

router.get('/author/delete/:pageId', (req, res) => {
    author.delete_process(req, res);
});


module.exports = router;