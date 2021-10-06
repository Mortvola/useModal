const path = require('path');

const config = (name, env) => ({
  name,
  mode: env.production ? 'production' : 'development',
  devtool: env.production ? 'source-map' : 'inline-source-map',
  entry: `./src/${name}.tsx`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${name}.js`,
    library: {
      type: 'commonjs',
    }
  },
  externals: {
    'react': 'commonjs react',
  },
  module: {
    rules: [
      { test: /.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCaseOnly',
                localIdentName: '[name]-[local]-[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread'],
          },
        },
        exclude: [/node_modules/, /dist/],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
});

module.exports = [
  (env) => config('useModal', env),
];
