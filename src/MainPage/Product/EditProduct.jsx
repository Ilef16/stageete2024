import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom"; 
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";

const EditEmployee = () => {
    const { id } = useParams(); 
    const [employee, setEmployee] = useState({
        ematricule: '',
        eprenom: '',
        enom: '',
        ecin: '',
        edatenaiss: '',
        esexe: '',
        // other fields...
    });

    const history = useHistory();

    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`https://cmc.crm-edi.info/paraMobile/api/public/api/v1/employees/${id}`, {
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
        setEmployee(prevState => ({
            ...prevState,
            esexe: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://cmc.crm-edi.info/paraMobile/api/public/api/v1/employees/${id}`, {
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
            history.push('/dream-pos/product/productlist-product');
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
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Matricule</label>
                                        <input 
                                            type="text" 
                                            name="ematricule" 
                                            value={employee.ematricule} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Prenom</label>
                                        <input 
                                            type="text" 
                                            name="eprenom" 
                                            value={employee.eprenom} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Nom</label>
                                        <input 
                                            type="text" 
                                            name="enom" 
                                            value={employee.enom} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>CIN</label>
                                        <input 
                                            type="text" 
                                            name="ecin" 
                                            value={employee.ecin} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Date de Naissance</label>
                                        <input 
                                            type="date" 
                                            name="edatenaiss" 
                                            value={employee.edatenaiss ? employee.edatenaiss.split('T')[0] : ''} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Sexe</label>
                                        <Select2
                                            className="select"
                                            data={[
                                                { id: 'M', text: 'Male' }, 
                                                { id: 'F', text: 'Female' }
                                            ]}
                                            options={{
                                                placeholder: 'Choose Gender',
                                            }}
                                            value={employee.esexe}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                </div>
                                {/* Other fields */}
                                <div className="col-lg-12">
                                    <button type="submit" className="btn btn-submit me-2">
                                        Update
                                    </button>
                                    <Link to="/dream-pos/product/productlist-product" className="btn btn-cancel">
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
