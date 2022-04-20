import './App.css';
import { Provider } from "./contexts/index"
import Context from './components/Context';

function App() {
  return (
    <Provider>
      <Context />
    </Provider>

  );
};

export default App;
