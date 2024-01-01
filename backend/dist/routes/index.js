"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', function (req, res, next) {
    const jsonData = {
        message: 'Hello, World!',
        timestamp: new Date().toISOString(),
    };
    res.json(jsonData);
});
exports.default = router;
