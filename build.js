var webpack = require('webpack');

var mode = process.env.NODE_ENV || 'production';

var config = {

    context: __dirname + '/src',

    entry: './browser',

    output: {
        path: __dirname + '/dist',
        filename: 'sansSel.js',
    },

    plugins: [

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(mode)
            }
        }),

    ],
};

if (mode === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unsafe: true,
                warnings: false,
            }
        })
    );
}

var wp = webpack(config);

function callback(error, stats) {
    console.log(String(error || stats));
}

if (mode === 'development') {
    wp.watch(200, callback);
}
else {
    wp.run(callback);
}
