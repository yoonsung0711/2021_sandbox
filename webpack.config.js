const path = require('path');

module.exports = {
    mode: 'none',
    entry: './_.js',
    output: {
        filename: '_.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: __dirname + "/dist/",
        inline: true,
        hot: true,
        port: 4000
    }
}
