import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable"; // Assurez-vous que le chemin est correct
import Swal from "sweetalert2";

const BrandList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(true);
  const [userRole, setUserRole] = useState(""); // Pour stocker le rôle de l'utilisateur

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("authToken");

    const storedUserRole = localStorage.getItem("userRole");
    setUserRole(storedUserRole);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://cmc.crm-edi.info/paraMobile/api/public/api/v1/grhs`,
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

  const getButtonStyle = (checked) => ({
    backgroundColor: checked ? "#2a91ed" : "#ed822a",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  });

  const handleEtatBpClick = async (uniqueid, currentState) => {
    const token = localStorage.getItem("authToken");

    // Confirm the action with the user
    const confirmResult = await Swal.fire({
      title: 'Voulez-vous accepter cette demande ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(
          `https://cmc.crm-edi.info/paraMobile/api/public/api/v1/grhs/${uniqueid}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ etatbp: !currentState }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Update local state to reflect the new etatbp value
        setData((prevData) =>
          prevData.map((item) =>
            item.uniqueid === uniqueid
              ? { ...item, etatbp: !currentState }
              : item
          )
        );

        Swal.fire(
          'Succès',
          'Le statut a été mis à jour avec succès.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Erreur',
          `Impossible de mettre à jour État BP: ${error.message}`,
          'error'
        );
      }
    }
  };

  const columns = [
    {
      title: "Type GRH",
      dataIndex: "typegrh",
      sorter: (a, b) => a.typegrh.localeCompare(b.typegrh),
    },
    {
      title: "Code Tiers",
      dataIndex: "codetiers",
      sorter: (a, b) => a.codetiers.localeCompare(b.codetiers),
    },
    {
      title: "Description",
      dataIndex: "des",
      sorter: (a, b) => a.des.localeCompare(b.des),
    },
    {
      title: "Date Début",
      dataIndex: "datedeb",
      sorter: (a, b) => new Date(a.datedeb) - new Date(b.datedeb),
    },
    {
      title: "Date Fin",
      dataIndex: "datefin",
      sorter: (a, b) => new Date(a.datefin) - new Date(b.datefin),
    },
    {
      title: "Nombre de Jours",
      dataIndex: "nbrejour",
      sorter: (a, b) => a.nbrejour - b.nbrejour,
    },
    {
      title: "État BP",
      dataIndex: "etatbp",
      render: (text, record) => (
        <button
          style={getButtonStyle(text)}
          onClick={() => handleEtatBpClick(record.uniqueid, text)}
        >
          {text ? "Checked" : "Unchecked"}
        </button>
      ),
      sorter: (a, b) => (a.etatbp === b.etatbp ? 0 : a.etatbp ? -1 : 1),
    },
    {
      title: "État BP1",
      dataIndex: "etatbp1",
      render: (text) => (
        <button style={getButtonStyle(text)}>
          {text ? "Checked" : "Unchecked"}
        </button>
      ),
      sorter: (a, b) => (a.etatbp1 === b.etatbp1 ? 0 : a.etatbp1 ? -1 : 1),
    },
  ];

  const filteredData = data.filter((item) =>
    item.typegrh?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h4>List des employees </h4>
            <h6>Manage List</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Chercher par Type GRH"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="table-responsive">
              <Table columns={columns} dataSource={filteredData.map((item) => ({ ...item, key: item.uniqueid }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandList;
