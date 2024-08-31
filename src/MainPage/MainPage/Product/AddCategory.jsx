import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

const AddUser = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        roles: [], 
        password: '',
    });

    const history = useHistory(); // useHistory hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        const selectedRole = e.target.value;
        setUser(prevState => ({
            ...prevState,
            roles: [selectedRole] // Make roles an array with one selected role
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            // Set fields to null if they are empty
            const userData = { ...user };
            Object.keys(userData).forEach(key => {
                if (userData[key] === '' || (Array.isArray(userData[key]) && userData[key].length === 0)) {
                    userData[key] = null;
                }
            });

            const response = await fetch('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const data = await response.json();
                const errorMessage = data.detail || data.message || 'Unknown error';
                throw new Error(`Network response was not ok: ${errorMessage}`);
            }

            console.log('User added successfully');
            setUser({
                username: '',
                email: '',
                roles: [], // Reset roles to empty array
                password: '',
            }); // Clear form fields
            history.push('/dream-pos/product/categorylist-product'); // Redirect to ProductList after successful save
        } catch (error) {
            console.error('Error adding user:', error.message);
            // Optionally, show an error message to the user
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Add User</h4>
                        <h6>Create a new user record</h6>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input type="text" name="username" value={user.username} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" name="email" value={user.email} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Role</label>
                                        <Select2
                                            className="select"
                                            data={[{ id: 'RH', text: 'RH' }, { id: 'employee', text: 'Employee' }]}
                                            options={{
                                                placeholder: 'Choose Role',
                                                multiple: false, // Ensure single selection
                                            }}
                                            value={user.roles[0] || ''} // Set value to the first role if exists
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" name="password" value={user.password} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
