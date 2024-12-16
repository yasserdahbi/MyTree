import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import Logo from '../utils/Logo';

const Admin = () => {
  const [userRequests, setUserRequests] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/user-requests')
      .then((res) => setUserRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleStatusChange = (id, accepted, makeAdmin) => {
    axios
      .put(`http://localhost:3000/auth/user-requests/${id}`, { accepted, makeAdmin })
      .then((res) => {
        setUserRequests(userRequests.filter((req) => req._id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="container-header">
      <div className="header">
        <Logo className="logo" />
        <button className="logout-button top-right" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
      <h1 className="admin-title">Admin Page</h1>
      <div className="container">
        <div className="user-list">
          <div className="header-row">
            <div>Nom d'utilisateur</div>
            <div>Email</div>
            <div>Actions</div>
          </div>
          {userRequests.map((request) => (
            <div key={request._id} className="user-request-card">
              <div>{request.username}</div>
              <div>{request.email}</div>
              <div className="actions">
                <button onClick={() => handleStatusChange(request._id, true, false)}>Accepter</button>
                <button onClick={() => handleStatusChange(request._id, false, false)}>Refuser</button>
                <button onClick={() => handleStatusChange(request._id, true, true)}>Rendre Admin</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
