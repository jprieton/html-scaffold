module.exports = ({ env }) => ({
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')({
      browsers: 'last 5 versions',
    }),
    env === 'production' ? require('cssnano') : false,
  ],
});
