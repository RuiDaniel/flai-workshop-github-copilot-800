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
      <h2 className="mb-4">Teams</h2>
      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">{team.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text">{team.description}</p>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>Total Points</h6>
                    <p className="text-primary fs-4 fw-bold">{team.total_points}</p>
                  </div>
                  <div>
                    <h6>Members</h6>
                    <p className="text-secondary fs-4 fw-bold">
                      {team.members_count || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-footer text-muted">
                Created: {new Date(team.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {teams.length === 0 && (
        <div className="alert alert-info">
          No teams found.
        </div>
      )}
    </div>
  );
}

export default Teams;
