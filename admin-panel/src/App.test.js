import { render, screen } from '@testing-library/react';
import React from 'react';

// jest can't resolve the ESM entrypoint of react-router-dom during tests,
// so we provide a lightweight mock that exposes the components our app uses.
// mark as virtual so Jest doesn't attempt to resolve the real package
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: () => <></>,
  Link: ({ children }) => <>{children}</>,
}), { virtual: true });

// axios ships as an ES module which Jest isn't transforming; provide a simple
// CommonJS-compatible mock so imports succeed without hitting the real code.
jest.mock('axios', () => {
  const mock = jest.fn(() => mock);
  mock.create = () => mock;
  mock.get = jest.fn();
  mock.post = jest.fn();
  return mock;
});

import App from './App';

test('renders admin dashboard header', () => {
  render(<App />);
  // check for a piece of text that should always be present in our layout
  const header = screen.getByText(/admin dashboard/i);
  expect(header).toBeInTheDocument();
});
