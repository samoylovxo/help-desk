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

  const findTicket = query.id && db.ticketsFull.find((t) => t.id === query.id);

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
      ctx.body = findTicket
        ? {
            status: true,
            ticket: findTicket,
          }
        : { status: false };
      return;
    case 'removeTicket':
      db.tickets.splice(findTicket, 1);
      db.ticketsFull.splice(findTicket, 1);

      ctx.body = { status: true };

      return;
    case 'editTicket':
      findTicket.name = query.name;
      findTicket.description = query.description;

      ctx.body = { status: true };

      return;
    default:
      ctx.response.status = 404;
  }

  ctx.body = 'server started...';
});

const port = process.env.PORT || 7070;

http.createServer(app.callback()).listen(port);
