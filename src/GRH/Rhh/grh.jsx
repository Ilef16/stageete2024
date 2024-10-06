import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable"; // Ensure the path is correct
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
//hello
const crm = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("authToken");

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

  const confirmText = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your file has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
      }
    });
  };

  const getButtonStyle = (checked) => ({
    backgroundColor: checked ? "#4CAF50" : "#f44336", // Color for 'checked' or 'unchecked'
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter(item =>
    (item.typegrh || "").toLowerCase().includes(searchQuery.toLowerCase())
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
      title: "État BP",
      dataIndex: "etatbp",
      render: (text) => (
        <button style={getButtonStyle(text)}>
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
            <h4> List</h4>
            <h6>Manage your List</h6>
          </div>
          <div className="page-btn">
            {/* <Link to="#" className="btn btn-added">
              <img src={"PlusIcon"} alt="Add" className="me-1" />
              Add Brand
            </Link> */}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search by Type GRH"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control"
              />
            </div>
            <div className="table-responsive">
              <Table columns={columns} dataSource={filteredData.map(item => ({ ...item, key: item.uniqueid }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default crm;
