import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";

const Dconge = ({ onRequestSubmitted }) => {
  const [formData, setFormData] = useState({
    typegrh: 'AB', // Specify the type as "demande de congé"
    codetiers: '',
    datedeb: '',
    datefin: '',
    obj: '',
    duree: '', // Duration as string
    des: '',
    etatbp: false, // Set default to false
    etatbp1: false,

  });

  const [isSubmitting, setIsSubmitting] = useState(false);
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
            Swal.fire({
              title: "Error",
              text: "Utilisateur non trouvé ou username manquant",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur :', error);
          Swal.fire({
            title: "Error",
            text: error.response?.data?.message || error.message,
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Token ou matricule non trouvés",
          icon: "error",
          confirmButtonText: "OK"
        });
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
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Calculate duration in days
        setFormData(prevState => ({ ...prevState, duree: duration.toString() })); // Convert duration to string
      }
    };

    calculateDuration();
  }, [formData.datedeb, formData.datefin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Token not found",
        icon: "error",
        confirmButtonText: "OK"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedData = {
        typegrh: formData.typegrh,
        codetiers: formData.codetiers,
        datedeb: new Date(formData.datedeb).toISOString(),
        datefin: new Date(formData.datefin).toISOString(),
        obj: formData.obj,
        duree: formData.duree,
        des: formData.des,
        etatbp: formData.etatbp,
        etatbp1: formData.etatbp1,
      };

      const response = await axios.post(
        'https://cmc.crm-edi.info/paraMobile/api/public/api/v1/grhs',
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Swal.fire("Success", "Demande envoyée avec succès !", "success");
      
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
      history.push("/dream-pos/demande/listeemployee");
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || error.message,
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Demande d'absence</h4>
            <h6>Create a new demande d'absence</h6>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Employé (Code Tiers)</label>
                    <input
                      type="text"
                      name="codetiers"
                      value={formData.codetiers}
                      readOnly
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Date de début</label>
                    <input
                      type="date"
                      name="datedeb"
                      value={formData.datedeb}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Date de fin</label>
                    <input
                      type="date"
                      name="datefin"
                      value={formData.datefin}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Durée (jours)</label>
                    <input
                      type="text"
                      name="duree"
                      value={formData.duree}
                      readOnly
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="des"
                      value={formData.des}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dconge;
