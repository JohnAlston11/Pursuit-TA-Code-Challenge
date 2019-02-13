import React, { Component } from 'react';
import './App.css';
import "./Responsive.css";
import Week from './Week';


class App extends Component {
  constructor(){
    super();

    this.state = {}

  }

  
  render() {
    return (
      <div className="App">
        <Week />
      </div>
    );
  }
}

export default App;
