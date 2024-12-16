import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import Home from "./Components/Home/Home";
import Admin from "./Components/Admin/Admin";
import TreeManagementPage from "./Components/TreeDashboard/TreeManagementPage";
import FamilyTree from "./Components/TreeDashboard/FamilyTree";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path = "/treemanagementpage" element ={<TreeManagementPage />}></Route>
        <Route path = "/view-tree" element ={<FamilyTree />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
