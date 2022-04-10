import React from "react";
import './navbar.scss';

import { LogoUrl } from 'constants/index';

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <div className="container-fluid d-flex align-items-center justify-content-center justify-content-sm-start">

        <a href="/">
          <img src={LogoUrl} alt="logo" />
        </a>
        <h2>
          Polygon Drawing
        </h2>

      </div>
    </div>
  );
}

export default Navbar;