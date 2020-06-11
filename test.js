EcoleDirecte = require('./index');
ED = new EcoleDirecte("EDELEVE", "0");
options = {
    "format": "raw" // raw, simplified, plaintext. default: plaintext
}
ED.getHomeworks("2020-06-12", options).then(hw => console.log(hw));