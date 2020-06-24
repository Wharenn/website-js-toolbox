/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable class-methods-use-this */

const users = [
  { id: 1, name: 'Lloyd', age: 43 },
  { id: 2, name: 'Mona', age: 34 },
  { id: 3, name: 'Francesco', age: 24 },
];

const wait = (ms) => {
  const start = Date.now();
  let now = start;

  while (now - start < ms) {
    now = Date.now();
  }
};

class Mock {
  middleware() {
    const router = require('koa-route');

    return [
      router.get('/mock', (ctx) => {
        ctx.response.type = 'json';
        ctx.response.body = users;
      }),
      router.post('/mock/post/success', (ctx) => {
        // Volunteer wait to see loading state
        wait(2000);
        ctx.response.status = 201;
      }),
      router.post('/mock/post/success/message', (ctx) => {
        // Volunteer wait to see loading state
        wait(2000);
        ctx.response.status = 200;
        ctx.response.body = {
          status: 'success',
          message: 'Saved with success!',
        };
      }),
      router.post('/mock/post/error', (ctx) => {
        // Volunteer wait to see loading state
        wait(2000);
        ctx.response.status = 400;
        ctx.response.body = {
          status: 'error',
          message: 'An error occured',
        };
      }),
    ];
  }
}

module.exports = Mock;
