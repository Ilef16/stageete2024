import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable"; // Assuming you have a Table component

// Icons and images
import {
  PlusIcon,
  EyeIcon,
  EditIcon,
  DeleteIcon,
} from "../../EntryFile/imagePath";

const ProductList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee data from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

      if (!token) {
        Swal.fire({
          title: "Error",
          text: "No access token found. Please log in again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://cmc.crm-edi.info/paraMobile/api/public/api/v1/employees", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized access - check your token");
          } else {
            throw new Error(`Error: ${response.statusText}`);
          }
        }

        const data = await response.json();
        setEmployees(data); // Assuming data is an array of employees
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    {
      title: "Matricule",
      dataIndex: "ematricule",
      key: "ematricule",
    },
    {
      title: "First Name",
      dataIndex: "eprenom",
      key: "eprenom",
    },
    {
      title: "Last Name",
      dataIndex: "enom",
      key: "enom",
    },
    {
      title: "CIN",
      dataIndex: "ecin",
      key: "ecin",
    },
    {
      title: "Date of Birth",
      dataIndex: "edatenaiss",
      key: "edatenaiss",
      render: (text) => new Date(text).toLocaleDateString(),
    },
   
    {
      title: "Action",
      render: (text, record) => (
       

<>
  <Link className="me-3" to={`/dream-pos/product/addcategory-product/${record.ematricule}`}>
    <p>+</p>
  </Link>

  <Link className="me-3" to={`/dream-pos/product/editproduct-product/${record.ematricule}`}>
    <img src={EditIcon} alt="edit" />
  </Link>

  <Link className="confirm-text" to="#" onClick={() => confirmDelete(record.ematricule)}>
    <img src={DeleteIcon} alt="delete" />
  </Link>
</>

      ),
    },
  ];

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
          
          const response = await fetch(`https://cmc.crm-edi.info/paraMobile/api/public/api/v1/employees/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to delete the employee");
          }
  
          // Update the local state to remove the deleted employee
          setEmployees((prevEmployees) => prevEmployees.filter(employee => employee.ematricule !== id));
  
          Swal.fire("Deleted!", "The record has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting employee:", error);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };
  

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Employees</h4>
            <h6>Manage employees</h6>
          </div>
          <div className="page-btn">
            <Link to="/dream-pos/product/addproduct-product" className="btn btn-added">
              <img src={PlusIcon} alt="add" className="me-1" />
              Add New Employee
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={employees}
                loading={loading}
                rowKey="ematricule" // Unique key to help React identify which items have changed
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
