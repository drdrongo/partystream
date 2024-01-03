"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const aws_1 = require("src/utils/aws");
const router = (0, express_1.Router)();
router.get('/file-extension', (0, express_async_handler_1.default)(async (req, res, _next) => {
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
}));
exports.default = router;
