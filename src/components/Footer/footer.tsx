import React from "react";
import "./footer.scss";

const Footer: React.FC = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer>
      <div className="container-fluid">
        <div className="row align-items-center footer justify-content-center">
          Copyright @ {currentYear}
        </div>
      </div>
    </footer>
  );
};

export default Footer;