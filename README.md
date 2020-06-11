# Ecoledirecte API
:warning: EARLY WIP

Unofficial API for EcoleDirecte
Currently supports fetching Homeworks

## Installation:
```
npm install ecoledirecte-api
```

## Example:
```js
EcoleDirecte = require('ecoledirecte-api');
ED = new EcoleDirecte("USERNAME", "PASSWORD");
options = {
    "format": "raw" // raw, simplified, plaintext. default: plaintext
}
ED.getHomeworks("2020-06-12", options) //only the first argument (date) is required
    .then(hw => console.log(hw)); 
```
