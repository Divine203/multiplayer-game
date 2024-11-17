// const path = require('path');

// module.exports = {
//     devtool: 'eval-source-map',
//     entry: './src/main.ts',
//     module: {
//         rules: [
//             {
//                 test: /\.ts$/,
//                 use: 'ts-loader',
//                 include: [path.resolve(__dirname, 'src')]
//             }
//         ]
//     },
//     resolve: {
//         extensions: ['.ts', '.js'],
//     },
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, 'public')
//     },
//     mode: 'development'
// }

// const path = require('path');

// module.exports = {
//     devtool: 'eval-source-map',
//     entry: './src/main.ts',
//     module: {
//         rules: [
//             {
//                 test: /\.ts$/,
//                 use: 'ts-loader',
//                 include: [path.resolve(__dirname, 'src')]
//             }
//         ]
//     },
//     resolve: {
//         extensions: ['.ts', '.js'],
//     },
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, 'public')
//     },
//     devServer: {
//         static: {
//             directory: path.resolve(__dirname, 'assets'), // Serve the 'assets' folder
//             publicPath: '/assets', // Expose it at '/assets' in the browser
//         },
//         port: 8080,
//         open: true,
//     },
//     mode: 'development'
// };


const path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        static: [
            {
                directory: path.resolve(__dirname, 'assets'), // Serve assets folder
                publicPath: '/assets', // Expose at '/assets'
            },
            {
                directory: path.resolve(__dirname, 'public'), // Serve Webpack output folder
            },
        ],
        port: 8080,
        open: true,
    },
    mode: 'development'
};
