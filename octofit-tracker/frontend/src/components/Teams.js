import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
      console.log('Teams - Fetching from:', apiUrl);
      
      try {
        const response = await fetch(apiUrl);
        console.log('Teams - Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams - Fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams - Processed teams:', teamsData);
        
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      } catch (error) {
        console.error('Teams - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error loading teams</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h2 className="display-6">👥 Teams</h2>
        <p className="text-muted">Compete together and achieve greatness</p>
      </div>
      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 border-0">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">{team.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text text-muted mb-4">{team.description}</p>
                <div className="row text-center">
                  <div className="col-6">
                    <div className="mb-2">
                      <small className="text-muted d-block">Total Points</small>
                      <span className="fs-3 fw-bold text-primary">{team.total_points}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-2">
                      <small className="text-muted d-block">Members</small>
                      <span className="fs-3 fw-bold text-secondary">{team.members_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light text-muted small">
                <i className="bi bi-calendar me-1"></i>
                Created: {new Date(team.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {teams.length === 0 && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No teams found.
        </div>
      )}
    </div>
  );
}

export default Teams;
