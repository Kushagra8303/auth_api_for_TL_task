import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// axios is an ES module; jest can't parse its import form, so we mock it first.
jest.mock('axios', () => {
  const mock = jest.fn(() => mock);
  mock.create = () => mock;
  mock.get = jest.fn();
  mock.post = jest.fn();
  return mock;
});

import Dashboard from './Dashboard';
import * as api from '../services/api';

// we'll spy on api.getUsers in each test to control what it returns


describe('Dashboard page', () => {
  beforeEach(() => {
    // silence console.log so rejected promise doesn't spam test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    if (api.getUsers.mockClear) api.getUsers.mockClear();
  });

  it('shows counts when users arrive', async () => {
    const fakeUsers = [
      { loginHistory: [1, 2] },
      { loginHistory: [] },
      { loginHistory: [3] },
    ];
    jest.spyOn(api, 'getUsers').mockResolvedValue({ data: { users: fakeUsers } });

    render(<Dashboard />);

    // wait until both cards have updated to '3'
    await waitFor(() => expect(screen.getAllByText('3').length).toBe(2));

    // sanity-check: exactly two elements contain the count
    expect(screen.getAllByText('3').length).toBe(2);
  });

  it('displays error text if request fails', async () => {
    jest.spyOn(api, 'getUsers').mockRejectedValue(new Error('network failure'));
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
