import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SearchList from "./components/SearchList/SearchList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          title="React Playground"
          className="App-logo"
          alt="logo"
        />
      </header>
      <main>
        <SearchList />
      </main>
    </div>
  );
}

export default App;
