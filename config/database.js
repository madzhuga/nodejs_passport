/* global module, process */

module.exports = {
    'url' :
        'mongodb://' +
            process.env.ML_USER + ':' +
            process.env.ML_PASSWORD +
            '@' +
            process.env.ML_DB +
            '/tumba'
};
