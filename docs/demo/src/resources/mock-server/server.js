/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable class-methods-use-this */

const users = [
  { id: 1, name: 'Lloyd', description: 'Teacher', picture: '/src/resources/fixtures/face.png' },
  { id: 2, name: 'Mona', description: 'Student', picture: '/src/resources/fixtures/face2.png' },
  { id: 3, name: 'Francesco', description: 'Director', picture: '/src/resources/fixtures/face.png' },
];
const usersNext = [
  { id: 4, name: 'Patrick', description: 'Teacher', picture: '/src/resources/fixtures/face.png' },
  { id: 5, name: 'Jason "Jaz" Washington', description: 'Student', picture: '/src/resources/fixtures/face.png' },
  { id: 6, name: 'Gwendolyn', description: 'Director', picture: '/src/resources/fixtures/face2.png' },
];
const usersFinal = [
  { id: 7, name: 'Andrea', description: 'Teacher', picture: '/src/resources/fixtures/face2.png' },
  { id: 8, name: 'Massimo', description: 'Student', picture: '/src/resources/fixtures/face.png' },
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
        ctx.response.body = {
          data: users,
        };
      }),
      router.get('/mock/template', (ctx) => {
        wait(2000);
        ctx.response.type = 'json';
        ctx.response.body = {
          name: 'Brenda Brendon',
          description: 'Such a Brend',
        };
      }),
      router.get('/mock/seemore/1', (ctx) => {
        wait(2000);
        ctx.response.type = 'json';
        ctx.response.body = {
          data: {
            items: users,
            nextLink: '/mock/seemore/2',
          },
        };
      }),
      router.get('/mock/seemore/2', (ctx) => {
        wait(2000);
        ctx.response.type = 'json';
        ctx.response.body = {
          data: {
            items: usersNext,
            nextLink: '/mock/seemore/3',
          },
        };
      }),
      router.get('/mock/seemore/3', (ctx) => {
        wait(2000);
        ctx.response.type = 'json';
        ctx.response.body = {
          data: {
            items: usersFinal,
          },
        };
      }),
      router.post('/mock/search/success', (ctx) => {
        // Volunteer wait to see loading state
        wait(2000);
        ctx.response.type = 'json';
        ctx.response.body = {
          data: {
            items: users,
            nextLink: '/mock/seemore/2',
          },
        };
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
