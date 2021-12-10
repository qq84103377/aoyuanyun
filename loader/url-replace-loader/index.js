const loaderUtils = require("loader-utils");
module.exports = function (source) {
    const defaultOptions = {
        to: '',
        from: '',
    };

    const options = loaderUtils.getOptions(this) || defaultOptions;

    return source.replace(new RegExp(options.from, 'g'), (match, $1) => {
        return options.to;
    });
};