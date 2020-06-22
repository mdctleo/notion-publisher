import React from 'react';
import './App.css';
import DirectoryInput from "./directory-input";
import DirectoryTree from "./directory-display"
// import 'element-theme-default';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'



function App() {
  return (
    <div className="App">
        <DirectoryInput/>
        <DirectoryTree />
    </div>
  );
}

export default App;
