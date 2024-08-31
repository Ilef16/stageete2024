import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Authorization = () => {
    const [formData, setFormData] = useState({
        typegrh: 'DA',
        codetiers: '',
        datedeb: '',
        datefin: '',
        obj: '',
        duree: '',
        des: '',
        moydep: '',
        etatbp: false,
        etatbp1: false,
        heurdeb: '',
        heurfin: '',
    
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const ematricule = localStorage.getItem('ematricule');
            const token = localStorage.getItem('authToken');
  
            if (ematricule && token) {
                try {
                    const response = await axios.get(
                        'https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users',
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
  
                    const users = response.data;
                    const user = users.find(user => user.ematricule?.trim() === ematricule);
                    
                    if (user && user.ematricule) {
                        setFormData(prevState => ({
                            ...prevState,
                            codetiers: user.ematricule.trim(),
                        }));
                    } else {
                        setError('Utilisateur non trouvé ou username manquant');
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations utilisateur :', error);
                    setError(error.response?.data?.message || 'Erreur lors de la récupération des informations utilisateur');
                }
            } else {
                setError('Token ou matricule non trouvés');
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        const calculateDuration = () => {
            const { datedeb, datefin } = formData;
            if (datedeb && datefin) {
                const start = new Date(datedeb);
                const end = new Date(datefin);
                const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                setFormData(prevState => ({ ...prevState, duree: duration.toString() }));
            }
        };

        calculateDuration();
    }, [formData.datedeb, formData.datefin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Token non trouvé');
            return;
        }

        try {
            const formattedData = {
                ...formData,
                datedeb: new Date(formData.datedeb).toISOString(),
                datefin: new Date(formData.datefin).toISOString(),
                heurdeb: formData.heurdeb,
                heurfin: formData.heurfin,
            };

            const response = await axios.post(
                'https://cmc.crm-edi.info/paraMobile/api/public/api/v1/grhs', // Update the endpoint as necessary
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response:', response.data);
            setSuccess('Demande d\'autorisation envoyée avec succès !');
            history.push('/dream-pos/demande/listeemployee'); // Redirect to authorization list
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire :', error);
            setError(error.response?.data?.message || 'Erreur lors de l\'envoi du formulaire');
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Demande d'Autorisation</h4>
                        <h6>Create a new demande d'autorisation</h6>
                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Employé:</label>
                                        <input
                                            type="text"
                                            name="codetiers"
                                            value={formData.codetiers}
                                            onChange={handleChange}
                                            required
                                            readOnly // Make read-only
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Date de Début:</label>
                                        <input
                                            type="date"
                                            name="datedeb"
                                            value={formData.datedeb}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Date de Fin:</label>
                                        <input
                                            type="date"
                                            name="datefin"
                                            value={formData.datefin}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Heure de Début:</label>
                                        <input
                                            type="time"
                                            name="heurdeb"
                                            value={formData.heurdeb}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Heure de Fin:</label>
                                        <input
                                            type="time"
                                            name="heurfin"
                                            value={formData.heurfin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Objet:</label>
                                        <input
                                            type="text"
                                            name="obj"
                                            value={formData.obj}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Durée (jours):</label>
                                        <input
                                            type="text"
                                            name="duree"
                                            value={formData.duree}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Moyen de Déplacement:</label>
                                        <input
                                            type="text"
                                            name="moydep"
                                            value={formData.moydep}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Description:</label>
                                        <textarea
                                            name="des"
                                            value={formData.des}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Envoyer</button>
                </form>
            </div>
        </div>
    );
};

export default Authorization;
