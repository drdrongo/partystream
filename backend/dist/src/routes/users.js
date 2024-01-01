"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', function (req, res, next) {
    res.send('respond with a resofurce');
});
exports.default = router;
