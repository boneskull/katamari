'use strict';

const chokidar = require('chokidar');
const path = require('path');
const git = require('simple-git')(path.join(__dirname, '..', 'site'));

