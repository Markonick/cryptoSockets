import logo from './logo.svg';
import OrderBook from './OrderBook';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img 
          src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=010" 
          style={{height: "100px"}}
          className="App-logo"
          alt="logo"
        />
        <p>
        </p>
        
        <OrderBook/>
      </header>
    </div>
  );
}

export default App;
