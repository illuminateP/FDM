const express = require('express');
const router = express.Router();

const board = require('../lib/board');


router.get('/view/3', (req, res) => {
    board.view_3(req, res);
});

router.post('/create_process', (req, res) => {
    board.create_process(req, res);
});

router.post('/update_process', (req, res) => {
    board.update_process(req, res);
});

router.get('/delete/:pageId', (req, res) => {
    board.delete_process(req, res);
});

module.exports = router;