"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PblClient = void 0;
const js_sha256_1 = require("js-sha256");
const axios_1 = __importDefault(require("axios"));
const transaction_error_1 = require("./transaction.error");
const transaction_response_1 = require("./transaction.response");
class PblClient {
    constructor(secret, shopId) {
        if (secret)
            this.secret = secret;
        else
            throw new Error('No PayByLink secret provided.');
        if (shopId)
            this.shopId = shopId;
        else
            throw new Error('No PayByLink shop ID provided.');
    }
    generateTransaction(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedPrice = options.price.toFixed(2);
            const transactionParams = [
                this.secret,
                this.shopId,
                formattedPrice,
                options.control,
                options.description,
                options.email,
                options.notifyURL,
                options.returnUrlSuccess,
                options.returnUrlSuccessTidPass,
                options.hideReceiver,
                options.customFinishNote,
            ]
                .filter(val => val)
                .join('|');
            const signature = js_sha256_1.sha256(transactionParams);
            const requestBody = Object.assign(Object.assign({ shopId: this.shopId }, options), { signature });
            const response = yield axios_1.default
                .post('https://secure.paybylink.pl/api/v1/transfer/generate', requestBody)
                .catch(e => {
                throw new transaction_error_1.PayByLinkError(e);
            });
            if (response.status !== 200)
                throw new transaction_error_1.PayByLinkError(response.data.error);
            return new transaction_response_1.TransactionResponse(response.data.url, response.data.transactionId);
        });
    }
    cancelTransaction(transactionId, customReason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!transactionId)
                throw new Error(`No transaction ID provided.`);
            if (!customReason)
                throw new Error(`No cancellation reason provided.`);
            const signature = js_sha256_1.sha256([this.secret, this.shopId, transactionId, customReason].filter(val => val).join('|'));
            const requestBody = {
                shopId: this.shopId,
                transactionId,
                customReason,
                signature,
            };
            const response = yield axios_1.default
                .post('https://secure.paybylink.pl/api/v1/transfer/cancel', requestBody)
                .catch(e => {
                throw new transaction_error_1.PayByLinkError(e);
            });
            if (!response.data.cancelled) {
                throw new transaction_error_1.PayByLinkError(`Transaction with ID ${transactionId} could not be cancelled. ${response.data.cancleerror}`);
            }
            return true;
        });
    }
    validateTransaction(notification) {
        if (!notification)
            throw new Error(`No notification body provided.`);
        const localSignature = js_sha256_1.sha256([
            this.secret,
            notification.transactionId,
            notification.control,
            notification.email,
            notification.amountPaid.toFixed(2),
            notification.notificationAttempt,
            notification.paymentType,
            notification.apiVersion,
        ]
            .filter(val => val)
            .join('|'));
        return notification.signature === localSignature;
    }
}
exports.PblClient = PblClient;
//# sourceMappingURL=index.js.map