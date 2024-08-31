import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";

const EditEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        username: '',
        email: '',
        roles: [],
        password: '',
        superieur: '', // Field for the supervisor
    });

    const [managers, setManagers] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch employee data');
                    }
                    const data = await response.json();
                    setEmployee(data);
                } catch (error) {
                    console.error('Error fetching employee data:', error);
                }
            } else {
                console.error('ID is undefined');
            }
        };

        const fetchManagers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users?role=manager', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch managers');
                }
                const data = await response.json();
                setManagers(data.map(manager => ({
                    id: manager.id,
                    text: manager.username,
                })));
            } catch (error) {
                console.error('Error fetching managers:', error);
            }
        };

        fetchEmployee();
        fetchManagers();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const parsedValue = type === 'checkbox' ? checked : value;
        setEmployee(prevState => ({
            ...prevState,
            [name]: parsedValue,
        }));
    };

    const handleSelectChange = (e) => {
        const selectedRoles = $(e.target).val() || [];
        setEmployee(prevState => ({
            ...prevState,
            roles: selectedRoles,
        }));
    };

    const handleManagerChange = (e) => {
        const selectedManager = e.target.value;
        setEmployee(prevState => ({
            ...prevState,
            superieur: selectedManager,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });
            if (!response.ok) {
                throw new Error('Failed to update employee');
            }
            history.push('/dream-pos/product/categorylist-product');
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Edit Employee</h4>
                        <h6>Update employee details</h6>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input 
                                            type="text" 
                                            name="username" 
                                            value={employee.username} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={employee.email} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Roles</label>
                                        <Select2
                                            className="select"
                                            data={[
                                                { id: 'RH', text: 'RH' },
                                                { id: 'manager', text: 'Manager' },
                                                { id: 'employee', text: 'Employee' },
                                            ]}
                                            options={{
                                                placeholder: 'Choose Role(s)',
                                                multiple: true,
                                            }}
                                            value={employee.roles}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={employee.password} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Manager</label>
                                        <select 
                                            name="superieur" 
                                            value={employee.superieur || ''} 
                                            onChange={handleManagerChange} 
                                            className="form-control"
                                        >
                                            <option value="">Select Manager</option>
                                            {managers.map(manager => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.text}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <button type="submit" className="btn btn-submit me-2">
                                        Update
                                    </button>
                                    <Link to="/dream-pos/product/categorylist-product" className="btn btn-cancel">
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployee;
