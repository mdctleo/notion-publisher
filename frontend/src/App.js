import React from 'react';
import './App.css';
import DirectoryInput from "./directory-input";
import DirectoryTree from "./directory-display"
import 'element-theme-default';
import {Steps} from "element-react";


function App() {
  return (
    <div className="App">
        <DirectoryInput/>
        <DirectoryTree />
    </div>
  );
}

export default App;
