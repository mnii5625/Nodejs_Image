const axios = require('axios');

const async = (headers, uri) => {

    return axios.get(uri, {
        responseType: 'arraybuffer',
        headers: headers
    });
};

module.exports.async = async;