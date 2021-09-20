const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const uuid = require('uuid');

const app = new Koa();
const db = require('./db');

app.use(koaBody({ urlencoded: true, multipart: true, json: true }));

app.use(cors());

app.use(async (ctx) => {
  const { query } = ctx;
  const id = uuid.v4();
  const date = new Date();

  switch (query.method) {
    case 'allTickets':
      ctx.response.body = db.tickets;
      return;
    case 'createTicket':
      db.tickets.push({
        id,
        name: query.name,
        status: true,
        created: `${date.toLocaleDateString()} ${date
          .toLocaleTimeString()
          .slice(0, -3)}`,
      });

      db.ticketsFull.push({
        id,
        name: query.name,
        description: query.description,
        status: true,
        created: `${date.toLocaleDateString()} ${date
          .toLocaleTimeString()
          .slice(0, -3)}`,
      });

      ctx.body = {
        status: true,
      };

      return;
    case 'ticketById':
      ctx.body = db.ticketsFull.find((t) => t.id === query.id)
        ? {
            status: true,
            ticket: db.ticketsFull.find((t) => t.id === query.id),
          }
        : { status: false };
      return;
    case 'removeTicket':
      db.tickets.splice(
        db.ticketsFull.findIndex((t) => t.id === query.id),
        1
      );
      db.ticketsFull.splice(
        db.ticketsFull.findIndex((t) => t.id === query.id),
        1
      );

      ctx.body = { status: true };

      return;
    default:
      ctx.response.status = 404;
  }

  ctx.body = 'server started...';
});

http.createServer(app.callback()).listen(7070);
