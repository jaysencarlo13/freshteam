import React from 'react';
import './contents.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Contents(props) {
  return (
    <>
      <Sidebar />
      <Navbar />
      <div
        className="contents container-fluid"
        style={{ paddingLeft: '100px' }}
      >
        {props.children}
      </div>
    </>
  );
}

export default Contents;
