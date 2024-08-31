import Dashboard from "../MainPage/Dashboard";
import Activities from "../MainPage/Activities";
import Product from "../MainPage/Product/index";

import Dconge from "../employee/demande/index";
import DashboardRH from "../GRH/Dashboard-rh";
import DashboardEmployee from "../employee/DashboardEmployee";


import Sales from "../MainPage/sales";
import Profile from "../MainPage/Profile/index";
import Purchase from "../MainPage/Purchase/index";
import Expense from "../MainPage/Expense/index";
import Quotation from "../MainPage/Quotation/index";
import Transfer from "../MainPage/Transfer/index";
import Return from "../MainPage/Return/index";
import People from "../MainPage/People/index";
import Places from "../MainPage/Places/index";
import Components from "../MainPage/Components/index";
import Elements from "../MainPage/elements";
import Charts from "../MainPage/charts";
import Icons from "../MainPage/icons";
import Forms from "../MainPage/forms";
import Tables from "../MainPage/tables";
import Application from "../MainPage/application";
import Report from "../MainPage/report";
import Users from "../MainPage/users";
import Settings from "../MainPage/settings";
import BlankPage from "../MainPage/BlankPage";
import HomeThree from "../MainPage/Home/home3";
import HomeFour from "../MainPage/Home/home4";
import HomeTwo from "../MainPage/Home/home2";
import HomeTwoRH from "../GRH/HomeRH/home2RH";
import HomeOne from "../MainPage/Home/home1";
import HomeOneRH from "../GRH/HomeRH/home1RH";
import HomeOneEMP from "../employee/HomeEmp/home1EMP";
import HomeTwoEMP from "../employee/HomeEmp/home2EMP";
import grh from "../GRH/Rhh/index";



export default [
  {
    path: "dashboard",
    component: Dashboard,
  },
  {
    path: "dashboard-rh",
    component: DashboardRH,
  },
  {
    path: "dashboard-employee",
    component: DashboardEmployee,
  },
  {
    path: "activities",
    component: Activities,
  },
  {
    path: "product",
    component: Product,
  },
  {
    path: "demande",
    component: Dconge,
  },

  {
    path: "grh",
    component: grh,
  },
  
  {
    path: "profile",
    component: Profile,
  },
  {
    path: "purchase",
    component: Purchase,
  },
  {
    path: "expense",
    component: Expense,
  },
  {
    path: "quotation",
    component: Quotation,
  },
  {
    path: "transfer",
    component: Transfer,
  },
  {
    path: "return",
    component: Return,
  },
  {
    path: "people",
    component: People,
  },
  {
    path: "places",
    component: Places,
  },
  {
    path: "components",
    component: Components,
  },
  {
    path: "blankpage",
    component: BlankPage,
  },
  {
    path: "elements",
    component: Elements,
  },
  {
    path: "charts",
    component: Charts,
  },
  {
    path: "icons",
    component: Icons,
  },
  {
    path: "forms",
    component: Forms,
  },
  {
    path: "table",
    component: Tables,
  },
  {
    path: "application",
    component: Application,
  },
  {
    path: "report",
    component: Report,
  },
  {
    path: "users",
    component: Users,
  },
  {
    path: "settings",
    component: Settings,
  },
  {
    path: "sales",
    component: Sales,
  },
  {
    path: "home-three",
    component: HomeThree,
  },
  {
    path: "home-four",
    component: HomeFour,
  },
  {
    path: "home-two",
    component: HomeTwo,
  },
  {
    path: "home-two-rh",
    component: HomeTwoRH,
  },
  {
    path: "home-one",
    component: HomeOne,
  },
  {
    path: "home-one-rh",
    component: HomeOneRH,
  },
  {
    path: "home-one-emp",
    component: HomeOneEMP,
  },
  {
    path: "home-two-emp",
    component: HomeTwoEMP,
  },
];
