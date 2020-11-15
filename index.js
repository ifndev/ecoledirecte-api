var request = require('request');
const htmlToText = require('html-to-text');

module.exports = class EcoleDirecte {


    //-------------------------------

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    //-------------------------------

    async getHomeworks(date, options) {
        return new Promise((resolve, reject) => {
            this._fetch(
                (loginInfo, infos) => {
                    return `https://api.ecoledirecte.com/v3/Eleves/${loginInfo.shortId}/cahierdetexte/${infos.date}.awp?verbe=get`
                },
                { "date": date })
                .then(raw => {
                    switch (options?.format) {
                        case "simplified":
                            resolve(this._parseHomeworks(raw));
                        case "raw":
                            resolve(raw.data);
                        default:
                            resolve(this._parseHomeworksPlainText(raw));
                    }
                })
                .catch(e => reject(e))
        })
    }

    async getGrades(options) {
        return new Promise((resolve, reject) => {
            this._fetch(
                (loginInfo, infos) => {
                    return `https://api.ecoledirecte.com/v3/eleves/${loginInfo.shortId}/notes.awp?verbe=get&`
                },
                {})
                .then(raw => {
                    switch (options?.format) {
                        case "simplified":
                            reject("simplified mode is not supported yet for grades");
                        default:
                            resolve(raw.data);
                    }
                })
                .catch(e => reject(e));
        });
    }

    //-------------------------------

    _login() {
        return new Promise((resolve, reject) => {


            const options = {
                url: 'https://api.ecoledirecte.com/v3/login.awp',
                method: 'POST',
                headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0' }, //User agent has to be specified AND valid for the 
                body: `data={ "identifiant": "${this.username}", "motdepasse": "${this.password}" }`
            };

            function callback(error, response, body) {
                if (!error && response.statusCode == 200) { //Pass if http request is 200

                    try { //Pass if response is actually JSON (API sometimes return html error pages with code 200)
                        const parsedRes = JSON.parse(body);
                        if (parsedRes.code === 200) { //EcoleDirecte uses it's own status code for a reason.
                            resolve({
                                "token": parsedRes.token,
                                "shortId": parsedRes.data.accounts[0].id
                            });
                        }
                        else {
                            reject("Code != 200 !");
                        }
                    }
                    catch (e) {
                        reject(e);
                    }

                }
                else {
                    reject(error);
                }
            }

            request(options, callback);
        })
    }

    _fetch(makeUrl, infos) {
        return new Promise((resolve, reject) => {
            this._login()
                .then((loginInfo) => {
                    const options = {
                        url: makeUrl(loginInfo, infos),
                        method: 'POST',
                        headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0' }, //User agent has to be specified AND valid
                        body: `data={ "token": "${loginInfo.token}" }`
                    };

                    function callback(error, response, body) {
                        const parsedRes = JSON.parse(body);
                        if (!error && parsedRes.code == 200) {
                            resolve(parsedRes);
                        }
                        else if (parsedRes.code == 520) {
                            reject("Invalid Token !");
                        }
                        else {
                            reject("Unknown error !")
                        }
                    }

                    request(options, callback);
                })
                .catch(e => reject(e))
        })
    }

    _parseHomeworksPlainText(body) {
        var disciplines = []
        body.data.matieres.forEach(discipline => {
            disciplines.push({
                "disciplineCode": discipline.codeMatiere,
                "disciplineName": discipline.matiere,
                "professorName": discipline.nomProf,
                "assignement": htmlToText.fromString(Buffer.from(discipline.aFaire.contenu, 'base64').toString('utf8'), { hideLinkHrefIfSameAsText: true }),
                "onlineFullfillement": discipline.aFaire.rendreEnLigne,

            });
        });
        return disciplines;
    }

    _parseHomeworks(body) {
        var disciplines = []
        body.data.matieres.forEach(discipline => {
            disciplines.push({
                "disciplineCode": discipline.codeMatiere,
                "disciplineName": discipline.matiere,
                "teacherName": discipline.nomProf,
                "assignement": Buffer.from(discipline.aFaire.contenu, 'base64').toString('utf8'),
                "onlineFullfillement": discipline.aFaire.rendreEnLigne,

            });
        });
        return disciplines;
    }
}

