"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const js_sha256_1 = require("js-sha256");
class Client {
    constructor(secret, shopId) {
        if (secret)
            this.secret = secret;
        else
            throw new Error(`You didn't provide PBL secret.`);
        if (shopId)
            this.shopId = shopId;
        else
            throw new Error(`You didn't provide PBL shopId.`);
    }
    async generateTransaction(price, control, description, email, notifyURL, returnUrlSuccess, returnUrlSuccessTidPass, hideReceiver, customFinishNote) {
        const formattedPrice = price.toFixed(2);
        const transactionText = `${this.secret}|${this.shopId}|${formattedPrice}${control ? `|${control}` : ''}${description ? `|${description}` : ''}${email ? `|${email}` : ''}${notifyURL ? `|${notifyURL}` : ''}${returnUrlSuccess ? `|${returnUrlSuccess}` : ''}${returnUrlSuccessTidPass ? `|${returnUrlSuccessTidPass}` : ''}${hideReceiver ? `|${hideReceiver}` : ''}${customFinishNote ? `|${customFinishNote}` : ''}`;
        const signature = js_sha256_1.sha256(transactionText.trim());
        const requestBody = {
            shopId: this.shopId,
            price,
            ...(control && { control }),
            ...(description && { description }),
            ...(email && { email }),
            ...(notifyURL && { notifyURL }),
            ...(returnUrlSuccess && { returnUrlSuccess }),
            ...(returnUrlSuccessTidPass && { returnUrlSuccessTidPass }),
            ...(hideReceiver && { hideReceiver }),
            ...(customFinishNote && { customFinishNote }),
            signature,
        };
        return await node_fetch_1.default('https://secure.paybylink.pl/api/v1/transfer/generate', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
            return res.json();
        })
            .catch(e => {
            throw new Error(e);
        });
    }
    async cancelTransaction(transactionId, customReason) {
        if (!transactionId)
            throw new Error(`You didn't provide transaction ID.`);
        if (!customReason)
            throw new Error(`You didn't provide cancel reason.`);
        const signature = js_sha256_1.sha256(`${this.secret}|${this.shopId}|${transactionId}|${customReason}`);
        const requestBody = {
            shopId: this.shopId,
            transactionId,
            customReason,
            signature,
        };
        return await node_fetch_1.default('https://secure.paybylink.pl/api/v1/transfer/cancel', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
            if (!res.ok)
                throw new Error(`An error occurred while calling the API`);
            return res.json();
        })
            .catch(e => {
            throw new Error(e);
        });
    }
    validateTransaction(response) {
        if (!response)
            throw new Error(`You didn't provide API response.`);
        const localSignature = js_sha256_1.sha256(`${this.secret}|${response.transactionId}|${response.control}|${response.email}|${response.amountPaid}|${response.notificationAttempt}|${response.paymentType}|${response.apiVersion}`);
        return response.signature === localSignature;
    }
}
exports.Client = Client;
//# sourceMappingURL=index.js.map