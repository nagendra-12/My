import React, { Fragment, Component, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie';
import Home from './components/Home'
import SchoolRegisterForm from './components/SchoolRegisterForm'
import AdminSchoolReports from './components/AdminSchoolReports';
import AdminCollegeReports from './components/AdminCollegeReports';
import AdminLogin from './components/AdminLogin';
import SchoolLogin from './components/SchoolLogin';
import AdminHome from './components/AdminHome';
import CollegeLogin from './components/CollegeLogin';
import ChangePassword from './components/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteForPublic from './components/ProtectedRouteForPublic';
import CollegeRegistrationForm from './components/CollegeRegistrationForm';
import './App.css';

const App = () => {
    const jwtToken = Cookies.get("jwt_token")
    const isAuth = jwtToken !== undefined
    return (
      <Router>
        <Fragment>
          <Routes>
            <Route element={<ProtectedRouteForPublic auth={isAuth} />}>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/admin_login' element={<AdminLogin />} />
              <Route exact path='/school_login' element={<SchoolLogin />} />
              <Route exact path='/college_login' element={<CollegeLogin />} />
            </Route>
            <Route element={<ProtectedRoute auth={isAuth} />}>
              <Route exact path='/admin' element={<AdminHome />} />
              <Route exact path='/admin/:admin_id/register/school' element={<SchoolRegisterForm />} />
              <Route exact path='/admin/:admin_id/register/college' element={<CollegeRegistrationForm/>} />
              <Route exact path='/admin/:admin_id/reports/school' element={<AdminSchoolReports />} />
              <Route exact path='/admin/:admin_id/reports/college' element={<AdminCollegeReports />} />
              <Route exact path='/admin/:admin_id/change_password' element={<ChangePassword />} />
            </Route>
          </Routes>
        </Fragment>
      </Router>
    )
}

export default App;
