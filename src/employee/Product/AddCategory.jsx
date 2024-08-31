import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AddUser = () => {
    const [user, setUser] = useState({
        ematricule: '', 
        username: '',
        email: '',
        roles: [],
        password: '',
    });

    const history = useHistory();

    useEffect(() => {
        // Fetch Ematricule data when component mounts
        const fetchEmatricule = async () => {
            try {
                const response = await fetch('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/employees', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch Ematricule data');
                }

                const data = await response.json();

                if (data.length > 0) {
                    setUser(prevState => ({
                        ...prevState,
                        ematricule: data[0].Ematricule // Assuming you want to fetch the first Ematricule
                    }));
                }
            } catch (error) {
                console.error('Error fetching Ematricule data:', error.message);
            }
        };

        fetchEmatricule();
    }, []);

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
            roles: [selectedRole]
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
                ematricule: '', 
                username: '',
                email: '',
                roles: [],
                password: '',
            });
            history.push('/dream-pos/product/categorylist-product');
        } catch (error) {
            console.error('Error adding user:', error.message);
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
                                        <label>Ematricule</label>
                                        <input 
                                            type="text" 
                                            name="ematricule" 
                                            value={user.ematricule} 
                                            readOnly
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input 
                                            type="text" 
                                            name="username" 
                                            value={user.username} 
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={user.email} 
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select 
                                            name="roles" 
                                            value={user.roles[0] || ''} 
                                            onChange={handleSelectChange}
                                            className="form-control"
                                        >
                                            <option value="">Choose Role</option>
                                            <option value="RH">RH</option>
                                            <option value="employee">Employee</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={user.password} 
                                            onChange={handleChange}
                                            className="form-control"
                                        />
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
