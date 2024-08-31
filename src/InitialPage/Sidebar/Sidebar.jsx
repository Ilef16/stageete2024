import React, { useEffect, useState } from "react";
import { withRouter, useHistory, useLocation, Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import FeatherIcon from "feather-icons-react";

const Sidebar = () => {
  const [isSideMenu, setSideMenu] = useState("");
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;

  const toggleSidebar = (value) => {
    setSideMenu(value);
  };

  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };

  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  useEffect(() => {
    document.querySelector(".main-wrapper").classList.remove("slide-nav");
    document.querySelector(".sidebar-overlay").classList.remove("opened");
    document.querySelector(".sidebar-overlay").onclick = function () {
      this.classList.remove("opened");
      document.querySelector(".main-wrapper").classList.remove("slide-nav");
    };
  }, [pathname]);

  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-four",
    "/reactjs/template/dream-pos/index-two",
    "/reactjs/template/dream-pos/index-one",
  ];

  if (exclusionArray.includes(pathname)) {
    return null;
  }

  const roles = JSON.parse(localStorage.getItem('userRoles')) || [];

  return (
    <div className="sidebar" id="sidebar">
      <Scrollbars>
        <div className="sidebar-inner slimscroll">
          <div
            id="sidebar-menu"
            className="sidebar-menu"
            onMouseOver={expandMenuOpen}
            onMouseLeave={expandMenu}
          >
            <ul>
            
              {roles.includes('ROLE_ADMIN') && (
                
                <li className="submenu-open">
                    <li className="submenu-open">
                      
                <h6 className="submenu-hdr">Main</h6>
                <ul>
                  <li className={pathname.includes("dashboard") ? "active" : ""}>
                    <Link to="/dream-pos/dashboard">
                      <FeatherIcon icon="grid" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                </ul>
              </li>

                
                  <ul>
                  <li className={pathname.includes("listeDc") ? "active" : ""}>
                      <Link to="/dream-pos/demande/listeDc">
                      <FeatherIcon icon="user-check" />
                        <span>RH Specific liste</span>
                      </Link>
                    </li>
                   {/* <li className={pathname.includes("grh") ? "active" : ""}>
                  <Link to="/dream-pos/demande/grh">
                    <FeatherIcon icon="user-check" />
                    <span>RH Specific liste</span>
                  </Link>
                </li> */}
                </ul>
                  <ul>
                 
                    {/* <li className={pathname.includes("productlist-product") ? "active" : ""}>
                      <Link to="/dream-pos/product/productlist-product">
                        <FeatherIcon icon="box" />
                        <span>Espace CRM</span>
                      </Link>
                    </li> */}
                  
                    
                  </ul>
                  <h6 className="submenu-hdr">Espace RH</h6>
                 <ul>
                   <li className={pathname.includes("productlist-product") ? "active" : ""}>
                     <Link to="/dream-pos/product/productlist-product">
                       <FeatherIcon icon="box" />
                       <span>Liste des employees</span>
                     </Link>
                   </li>
                   <li className={pathname.includes("addproduct-product") ? "active" : ""}>
                     <Link to="/dream-pos/product/addproduct-product">
                       <FeatherIcon icon="plus-square" />
                       <span>Create Employees</span>
                     </Link>
                   </li>
                   <li className={pathname.includes("categorylist-product") ? "active" : ""}>
                  <Link to="/dream-pos/product/categorylist-product">
                    <FeatherIcon icon="codepen" />
                    <span>Gérer comptes</span>
                  </Link>
                </li>
               
                 </ul>
                </li>
              )}
              {/* {(roles.includes('ROLE_ADMIN') || roles.includes('RH')) && (
                <li className={pathname.includes("categorylist-product") ? "active" : ""}>
                  <Link to="/dream-pos/product/categorylist-product">
                    <FeatherIcon icon="codepen" />
                    <span>Gérer users</span>
                  </Link>
                </li>
              )} */}
              {roles.includes('Role_MANAGER') && (
                 <li className="submenu-open">
                    <li className="submenu-open">
                <h6 className="submenu-hdr">Main</h6>
                <ul>
                
                  <br></br>
                  <h6 className="submenu-hdr">Manager</h6>
                  <br></br>
                 
                  <li className={pathname.includes("crm") ? "active" : ""}>
                      <Link to="/dream-pos/product/crm">
                        <FeatherIcon icon="box" />
                        <span>Liste des demandes</span>
                      </Link>
                    </li>
                    <br></br>
                  <h6 className="submenu-hdr">Les demandes</h6>
                  <br></br>
                    <ul>
                    <li className={pathname.includes("demande-conge") ? "active" : ""}>
                      <Link to="/dream-pos/demande/demande-conge">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de Congé</span>
                      </Link>
                    </li>
                  
                    {/* <li className={pathname.includes("mission") ? "active" : ""}>
                      <Link to="/dream-pos/demande/mission">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de mission</span>
                      </Link>
                    </li> */}
                    <li className={pathname.includes("Dautorisation") ? "active" : ""}>
                      <Link to="/dream-pos/demande/Dautorisation">
                        <FeatherIcon icon="file-text" />
                        <span>Demande d'autorisation</span>
                      </Link>
                    </li>
                    <li className={pathname.includes("DAbsence") ? "active" : ""}>
                      <Link to="/dream-pos/demande/DAbsence">
                        <FeatherIcon icon="file-text" />
                        <span>Demande d'Absence</span>
                      </Link>
                    </li>
                    <li className={pathname.includes("Dcomplement") ? "active" : ""}>
                      <Link to="/dream-pos/demande/Dcomplement">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de complement</span>
                      </Link>
                    </li>
                    <li className={pathname.includes("Dremboursement") ? "active" : ""}>
                      <Link to="/dream-pos/demande/Dremboursement">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de romboursement</span>
                      </Link>
                    </li>
                    
                    
                    
                  </ul>
                </ul>
              </li>
                
               </li>
               
              )}
              {roles.includes('employee') && (


                <li className="submenu-open">
                    <li className="submenu-open">
                <h6 className="submenu-hdr">Main</h6>
                <ul>
                
                  <br></br>
                  <li className={pathname.includes("productlist-product") ? "active" : ""}>
                    
                    <FeatherIcon icon="box" />
                    <span>Espace spécifique</span>
                 
                </li>
                <br></br>
                <li className={pathname.includes("listeemployee") ? "active" : ""}>
                  <Link to="/dream-pos/demande/listeemployee">
                    <FeatherIcon icon="plus-square" />
                    <span>Liste spécifique</span>
                  </Link>
                </li>
                </ul>
              </li>
                  <h6 className="submenu-hdr">Employee</h6>
                  <ul>
                    <li className={pathname.includes("demande-conge") ? "active" : ""}>
                      <Link to="/dream-pos/demande/demande-conge">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de Congé</span>
                      </Link>
                    </li>
                  
                    {/* <li className={pathname.includes("mission") ? "active" : ""}>
                      <Link to="/dream-pos/demande/mission">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de mission</span>
                      </Link>
                    </li> */}
                    <li className={pathname.includes("Dautorisation") ? "active" : ""}>
                      <Link to="/dream-pos/demande/Dautorisation">
                        <FeatherIcon icon="file-text" />
                        <span>Demande d'autorisation</span>
                      </Link>
                    </li>
                    <li className={pathname.includes("DAbsence") ? "active" : ""}>
                      <Link to="/dream-pos/demande/DAbsence">
                        <FeatherIcon icon="file-text" />
                        <span>Demande d'Absence</span>
                      </Link>
                    </li>
                    <li className={pathname.includes("Dcomplement") ? "active" : ""}>
                      <Link to="/dream-pos/demande/Dcomplement">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de complement</span>
                      </Link>
                    </li>
                    <li className={pathname.includes("Dremboursement") ? "active" : ""}>
                      <Link to="/dream-pos/demande/Dremboursement">
                        <FeatherIcon icon="file-text" />
                        <span>Demande de romboursement</span>
                      </Link>
                    </li>
                    
                    
                    
                  </ul>
                </li>



              )}

              <li>
                <Link to="/signIn" className={pathname.includes("signIn") ? "active" : ""}>
                  <FeatherIcon icon="log-out" />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
};

export default withRouter(Sidebar);
