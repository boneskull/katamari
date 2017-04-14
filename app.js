const hapi = require('hapi');
const githubWebhooksPlugin = require('hapi-github-webhooks');
const token = process.env.WEBHOOK_SECRET;
const server = new hapi.Server();

server.connection({
  port: process.env.PORT || 5000
});

server.register(githubWebhooksPlugin, function (err) {
  // Register github webhook auth strategy 
  server.auth.strategy('githubwebhook', 'githubwebhook', {secret: token});
  // Apply the strategy to the route that handles webhooks 
  server.route([
    {
      method: 'POST',
      path: '/webhooks/github',
      config: {
        auth: {
          strategies: ['githubwebhook'],
          payload: 'required'
        }
      },
      handler: function (request, reply) {
        // request.payload is the validated payload from GitHub
        console.log(request.payload);
        reply();
      }
    }
  ]);
});
