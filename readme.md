# PAYBYLINK.PL-WRAPPER

PAYBYLINK-WRAPPER is a simple, unofficial wrapper for PayByLink.pl API

## Installation
```ssh
npm i paybylink-wrapper
```
or
```ssh
yarn add paybylink-wrapper
```

## Example Usage
```javascript
const PayByLink = require('paybylink-wrapper').Client
const pbl = new PayByLink(secret, shopId)

pbl.generateTransaction(price, control, description, email, notifyURL, returnUrlSuccess, returnUrlSuccessTidPass, hideReceiver, customFinishNote)
    .then(transaction => console.log(transaction))
```

## Functions
### generateTransaction
#### Asynchronous
#### Parameters:

| Parameter               | Type    | Required |  
| :---------------------: |:------: | :------: |
| price                   | Number  | True     |
| control                 | String  | False    |
| description             | String  | False    |
| email                   | String  | False    |
| notifyURL               | String  | False    |
| returnUrlSuccess        | String  | False    |
| returnUrlSuccessTidPass | Boolean | False    |
| hideReceiver            | Boolean | False    |
| customFinishNote        | String  | False    |

Example error result
```javascript
{
    errorCode: 404,
    error: "shop doesn't exist"
}
```

Example success result
```javascript
{
    url: "https://secure.pbl.pl/transfer/w3WUQXsMgSYc9gH3V8HcvHxazU5TvJLJ",
    transactionId: "w3WUQXsMgSYc9gH3V8HcvHxazU5TvJLJ"
}
```

### cancelTransaction
#### Asynchronous
#### Parameters:

| Parameter     | Type   | Required |  
| :-----------: |:-----: | :------: |
| transactionId | Number | True     |
| customReason  | String | False    |

Example result
```javascript
{
    cancelled: false,
    cancelError: "Transaction alredy cancelled"
}
```

### validateTransaction
#### Synchronous
#### Parameters:

transactionId: string
control: string
email: string
amountPaid: number
notificationAttempt: number
paymentType: string
apiVersion: number
signature: string

| Parameter | Type   | Required | Description         |
| :-------: |:-----: | :------: | :-----------------: |
| response  | Object | True     | API response object |

### Response object
| Parameter           | Type   | Required |
| :-----------------: |:-----: | :------: |
| transactionId       | Number | True     |
| control             | String | True     |
| email               | String | True     |
| amountPaid          | Number | True     | 
| notificationAttempt | Number | True     | 
| paymentType         | String | True     | 
| apiVersion          | Number | True     |
| signature           | String | True     |

Returns true or false depending on whether the API response was valid.

## Links
[GitHub Repository](https://github.com/kuvus/PayByLink-wrapper)  
[npm package](https://www.npmjs.com/package/paybylink-wrapper)  
[Author's website](https://kuvus.pl)  

## Author
Jakub Macioł (kuvuś)

## License
[MIT](https://github.com/kuvus/PayByLink-wrapper/blob/master/LICENSE)