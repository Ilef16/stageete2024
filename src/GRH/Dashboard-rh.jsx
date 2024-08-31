import React, { useState } from "react";
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
import Table from "../EntryFile/datatables"
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

const Dashboardd = () => {
  const [expiredData] = useState([
    {
      id: 1,
      code: "IT001",
      image: OrangeImage,
      productName: "Orange",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "12-12-2022",
    },
    {
      id: 2,
      code: "IT002",
      image: PineappleImage,
      productName: "Pineapple",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "10-12-2022",
    },
    {
      id: 3,
      code: "IT003",
      image: StawberryImage,
      productName: "Stawberry",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "27-06-2022",
    },
    {
      id: 4,
      code: "IT004",
      image: AvocatImage,
      productName: "Avocat",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "20-05-2022",
    },
  ]);

  const [recentData] = useState([
    { id: 1, image: EarpodIcon, products: "Apple Earpods", price: "$891.2" },
    { id: 2, image: IphoneIcon, products: "iPhone 11", price: "$91.2" },
    { id: 3, image: SamsungIcon, products: "Samsung", price: "$561.2" },
    { id: 4, image: MacbookIcon, products: "Macbook Pro", price: "$1009.2" },
  ]);

  const expiredProductColumns = [
    {
      title: "SNo",      
      dataIndex:"id",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Product Code",
      dataIndex: "code",
      render: (text, record) => (
        <Link to="#" style={{ fontSize: "14px" }}>
          {text}
        </Link>
      ),
      sorter: (a, b) => a.code.length - b.code.length,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "14px" }}>
            {record.productName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
    },
    {
      title: "Brand Name",
      dataIndex: "brandName",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.brandName.length - b.brandName.length,
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.expiryDate.length - b.expiryDate.length,
    },
  ];

  const recentDataColumns = [
    {
      title: "SNo",
      dataIndex:"id",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Products",
      dataIndex: "products",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "14px" }}>
            {record.products}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.products.length - b.products.length,
      width: "250px",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.price.length - b.price.length,
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Dreams Pos RH template</title>
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
                    $
                    <span className="counters">
                      <CountUp end={307144} />
                    </span>
                  </h5>
                  <h6>Total Purchase Due</h6>
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
                    $
                    <span className="counters">
                      <CountUp end={4385} />
                    </span>
                  </h5>
                  <h6>Total Sales Due</h6>
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
                    $
                    <span className="counters">
                      <CountUp end={385656.5} />
                    </span>
                  </h5>
                  <h6>Total Sale Amount</h6>
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
                    $
                    <span className="counters">
                      <CountUp end={40000} />
                    </span>
                  </h5>
                  <h6>Total Sale Amount</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count">
                <div className="dash-counts">
                  <h4>100</h4>
                  <h5>Customers</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>100</h4>
                  <h5>Suppliers</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user-check" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>100</h4>
                  <h5>Purchase Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file-text" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>105</h4>
                  <h5>Sales Invoice</h5>
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

export default Dashboardd;
