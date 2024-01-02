"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aws_1 = require("src/utils/aws");
const router = (0, express_1.Router)();
router.get('/', (req, res, _next) => {
    const { fileExtension } = req.query;
    if (typeof fileExtension !== 'string') {
        res
            .status(400)
            .json({ error: 'fileExtension is required in the query parameters' });
        return;
    }
    const secureUploadUrl = (0, aws_1.getUploadUrl)(fileExtension);
    const jsonData = {
        secureUploadUrl,
        timestamp: new Date().toISOString(),
    };
    res.json(jsonData);
});
exports.default = router;
