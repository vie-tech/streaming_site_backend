"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nocache = void 0;
const nocache = (req, res, next) => {
    res.header('Cache-control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};
exports.nocache = nocache;
