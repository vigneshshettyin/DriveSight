

import Login from './auth/login.js'
import Register from './auth/register.js'
import Dashboard from './Dashboard';
import { Route, Routes,  Navigate } from "react-router-dom";

function App() {
  return (
    
    <>
    <Routes>
      <Route path="/" element={<Dashboard/>} exact />
      
      <Route path="/login" element={<Login/>} exact />
      <Route path="/register" element={<Register/>} exact />
     
      <Route path="*" element={<Navigate to ="/" />}/> 
    </Routes>
  </>
  );
}

export default App;
