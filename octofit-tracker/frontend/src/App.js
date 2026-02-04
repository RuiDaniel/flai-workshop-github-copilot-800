import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import logo from './octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-5">
      <div className="jumbotron p-5 rounded mb-4">
        <h1 className="display-4">Welcome to OctoFit Tracker! 🏋️</h1>
        <p className="lead">
          Track your fitness journey, compete with teams, and achieve your workout goals!
        </p>
        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
        <p className="mb-4">
          Explore activities, check the leaderboard, view teams, manage users, and discover workout plans.
        </p>
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <Link to="/activities" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card h-100 border-0" style={{ cursor: 'pointer' }}>
                <div className="card-body text-center">
                  <div className="display-6 mb-3">📊</div>
                  <h5 className="card-title">Activities</h5>
                  <p className="card-text text-muted">Track and view all fitness activities</p>
                  <span className="btn btn-primary">View Activities</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link to="/leaderboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card h-100 border-0" style={{ cursor: 'pointer' }}>
                <div className="card-body text-center">
                  <div className="display-6 mb-3">🏆</div>
                  <h5 className="card-title">Leaderboard</h5>
                  <p className="card-text text-muted">See who's leading the competition</p>
                  <span className="btn btn-warning text-dark">View Rankings</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link to="/workouts" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card h-100 border-0" style={{ cursor: 'pointer' }}>
                <div className="card-body text-center">
                  <div className="display-6 mb-3">💪</div>
                  <h5 className="card-title">Workouts</h5>
                  <p className="card-text text-muted">Discover personalized workout plans</p>
                  <span className="btn btn-success">View Workouts</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <Link to="/teams" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card h-100 border-0" style={{ cursor: 'pointer' }}>
                <div className="card-body text-center">
                  <div className="display-6 mb-3">👥</div>
                  <h5 className="card-title">Teams</h5>
                  <p className="card-text text-muted">View team rankings and statistics</p>
                  <span className="btn btn-info text-white">View Teams</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6 mb-3">
            <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card h-100 border-0" style={{ cursor: 'pointer' }}>
                <div className="card-body text-center">
                  <div className="display-6 mb-3">👤</div>
                  <h5 className="card-title">Users</h5>
                  <p className="card-text text-muted">Browse all registered users</p>
                  <span className="btn btn-secondary">View Users</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="OctoFit Logo" className="navbar-logo" />
              OctoFit Tracker
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
