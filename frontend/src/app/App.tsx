import { AppProviders } from './providers';
import { AppRouter } from './router';

/** Root component: wraps the router in global providers. Keep it tiny. */
export default function App(): JSX.Element {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
