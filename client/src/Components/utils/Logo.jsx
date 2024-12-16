import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" style={{ textDecoration: "none", color: "inherit" }} className="logo">
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Insérez ici votre logo */}
      <h1 style={{ margin: 0 }}>MyTree</h1>
    </div>
  </Link>
);

export default Logo;
