import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './components/Login'
import ProtectedPage from './components/Protected'
import SignUp from './components/SignUp'
import Layout from './components/structure/Layout'
import MyProfile from './components/user/MyProfile'
import { ProWriter } from './components/write/ProWriter'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<Layout />}>
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/prowriter" element={<ProWriter />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
