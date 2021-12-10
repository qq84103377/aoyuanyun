/**
 * respect to https://github.com/cuth/postcss-pxtorem/
 **/
const postcss = require('postcss');

const defaultOpts = {
    base: 100,
    precision: 5,
    selectorBlackList: [],
    propWhiteList: [],
    propBlackList: [],
    ignoreIdentifier: false,
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
    unitFrom: 'px',
    unitTo: 'rem'
};

const toFixed = (number, precision) => {
    const multiplier = Math.pow(10, precision + 1);
    const wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
};

const isObject = o => typeof o === 'object' && o !== null;

const createPxReplace = (opt, identifier) => (match, $1, $2) => {
    const {
        base,
        precision,
        minPixelValue,
        unitFrom,
        unitTo
    } = opt;
    if (!$1) {
        return match;
    }
    if (identifier && match.indexOf(identifier) === 0) {
        return match.replace(identifier, '');
    }
    const pixels = parseFloat($1);
    if (pixels < minPixelValue) {
        return match.replace(unitFrom, unitTo);
    }

    // { px: 100, rpx: 50 }
    const baseValue = isObject(base) ? base[$2] : base;
    const fixedVal = toFixed((pixels / baseValue), precision);

    return `${fixedVal}${unitTo}`;
};

const declarationExists = (decls, prop, value) => decls.some(decl =>
    decl.prop === prop && decl.value === value
);

const blacklistedSelector = (blacklist, selector) => {
    if (typeof selector !== 'string') return false;

    return blacklist.some(regex => {
        if (typeof regex === 'string') return selector.indexOf(regex) !== -1;

        return selector.match(regex);
    });
};

const blacklistedProp = (blacklist, prop) => {
    if (typeof prop !== 'string') return false;

    return blacklist.some(regex => {
        if (typeof regex === 'string') return prop.indexOf(regex) !== -1;

        return prop.match(regex);
    });
};

const handleIgnoreIdentifierRegx = (identifier, unit) => {
    const _identifier = identifier;
    let backslashfy = _identifier.split('').join('\\');
    backslashfy = `\\${backslashfy}`;
    const pattern = `"[^"]+"|'[^']+'|url\\([^\\)]+\\)|((?:${backslashfy}|\\d*)\\.?\\d+)(${unit})`;

    return new RegExp(pattern, 'ig');
};

module.exports = postcss.plugin('postcss-plugin-px2rem', options => {
    const opts = {
        ...defaultOpts,
        ...options
    };
    let unit = opts.unitFrom;

    if (isObject(opts.base)) {
        unit = Object.keys(opts.base).join('|');
    }

    const regText = `"[^"]+"|'[^']+'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)(${unit})`;
    let pxRegex = new RegExp(regText, 'ig');
    let identifier = opts.ignoreIdentifier;
    if (identifier && typeof identifier === 'string') {
        identifier = identifier.replace(/\s+/g, '');
        opts.replace = true;
        pxRegex = handleIgnoreIdentifierRegx(identifier, unit);
    } else {
        identifier = false;
    }
    const pxReplace = createPxReplace(opts, identifier);

    return css => {
        css.walkDecls((decl, i) => {
            const _decl = decl;
            // 1st check exclude
            if (opts.exclude && css.source.input.file && css.source.input.file.match(opts.exclude) !== null) return;
            // 2st check 'px'
            if (_decl.value.indexOf('px') === -1) return;
            // 3nd check property black list
            if (blacklistedProp(opts.propBlackList, _decl.prop)) return;
            // 4rd check property white list
            if (opts.propWhiteList.length && opts.propWhiteList.indexOf(_decl.prop) === -1) return;
            // 5th check seletor black list
            if (blacklistedSelector(opts.selectorBlackList, _decl.parent.selector)) return;

            const value = _decl.value.replace(pxRegex, pxReplace);

            // if rem unit already exists, do not add or replace
            if (declarationExists(_decl.parent, _decl.prop, value)) return;

            if (opts.replace) {
                _decl.value = value;
            } else {
                _decl.parent.insertAfter(i, _decl.clone({
                    value,
                }));
            }
        });

        if (opts.mediaQuery) {
            css.walkAtRules('media', rule => {
                const _rule = rule;
                if (_rule.params.indexOf('px') === -1) return;
                _rule.params = _rule.params.replace(pxRegex, pxReplace);
            });
        }
    };
});