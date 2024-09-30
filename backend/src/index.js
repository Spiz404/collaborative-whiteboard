"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
app.listen(8080, function () {
    console.log("Server running on http://localhost:8080");
});
