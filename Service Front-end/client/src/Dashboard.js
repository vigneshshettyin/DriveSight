import "./Dashboard.css";

import { AUTH } from "./auth/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const axios = require("axios").default;
const SERVER_URL = "http://127.0.0.1:5001";

function Dashboard() {
  const [statusArr, setStatusArr] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!AUTH()) {
      navigate("/login");
    }
  });
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/status`)
      .then(function (response) {
        setStatusArr(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <header className="container-fluid">
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
              <div className="row" id="status-container">
                {statusArr.map((d) => (
                  <div
                    className={d.error_code === 200 ? "code_200" : "code_500"}
                    id="rowStatus"
                    key={d._id}
                  >
                    <p>{d.data}</p>Status Code -{d.error_code}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="container-fluid shadow" id="feed">
              <img
                src="http://127.0.0.1:5000/live"
                alt=""
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
