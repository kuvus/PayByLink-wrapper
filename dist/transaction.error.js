"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayByLinkError = void 0;
class PayByLinkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PayByLinkError';
    }
}
exports.PayByLinkError = PayByLinkError;
//# sourceMappingURL=transaction.error.js.map