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
exports.Client = void 0;
// import fetch from 'node-fetch'
const js_sha256_1 = require("js-sha256");
const axios_1 = __importDefault(require("axios"));
class Client {
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
            console.log(requestBody, transactionParams, signature, 'aads');
            const response = yield axios_1.default.post('https://secure.paybylink.pl/api/v1/transfer/generate', requestBody);
            console.log(response.data);
            // return await fetch('https://secure.paybylink.pl/api/v1/transfer/generate', {
            //     method: 'POST',
            //     body: JSON.stringify(requestBody),
            //     headers: { 'Content-Type': 'application/json' },
            // })
            //     .then(res => {
            //         if (!res.ok) {
            //             console.log(res)
            //         }
            //         return res.json()
            //     })
            //     .catch(e => {
            //         throw new Error(e)
            //     })
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=index.js.map