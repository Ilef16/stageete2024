import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

const AddEmployee = () => {
    const [employee, setEmployee] = useState({
        ematricule: '',
        eprenom: '',
        enom: '',
        ecin: '',
        edatenaiss: '',
        esexe: '',
        enationalite: '',
        epassport: '',
        efonction: '',
        ebadge: '',
        emodepay: '',
        esituationfam: '',
        ebanque: '',
        enumcompte: '',
        ecycletravail: '',
        eassurance: '',
        edateassurance: '',
        enumassurance: '',
        echeffamille: false,
        edatemariage: '',
        enomconjoint: '',
        ecinconjoint: '',
        enombreenfant: 0,
        enombrecharge: 0
    });

    const history = useHistory(); // useHistory hook for navigation

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let parsedValue = type === 'checkbox' ? checked : value;

        if (['enombreenfant', 'enombrecharge'].includes(name)) {
            parsedValue = parseInt(value, 10) || 0;
        }

        if (['edatenaiss', 'edateassurance', 'edatemariage'].includes(name)) {
            parsedValue = value ? new Date(value).toISOString().split('T')[0] : '';
        }

        setEmployee(prevState => ({
            ...prevState,
            [name]: parsedValue,
        }));
    };

    const handleSelectChange = (e) => {
        setEmployee(prevState => ({
            ...prevState,
            esexe: e.target.value
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
            const employeeData = { ...employee };
            Object.keys(employeeData).forEach(key => {
                if (employeeData[key] === '' || employeeData[key] === 0 || employeeData[key] === false) {
                    employeeData[key] = null;
                }
            });

            const response = await fetch('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/employees', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                const data = await response.json();
                const errorMessage = data.detail || data.message || 'Unknown error';
                throw new Error(`Network response was not ok: ${errorMessage}`);
            }

            console.log('Employee added successfully');
            history.push('/dream-pos/product/productlist-product'); // Redirect to ProductList after successful save
        } catch (error) {
            console.error('Error adding employee:', error.message);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Add Employee</h4>
                        <h6>Create a new employee record</h6>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Matricule</label>
                                        <input type="text" name="ematricule" value={employee.ematricule} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Prenom</label>
                                        <input type="text" name="eprenom" value={employee.eprenom} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Nom</label>
                                        <input type="text" name="enom" value={employee.enom} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>CIN</label>
                                        <input type="text" name="ecin" value={employee.ecin} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Date de Naissance</label>
                                        <input type="date" name="edatenaiss" value={employee.edatenaiss ? employee.edatenaiss.split('T')[0] : ''} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Sexe</label>
                                        <Select2
                                            className="select"
                                            data={[{ id: 'M', text: 'Male' }, { id: 'F', text: 'Female' }]}
                                            options={{
                                                placeholder: 'Choose Gender',
                                            }}
                                            value={employee.esexe}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                </div>
                                {/* Hide additional fields for simplicity */}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
