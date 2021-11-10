import { waitFor, render, screen } from '@testing-library/react';
import App from './App';

jest.setTimeout(30000)

test('Title Rendered', () => {
  render(<App />);
  const linkElement = screen.getByText('AquaTracker');
  expect(linkElement).toBeInTheDocument();
});

// When "onTilesLoaded" event runs, add a div with title "ALERT_DIV: MAP_LOADED"
test('Map Loaded', async () => {
  render(<App/>);
  await waitFor(() => {
    expect(screen.findByTitle("ALERT_DIV: MAP_LOADED")).toBeInTheDocument()
  }, {timeout: 20000})
});