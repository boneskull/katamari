'use strict';

const Hapi = require('hapi');
const githubWebhooksPlugin = require('hapi-github-webhooks');
const _ = require('lodash/fp');
const events = require('./event-map');
const debug = require('debug')('katamari:server');

require('dotenv')
  .config();

const katamari = new Hapi.Server();

const applyConnectionDefaults = _.defaults({
  port: 3001
});

const applyAuthDefaults = _.defaults({
  secret: ''
});

katamari.register(githubWebhooksPlugin, err => {
  if (err) {
    throw err;
  }

  // Register github webhook auth strategy
  katamari.auth.strategy('githubwebhook', 'githubwebhook', applyAuthDefaults({
    secret: process.env.WEBHOOK_SECRET
  }));

  // Apply the strategy to the route that handles webhooks
  katamari.route([
    {
      method: 'POST',
      path: '/',
      config: {
        auth: {
          strategies: ['githubwebhook'],
          payload: 'required'
        }
      },
      handler (request, reply) {
        // request.payload is the validated payload from GitHub
        debug(payload);
        const eventName = request.payload.event;
        if (_.isFunction(events[eventName])) {
          events[eventName](request, reply);
        } else {
          reply();
        }
      }
    }
  ]);

  katamari.start(err => {
    if (err) {
      throw err;
    }
    console.log(`started on port ${katamari.info.port}`);
  });
});
