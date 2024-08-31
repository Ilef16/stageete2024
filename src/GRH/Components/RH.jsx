import React from "react";

const RH = () => {
    const history = useHistory();

    // Exemple de fonction pour déconnecter l'utilisateur
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRoles');
        history.push('/signin');
    };

    return (
        <div className="dashboard">
            <h1>hi</h1>
            <p>Welcome .</p>
            <button onClick={handleLogout} className="btn btn-logout">
                Logout
            </button>
        </div>
    );
}

export default RH;
