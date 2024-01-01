"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aws_1 = require("src/utils/aws");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    const secureUploadUrl = (0, aws_1.getUploadUrl)();
    const jsonData = {
        secureUploadUrl,
        timestamp: new Date().toISOString(),
    };
    res.json(jsonData);
});
exports.default = router;
