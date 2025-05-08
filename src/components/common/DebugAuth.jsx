import React, { useContext } from 'react';
import { AuthContext } from '../../utils/authContext';

const DebugAuth = () => {
  const { currentUser, user, role, loading } = useContext(AuthContext);
  
  return (
    <div className="container mt-5 p-4 bg-light rounded">
      <h2>Authentication Debug</h2>
      <hr />
      
      <div className="mb-4">
        <h4>Auth State</h4>
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between">
            <strong>Loading:</strong> <span>{loading ? "True" : "False"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Authenticated:</strong> <span>{user ? "True" : "False"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Role:</strong> <span>{role || "None"}</span>
          </li>
        </ul>
      </div>
      
      {currentUser && (
        <div className="mb-4">
          <h4>User Info</h4>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between">
              <strong>User ID:</strong> <span>{currentUser.uid}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Email:</strong> <span>{currentUser.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Email Verified:</strong> <span>{currentUser.emailVerified ? "Yes" : "No"}</span>
            </li>
          </ul>
        </div>
      )}
      
      <div className="mt-4">
        <a href="/customer" className="btn btn-primary">Go to Dashboard</a>
        <a href="/logout" className="btn btn-outline-danger ms-2">Logout</a>
      </div>
    </div>
  );
};

export default DebugAuth;