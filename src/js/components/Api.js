/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

export class Api {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  getAllTickets() {
    return fetch(`${this.url}?method=allTickets`, {
      method: 'GET',
    });
  }

  createTicket(query) {
    return fetch(
      `${this.url}?method=createTicket&name=${query.name}&description=${query.description}`,
      {
        method: 'POST',
        headers: this.contentTypeHeader,
      }
    );
  }

  getTicketById(id) {
    return fetch(`${this.url}?method=ticketById&id=${id}`, {
      method: 'GET',
    });
  }

  remove(id) {
    return fetch(`${this.url}?method=removeTicket&id=${id}`, {
      method: 'DELETE',
      headers: this.contentTypeHeader,
    });
  }
}
