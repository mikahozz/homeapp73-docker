import "./App.css";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";

function App() {
  return (
    <>
      <div>
        <Layout>
          <Home />
        </Layout>
      </div>
    </>
  );
}

export default App;
