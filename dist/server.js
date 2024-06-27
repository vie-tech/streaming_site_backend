"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const startup_1 = __importDefault(require("./src/home/startup"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 6161;
console.log(`Database connection established`);
startup_1.default.listen(PORT, () => {
    console.log(`Server connected and listening on port ${PORT}`);
});
