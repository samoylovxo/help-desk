/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

import { Api } from './Api';

export class Desk {
  constructor(element, url) {
    // Props
    if (typeof element === 'string') {
      this.element = document.querySelector(element);
    }
    this.api = new Api(url);
    this.ticket = null;
    this.isEditTicket = null;

    // Elements
    this.ticketRow = this.element.querySelector('.desk__ticket-row');
    this.addTicketBtn = this.element.querySelector('.add-ticket-btn');
    this.changeTicketBtn = this.element.querySelectorAll('.desk__ticket-edit');
    this.closeModalBtns = this.element.querySelectorAll('.btn-close');
    this.modalAdd = this.element.querySelector('.desk__modal-add');
    this.modalDelete = this.element.querySelector('.desk__modal-delete');
    this.modalTitle = this.element.querySelector('.desk__modal-title');
    this.inputName = this.element.querySelector('.desk__input-name');
    this.inputDesc = this.element.querySelector('.desk__input-desc');
    this.from = this.element.querySelector('.desk__from');
    this.btnOk = this.element.querySelector('.btn-ok');

    // Binds
    this.init = this.init.bind(this);
    this.renderTickets = this.renderTickets.bind(this);
    this.removeTicket = this.removeTicket.bind(this);
    this.showModal = this.showModal.bind(this);
    this.createTicket = this.createTicket.bind(this);
    this.getDescription = this.getDescription.bind(this);
    this.showDescription = this.showDescription.bind(this);

    // Listeners
    this.addTicketBtn.addEventListener('click', this.showModal);
    this.closeModalBtns.forEach((btn) =>
      btn.addEventListener('click', this.showModal)
    );
    this.from.addEventListener('submit', this.createTicket);
    this.ticketRow.addEventListener('click', this.getDescription);
    this.ticketRow.addEventListener('click', this.showDescription);
    this.ticketRow.addEventListener('click', this.showModal);

    // Start app
    this.init();
  }

  init() {
    this.api
      .getAllTickets()
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          this.ticketRow.innerHTML =
            '<h2>Тикетов пока нет, добавьте новый</h2>';
        } else {
          this.ticketRow.innerHTML = '';
          this.renderTickets();
        }
      });
  }

  async removeTicket(e) {
    const { target } = e;
    const ticket = target.closest('.desk__ticket');

    await this.api.remove(ticket.dataset.id);

    this.init();
    this.modalDelete.classList.remove('show');
  }

  async renderTickets() {
    const response = await this.api.getAllTickets();
    const data = await response.json();

    data.forEach((ticketData) => {
      this.ticket = `<div class="desk__ticket" data-id="${ticketData.id}">
            <div class="desk__ticket-content">
              <input type="checkbox" class="desk__ticket-checkbox"/>
              <h2 class="desk__ticket-title">${ticketData.name}</h2>
              <div class="desk__ticket-datetime">${ticketData.created}</div>
              <div class="desk__ticket-actions">
                <button class="btn desk__ticket-edit">Edit</button>
                <button class="btn desk__ticket-delete">Х</button>
              </div>
            </div>
          </div>`;

      this.ticketRow.insertAdjacentHTML('beforeend', this.ticket);
    });
  }

  showModal(e) {
    const { target } = e;

    this.modalDelete.classList.remove('show');
    this.modalAdd.classList.remove('show');

    if (target.classList.contains('add-ticket-btn')) {
      this.inputName.value = '';
      this.inputDesc.value = '';
      this.modalTitle.innerText = 'Добавить тикет';

      this.modalAdd.classList.add('show');
      return;
    }

    if (target.classList.contains('desk__ticket-edit')) {
      const ticket = target.closest('.desk__ticket');

      this.isEditTicket = ticket;

      this.api
        .getTicketById(ticket.dataset.id)
        .then((response) => response.json())
        .then((data) => {
          this.inputName.value = data.ticket.name;
          this.inputDesc.value = data.ticket.description;
        });

      this.modalTitle.innerText = 'Изменить тикет';
      this.modalAdd.classList.add('show');

      return;
    }

    if (target.classList.contains('desk__ticket-delete')) {
      this.modalDelete.classList.add('show');
      this.btnOk.addEventListener('click', () => {
        this.removeTicket(e);
      });
    }
  }

  async createTicket(e) {
    e.preventDefault();

    const query = {
      name: this.inputName.value,
      description: this.inputDesc.value,
    };

    if (this.isEditTicket) {
      const title = this.isEditTicket.querySelector('.desk__ticket-title');
      const desc = this.isEditTicket.querySelector('.desk__ticket-desc');

      this.api
        .editTicket(this.isEditTicket.dataset.id, query)
        .then((response) => response.json())
        .then((data) => {
          if (data.status && title && desc) {
            title.innerText = this.inputName.value;
            desc.innerText = this.inputDesc.value;
          }
        });

      this.modalAdd.classList.remove('show');

      this.isEditTicket = null;

      return;
    }

    await this.api.createTicket(query);

    this.modalAdd.classList.remove('show');
    this.inputName.value = '';
    this.inputDesc.value = '';

    this.init();
  }

  async getDescription(e) {
    const { target } = e;
    const ticket = target.closest('.desk__ticket');

    if (!ticket) return;

    const isDesc = ticket.querySelector('.desk__ticket-desc');

    if (isDesc) return;

    const response = await this.api.getTicketById(ticket.dataset.id);
    const data = await response.json();

    if (data.ticket.description) {
      const desc = `<div class="desk__ticket-desc">${data.ticket.description}</div>`;

      ticket.insertAdjacentHTML('beforeend', desc);
    }
  }

  showDescription(e) {
    const { target } = e;

    if (target.classList.contains('btn')) return;

    const ticket = target.closest('.desk__ticket');

    if (!ticket) return;

    const desc = ticket.querySelector('.desk__ticket-desc');

    if (desc) desc.remove();
  }
}
