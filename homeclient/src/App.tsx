import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Layout>
          <Home />
        </Layout>
      </div>
    </QueryClientProvider>
  );
}

export default App;
