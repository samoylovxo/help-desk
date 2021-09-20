/**
 * @jest-environment jsdom
 */

import { Api } from '../src/js/components/Api';

describe('Api', () => {
  it('Api create ticket', async () => {
    const api = new Api();

    const query = {};

    const response = await api.createTicket(query);

    expect(response).toBe(1);
  });
});
