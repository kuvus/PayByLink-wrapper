# PAYBYLINK.PL-Wrapper

PAYBYLINK-Wrapper is a simple, unofficial wrapper for PayByLink.pl API

This package is based on an official paybylink.pl API documentation available [here](https://paybylink.pl/dokumentacja-przelewy.pdf).

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
const { PblClient } = require('paybylink-wrapper')
const pbl = new PblClient(secret, shopId)

pbl.generateTransaction({
    price,
    control,
    description,
    email,
    notifyURL,
    returnUrlSuccess,
    returnUrlSuccessTidPass,
    hideReceiver,
    customFinishNote,
})
    .then(transaction => console.log(transaction))
```

## Functions
### generateTransaction
#### Asynchronous
#### Parameters:

options (Object):

| Key                     | Type    | Required |  
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

### generateBlikWhiteLabelTransaction
#### Asynchronous
#### Parameters:

options (Object):

|       Key        |  Type  | Required |  
|:----------------:|:------:|:--------:|
|      price       | Number |   True   |
|       code       | String |   True   |
|    customerIP    | String |   True   |
|     control      | String |  False   | 
| notifyPaymentURL | String |  False   |
| notifyStatusURL  | String |  False   |

> API documentation doesn't specify if there could be any error response ¯\_(ツ)_/¯

Example success result
```javascript
{
    transactionId: "w3WUQXsMgSYc9gH3V8HcvHxazU5TvJLJ"
}
```

### cancelTransaction
#### Asynchronous
#### Parameters:

|   Parameter   |  Type  | Required |  
|:-------------:|:------:|:--------:|
| transactionId | Number |   True   |
| customReason  | String |  False   |

Example result
```javascript
{
    cancelled: false,
    cancelError: "Transaction alredy cancelled"
}
```

### validateTransactionNotification
#### Synchronous
#### Parameters:

notification (object): - API notification response object

|      Parameter      |  Type  | Required |
|:-------------------:|:------:|:--------:|
|    transactionId    | Number |   True   |
|       control       | String |   True   |
|        email        | String |   True   |
|     amountPaid      | Number |   True   | 
| notificationAttempt | Number |   True   | 
|     paymentType     | String |   True   | 
|     apiVersion      | Number |   True   |
|      signature      | String |   True   |

Returns true or false depending on whether the API response was valid.

### validateBlikNotification
#### Synchronous
#### Parameters:

notification (object): - API notification response object


|      Parameter      |  Type  | Required |
|:-------------------:|:------:|:--------:|
|    transactionId    | Number |   True   |
|       control       | String |   True   |
|        price        | String |   True   |
|       status        | Number |   True   |
|      signature      | String |   True   |

Returns true or false depending on whether the API response was valid.


## Links
[GitHub Repository](https://github.com/kuvus/PayByLink-wrapper)  
[npm package](https://www.npmjs.com/package/paybylink-wrapper)  
[Author's website](https://kuvus.pl)  

## Author
Jakub Macioł (kuvuś)

## License
[MIT](https://github.com/kuvus/PayByLink-wrapper/blob/master/LICENSE)