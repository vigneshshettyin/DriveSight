
import './App.css';

import { AUTH } from "./auth/Auth";
import   {useNavigate,
  Link } from "react-router-dom";
import { useEffect } from 'react';


function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    
    if (!AUTH()) {

      navigate("/login");
    }
   
  }, [])
  const logout=(e)=>{
    e.preventDefault();
    localStorage.removeItem("token")
     navigate('/login')


  }

  
  console.log(localStorage.getItem("token"))
  
  return (
    <div className='container-fluid'>
    
      <header className='container-fluid' >
      <nav className="navbar navbar-light bg-light container-fluid" id="nav">
        <div className="container-fluid">
            <a href="#">
                <h3>DriveSight</h3>
            </a>
          <button
            className="btn btn-outline-dark"
            type="submit"
            onClick={logout}
            
          >
            Logout
          </button>
        </div>
      </nav>
      </header>
      <div className="container-fluid py-4" id="container-grid">
        <div className="row">
            <div className="col">
                <div className="container-fluid shadow" id="status">
                    <h3>Status: ✅</h3>
                </div>
            </div>
            <div className="col">
                <div className="container-fluid shadow" id="feed">
                    <img src="http://127.0.0.1:5000/live" alt="" width="100%" height="100%" />
                </div></div>
        </div>
    </div>
      </div>
  );
}

export default Dashboard;
