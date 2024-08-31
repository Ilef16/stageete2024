import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import './BrandList.css'; // Assurez-vous d'inclure les styles CSS

const BrandList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(true);
  const history = useHistory(); // Initialize useHistory hook

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/getGRHMenu/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          if (isMounted) {
            setData(result);
          }
        } else {
          if (isMounted) {
            setError("API response is not an array");
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(`An error occurred: ${error.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (type) => {
    // Redirect to specific URL based on type
    history.push(`/dream-pos/demande/${type}`);
  };

  const filteredData = data.filter(item => {
    const title = item.title ? item.title.toLowerCase() : '';
    const type = item.type ? item.type.toLowerCase() : '';
    return title.includes(searchQuery.toLowerCase()) || type.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>List</h4>
            <h6>GRH MENU</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search by type or title"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control"
              />
            </div>
            <div className="cards-container">
              {filteredData.map((item, index) => (
                <div
                  key={index}
                  className="card-item"
                  onClick={() => handleCardClick(item.type)}
                >
                  <h2 className="card-title" style={{color:"#fab18b"}}>{item.title}</h2>
                  <p className="card-type">Type: {item.type}</p>
                  <p className="card-order" style={{color:"#e5e5e5"}}>Order: {item.order}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandList;
