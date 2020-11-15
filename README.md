# Ecoledirecte API
:warning: EARLY WIP

Unofficial API Client for EcoleDirecte

Currently supports fetching Homeworks

## Installation:
```
npm install ecoledirecte-api
```

## Example:
```js
import EcoleDirecte from './index.js'

let ED = new EcoleDirecte("EDELEVE", "0"); // Login, Password
let options = {
	    "format": "raw" // raw, simplified, plaintext. default: plaintext
}

ED.getHomeworks("2020-11-16", options) //only the first argument (date) is required
    .then(hw => console.log(hw))
    .catch(e => console.error); 

ED.getGrades()
    .then(grades => {console.log(grades)})
    .catch(e => console.log);
```
