import './App.css';
import { UserProvider } from "./contexts/index"
import Context from './components/Context';

function App() {
  return (
    <UserProvider>
      <Context />
    </UserProvider>

  );
};

export default App;
