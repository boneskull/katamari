'use strict';

export default require('require-all')({
  dirname: `${__dirname}/events`,
  filter: /\.js$/
});

