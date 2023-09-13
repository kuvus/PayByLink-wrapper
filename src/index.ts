// import fetch from 'node-fetch'
import { sha256 } from 'js-sha256'
import axios from 'axios'

type TransactionOptions = {
    price: number
    control?: string
    description?: string
    email?: string
    notifyURL?: string
    returnUrlSuccess?: string
    returnUrlSuccessTidPass?: boolean
    hideReceiver?: boolean
    customFinishNote?: string
}

export class Client {
    private readonly secret!: string
    private readonly shopId!: number

    public constructor(secret: string, shopId: number) {
        if (secret) this.secret = secret
        else throw new Error('No PayByLink secret provided.')

        if (shopId) this.shopId = shopId
        else throw new Error('No PayByLink shop ID provided.')
    }

    public async generateTransaction(options: TransactionOptions) {
        const formattedPrice: string = options.price.toFixed(2)

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
            .join('|')

        const signature: string = sha256(transactionParams)

        const requestBody: object = {
            shopId: this.shopId,
            ...options,
            signature,
        }

        console.log(requestBody, transactionParams, signature, 'aads')

        const response = await axios.post(
            'https://secure.paybylink.pl/api/v1/transfer/generate',
            requestBody
        )

        console.log(response.data)
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
    }

    // public async cancelTransaction(transactionId: number, customReason: string) {
    //     if (!transactionId) throw new Error(`You didn't provide transaction ID.`)
    //     if (!customReason) throw new Error(`You didn't provide cancel reason.`)
    //
    //     const signature: string = sha256(
    //         `${this.secret}|${this.shopId}|${transactionId}|${customReason}`
    //     )
    //     const requestBody: object = {
    //         shopId: this.shopId,
    //         transactionId,
    //         customReason,
    //         signature,
    //     }
    //
    //     return await fetch('https://secure.paybylink.pl/api/v1/transfer/cancel', {
    //         method: 'POST',
    //         body: JSON.stringify(requestBody),
    //         headers: { 'Content-Type': 'application/json' },
    //     })
    //         .then(res => {
    //             if (!res.ok) throw new Error(`An error occurred while calling the API`)
    //             return res.json()
    //         })
    //         .catch(e => {
    //             throw new Error(e)
    //         })
    // }
    //
    // public validateTransaction(response: {
    //     transactionId: string
    //     control: string
    //     email: string
    //     amountPaid: number
    //     notificationAttempt: number
    //     paymentType: string
    //     apiVersion: number
    //     signature: string
    // }) {
    //     if (!response) throw new Error(`You didn't provide API response.`)
    //     const localSignature: string = sha256(
    //         `${this.secret}|${response.transactionId}|${response.control}|${response.email}|${response.amountPaid}|${response.notificationAttempt}|${response.paymentType}|${response.apiVersion}`
    //     )
    //
    //     return response.signature === localSignature
    // }
}
