import React, { useState, useEffect } from "react";
import {
  AvocatImage,
  Dash1,
  Dash2,
  Dash3,
  Dash4,
  Dropdown,
  OrangeImage,
  PineappleImage,
  EarpodIcon,
  StawberryImage,
  IphoneIcon,
  SamsungIcon,
  MacbookIcon,
} from "../EntryFile/imagePath";
import Table from "../EntryFile/datatables";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import CountUp from "react-countup";
import { Helmet } from "react-helmet";
import RightSideBar from "../components/rightSidebar";

const state = {
  series: [
    {
      name: "Sales",
      data: [50, 45, 60, 70, 50, 45, 60, 70],
    },
    {
      name: "Purchase",
      data: [-21, -54, -45, -35, -21, -54, -45, -35],
    },
  ],
  options: {
    colors: ["#28C76F", "#EA5455"],
    chart: {
      type: "bar",
      height: 300,
      stacked: true,

      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 280,
        options: {
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        borderRadius: 5,
        borderRadiusTop: 5,
      },
    },
    xaxis: {
      categories: [
        " Jan ",
        "feb",
        "march",
        "april",
        "may",
        "june",
        "july",
        "auguest",
      ],
    },
    legend: {
      position: "top",
    },
    fill: {
      opacity: 1,
    },
  },
};

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [compteCount, setCompteCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [empCount, setempCount] = useState(0);
  const [daCount, setDaCount] = useState(0);
  const [dcCount, setDcCount] = useState(0);
  const [abCount, setabCount] = useState(0);
  const [crCount, setcrCount] = useState(0);
  const state = {
    series: [
      {
        name: "Sales",
        data: [50, 45, 60, 70, 50, 45, 60, 70],
      },
      {
        name: "Purchase",
        data: [-21, -54, -45, -35, -21, -54, -45, -35],
      },
    ],
    options: {
      colors: ["#28C76F", "#EA5455"],
      chart: {
        type: "bar",
        height: 300,
        stacked: true,
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 280,
          options: {
            legend: {
              position: "bottom",
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20%",
          borderRadius: 5,
          borderRadiusTop: 5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
        ],
      },
      legend: {
        position: "top",
      },
      fill: {
        opacity: 1,
      },
    },
  };

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: 'Demandes de Congé par Employé',
        align: 'left'
      }
    }
  });
  

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Fetch employee count
      fetch("https://cmc.crm-edi.info/paraMobile/api/public/api/v1/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            setEmployeeCount(data.length);
          }
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
        });

      // Fetch CRM users count and roles
      fetch("https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            setCompteCount(data.length);

            // Filter and count managers and employees
            const managers = data.filter(user => user.roles.includes("Role_MANAGER"));
            setManagerCount(managers.length);
            const empl = data.filter(user => user.roles.includes("employee"));
            setempCount(empl.length);
          }
        })
        .catch((error) => {
          console.error("Error fetching CRM users data:", error);
        });

      // Fetch GRH data
      fetch("https://cmc.crm-edi.info/paraMobile/api/public/api/v1/grhs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("GRH Data:", data); // Log data for verification
          if (data && Array.isArray(data)) {
            // Filter and count types
            const daEntries = data.filter(entry => entry.typegrh && entry.typegrh.trim() === "DA");
            setDaCount(daEntries.length);
            const dcEntries = data.filter(entry => entry.typegrh && entry.typegrh.trim() === "DC");
            setDcCount(dcEntries.length);
            const abEntries = data.filter(entry => entry.typegrh && entry.typegrh.trim() === "AB");
            setabCount(abEntries.length);
            const crEntries = data.filter(entry => entry.typegrh && entry.typegrh.trim() === "CR");
            setcrCount(crEntries.length);

            // Prepare chart data
            const employees = Array.from(new Set(data.map(entry => entry.employeeId))); // Assuming employeeId is available
            const years = Array.from(new Set(data.map(entry => new Date(entry.date).getFullYear())));
            
            const chartSeries = employees.map(employeeId => {
              const leaveCounts = years.map(year => {
                return data.filter(entry => entry.employeeId === employeeId && new Date(entry.date).getFullYear() === year).length;
              });
              return {
                name: `Employee ${employeeId}`,
                data: leaveCounts
              };
            });

            setChartData({
              series: chartSeries,
              options: {
                ...chartData.options,
                xaxis: {
                  categories: years
                }
              }
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching GRH data:", error);
        });
    } else {
      console.error("Token not found");
    }
  }, []);
  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Dreams Pos admin template</title>
          <meta name="description" content="Dashboard page" />
        </Helmet>
        <div className="content">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash1} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    
                    <span className="counters">
                      <CountUp end={daCount} />
                    </span>
                  </h5>
                  <h6>Nbr des demandes d'autorisation</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash1">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash2} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    
                    <span className="counters">
                      <CountUp end={dcCount} />
                    </span>
                  </h5>
                  <h6>Nbr des demandes de congés</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash2">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash3} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    
                    <span className="counters">
                      <CountUp end={abCount} />
                    </span>
                  </h5>
                  <h6>Nbr des demandes d'absence</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    
                    <span className="counters">
                      <CountUp end={crCount} />
                    </span>
                  </h5>
                  <h6>Nbr des demandes de remboursement</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count">
                <div className="dash-counts">
                  <h4>{employeeCount}</h4>
                  <h5>Nbr des Employees</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>{compteCount}</h4>
                  <h5>Nbr des Comptes</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user-check" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>{managerCount}</h4>
                  <h5>Nbr des Managers</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user-check" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>{empCount}</h4>
                  <h5>Nbr des simples Employees</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file" />
                </div>
              </div>
            </div>
          </div>
          {/* Button trigger modal */}
       
         
          
  

        </div>
      </div>
      <RightSideBar />
    </>
  );
};

export default Dashboard;
