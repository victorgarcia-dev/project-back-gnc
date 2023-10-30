const { Base64 } = require('js-base64');

const getCredentials = (req) => {
    let credentials = undefined;

    if (
        typeof req.headers !== 'undefined' && typeof req.headers.authorization !== 'undefined' &&
        req.headers.authorization.indexOf('Basic ') !== -1
    ) {
        let data = Base64.decode(req.headers.authorization.split('Basic ')[1]);

        if (data.indexOf(':') !== -1) data = data.split(':');
        console.log(credentials);
        if (data.length === 2) {
            credentials = {
                name: data[0],
                pass: data[1],
            };
        }
    }

    return credentials;
};

module.exports = {
    getCredentials,
};
