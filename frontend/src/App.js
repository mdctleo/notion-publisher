import React from 'react';
import './App.css';
import DirectoryInput from "./directory-input";
import DirectoryTree from "./directory-display"
// import 'element-theme-default';
import 'antd/dist/antd.css';
import DirectoryControl from "./directory-control"; // or 'antd/dist/antd.less'



function App() {
  return (
    <div className="App">
        <DirectoryInput/>
        <DirectoryControl/>
    </div>
  );
}

export default App;
