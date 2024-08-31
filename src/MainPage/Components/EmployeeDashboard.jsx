import React from 'react';
import { useHistory } from 'react-router-dom';

const EmployeeDashboard = () => {
    const history = useHistory();

    // Exemple de fonction pour déconnecter l'utilisateur
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRoles');
        history.push('/signin');
    };

    return (
        <div className="dashboard">
            <h1>Employee Dashboard</h1>
            <p>Welcome to the Employee dashboard. Here you can view your requests and personal information.</p>
            <button onClick={handleLogout} className="btn btn-logout">
                Logout
            </button>
        </div>
    );
};

export default EmployeeDashboard;