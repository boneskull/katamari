'use strict';

const debug = require('debug')('katamari:events:issues');

module.exports = function (request, reply) {
  debug(request);
  reply();
}
