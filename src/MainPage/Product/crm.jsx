import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable"; // Ensure the path is correct
import Swal from "sweetalert2";

const Crm = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ematricule, setEmatricule] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedEmatricule = localStorage.getItem("ematricule");
    setEmatricule(storedEmatricule);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/Manager/getByType/${storedEmatricule}`,
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
        console.log("API Response:", result);

        if (Array.isArray(result) && result.length > 0) {
          const formattedData = result.map((item) => ({
            uniqueid: item.uniqueid,
            typegrh: item.TypeGRH.trim(),
            codetiers: item.CodeTiers.trim(),
            des: item.Des,
            datedeb: item.DateDEB,
            datefin: item.DateFin,
            nbrejour: item.NbreJour,
            etatbp: item.EtatBP === "1",
            etatbp1: item.EtatBP1 === "1",
          }));
          setData(formattedData);
        } else {
          setError("No records found for the given Ematricule.");
        }
      } catch (error) {
        setError(`An error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (ematricule) {
      fetchData();
    }
  }, [ematricule]);

  const getButtonStyle = (checked) => ({
    backgroundColor: checked ? "#2a91ed" : "#ed822a",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  });

  const handleEtatBp1Click = async (uniqueid, currentState) => {
    const token = localStorage.getItem("authToken");

    const confirmResult = await Swal.fire({
      title: "Voulez-vous accepter cette demande ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
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
            body: JSON.stringify({ etatbp1: !currentState }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Update the local state to reflect the change
        setData((prevData) =>
          prevData.map((item) =>
            item.uniqueid === uniqueid ? { ...item, etatbp1: !currentState } : item
          )
        );

        Swal.fire("Success", "The status has been updated.", "success");
      } catch (error) {
        Swal.fire("Error", `An error occurred: ${error.message}`, "error");
      }
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.typegrh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.codetiers.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      title: "Confirmation",
      dataIndex: "etatbp1",
      render: (text, record) => (
        <button
          style={getButtonStyle(text)}
          onClick={() => handleEtatBp1Click(record.uniqueid, text)}
        >
          {text ? "Checked" : "Unchecked"}
        </button>
      ),
      sorter: (a, b) => (a.etatbp1 === b.etatbp1 ? 0 : a.etatbp1 ? -1 : 1),
    },
  ];

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
            <h4>GRH List</h4>
            <h6>Manage your requests</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search by Type GRH"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={filteredData.map((item) => ({ ...item, key: item.uniqueid }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crm;
