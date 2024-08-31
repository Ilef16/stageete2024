import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import {
  PlusIcon,
  EditIcon,
  DeleteIcon,
  search_whites,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import Swal from "sweetalert2";

const roleOptions = [
  { id: 1, text: "Choose Role", text: "Choose Role" },
  { id: 2, text: "Admin", text: "Admin" },
  { id: 3, text: "User", text: "User" },
];

const CategoryList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch CRM users');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching CRM users:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
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
    });

    if (confirmed.value) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        // Refresh the data after deletion
        setData(data.filter(user => user.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted.',
          confirmButtonClass: 'btn btn-success',
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'There was an error deleting the user.',
          confirmButtonClass: 'btn btn-danger',
        });
      }
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "roles",
      render: (text) => <span>{text || 'N/A'}</span>, // Display the role or 'N/A'
      sorter: (a, b) => a.roles?.localeCompare(b.roles) || 0,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <Link className="me-3" to={`/dream-pos/product/editcategory-product/${record.id}`}>
            <img src={EditIcon} alt="Edit" />
          </Link>
          <Link className="confirm-text" to="#" onClick={() => handleDelete(record.id)}>
            <img src={DeleteIcon} alt="Delete" />
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>CRM User List</h4>
              <h6>View/Search CRM Users</h6>
            </div>
            <div className="page-btn">
              <Link to="/dream-pos/product/addcategory-product" className="btn btn-added">
                <img src={PlusIcon} alt="Add" className="me-1" />
                Add User
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} />
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <Select2
                          className="select"
                          data={roleOptions}
                          options={{
                            placeholder: "Choose Role",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                      <div className="form-group">
                        <a className="btn btn-filters ms-auto">
                          <img src={search_whites} alt="Search" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;