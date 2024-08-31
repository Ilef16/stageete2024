import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import './BrandList.css'; // Ensure you include the CSS styles

const BrandList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeData, setSelectedTypeData] = useState(null); // State for type-specific data
  const [selectedType, setSelectedType] = useState(""); // State for the selected type

  useEffect(() => {
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
          setData(result);
        } else {
          setError("API response is not an array");
        }
      } catch (error) {
        setError(`An error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = async (doctype) => {
    if (['CC', 'CP', 'CA'].includes(doctype)) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: 'No list available for this type at the moment.',
      });
      return;
    }

    const token = localStorage.getItem("authToken");
    const ematricule = localStorage.getItem("ematricule"); // Get matricule from localStorage

    if (!ematricule) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ematricule not found in localStorage.',
      });
      return;
    }

    try {
      const response = await fetch(
        `https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/getByType/${doctype}/${ematricule}`,
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
        setSelectedTypeData(result);
        setSelectedType(doctype); // Set the selected type
      } else {
        setError("API response is not an array");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `An error occurred: ${error.message}`,
      });
    }
  };

  const handleDelete = async (uniqueid) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `https://cmc.crm-edi.info/paraMobile/api/public/api/v1/grhs/${uniqueid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The record has been deleted.',
      });

      // Update the selectedTypeData state after deletion
      setSelectedTypeData(selectedTypeData.filter(item => item.uniqueid !== uniqueid));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `An error occurred: ${error.message}`,
      });
    }
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
            {selectedTypeData ? (
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Code</th>
                      {(selectedType === 'DA' || selectedType === 'DS') && (
                        <>
                          <th>Duration</th>
                          <th>Object</th>
                        </>
                      )}
                      <th>Start Date</th>
                      <th>End Date</th>
                      {selectedType === 'DA' && (
                        <>
                          <th>Start Time</th>
                          <th>End Time</th>
                        </>
                      )}
                      <th>RH</th> {/* Added Status column */}
                      <th>Manager</th> {/* Added Status 1 column */}
                      <th>Action</th> {/* Added Action column */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTypeData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.Des}</td>
                        <td>{item.TypeGRH.trim()}</td>
                        <td>{item.CodeTiers.trim()}</td>
                        {(selectedType === 'DA' || selectedType === 'DS') && (
                          <>
                            <td>{item.DUREE ? item.DUREE : "---"}</td>
                            <td>{item.OBJ ? item.OBJ : "---"}</td>
                          </>
                        )}
                        <td>{item.DateDEB ? item.DateDEB : "---"}</td>
                        <td>{item.DateFin ? item.DateFin : "---"}</td>
                        {selectedType === 'DA' && (
                          <>
                            <td>{item.HeurDeb ? item.HeurDeb : "---"}</td>
                            <td>{item.HeurFin ? item.HeurFin : "---"}</td>
                          </>
                        )}
                        <td>{item.EtatBP === "1" ? "Confirmée" : "Non Confirmée"}</td> {/* Display status based on EtatBP */}
                        <td>{item.EtatBP1 === "1" ? "Confirmée" : "Non Confirmée"}</td> {/* Display status based on EtatBP1 */}
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(item.uniqueid)}
                          >
                            Delete
                          </button>
                        </td> {/* Added Delete button */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="cards-container">
                {filteredData.map((item, index) => (
                  <div
                    key={index}
                    className="card-item"
                    onClick={() => handleCardClick(item.type)}
                  >
                    <h2 className="card-title" style={{ color: "#fab18b" }}>{item.title}</h2>
                    <p className="card-type">Type: {item.type}</p>
                    <p className="card-order" style={{ color: "#e5e5e5" }}>Order: {item.order}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandList;
