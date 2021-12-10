const path = require('path')
module.exports = {
    parser: require('postcss-comment'),
    plugins: [
        require('postcss-import')({
            resolve(id, basedir, importOptions) {
                if (id.startsWith('~@/')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
                } else if (id.startsWith('@/')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
                } else if (id.startsWith('/') && !id.startsWith('//')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
                }
                return id
            }
        }),
        require('autoprefixer')({
            remove: process.env.UNI_PLATFORM !== 'h5'
        }),
        require('./loader/css-unit-transfer/index')({
            base: 0.5,
            precision: 5,
            selectorBlackList: [],
            propWhiteList: [],
            propBlackList: [],
            ignoreIdentifier: false,
            replace: true,
            mediaQuery: false,
            minPixelValue: 2,
            unitFrom: 'px',
            unitTo: 'rpx'
        }),
        require('@dcloudio/vue-cli-plugin-uni/packages/postcss')
    ]
}