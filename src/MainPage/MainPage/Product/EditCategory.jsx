import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";

const EditEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        username: '',
        email: '',
        roles: [], // Array for roles
        password: '',
    });

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
        fetchEmployee();
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
        // Convert the value to an array
        const selectedRoles = $(e.target).val() || [];
        setEmployee(prevState => ({
            ...prevState,
            roles: selectedRoles,
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
                                                { id: 'employee', text: 'employee' },
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
