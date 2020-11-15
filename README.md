# Ecoledirecte API
:warning: EARLY WIP

Unofficial API Client for EcoleDirecte

Currently supports fetching Homeworks and Grades (raw)

## Installation:
```
npm install ecoledirecte-api
```

## Example:
```js
EcoleDirecte = require('ecoledirecte-api');

ED = new EcoleDirecte("EDELEVE", "0");
options = {
	    "format": "raw" // raw, simplified, plaintext. default: plaintext
}

ED.getHomeworks("2020-11-16", options) //only the first argument (date) is required
    .then(hw => console.log(hw))
    .catch(e => console.error); 

ED.getGrades()
    .then(grades => {console.log(grades)})
    .catch(e => console.log);
```
