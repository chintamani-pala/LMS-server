"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const couse_route_1 = __importDefault(require("./routes/couse.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
require("dotenv").config();
const express_rate_limit_1 = require("express-rate-limit");
//body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
//cookie parse
exports.app.use((0, cookie_parser_1.default)());
//cors=>cross origin resource sharing
exports.app.use((0, cors_1.default)({
    origin: "https://learn.chintamanipala.in",
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
});
exports.app.use("/api/v1", user_route_1.default);
exports.app.use("/api/v1", couse_route_1.default);
exports.app.use("/api/v1", order_route_1.default);
exports.app.use("/api/v1", notification_route_1.default);
exports.app.use("/api/v1", analytics_route_1.default);
exports.app.use("/api/v1", layout_route_1.default);
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
//post request test
exports.app.post("/posttest", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Post API is working",
    });
});
//unknown route
exports.app.all("/*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not fount`);
    err.statusCode = 404;
    next(err);
});
// Apply the rate limiting middleware to all requests.
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
