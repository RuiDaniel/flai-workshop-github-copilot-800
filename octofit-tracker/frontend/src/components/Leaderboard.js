import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
      console.log('Leaderboard - Fetching from:', apiUrl);
      
      try {
        const response = await fetch(apiUrl);
        console.log('Leaderboard - Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard - Fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard - Processed leaderboard:', leaderboardData);
        
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      } catch (error) {
        console.error('Leaderboard - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
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
          <h4 className="alert-heading">Error loading leaderboard</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h2 className="display-6">🏆 Leaderboard</h2>
        <p className="text-muted">Top performers and rankings</p>
      </div>
      <div className="row">
        {leaderboard.map((entry, index) => (
          <div key={entry.id} className="col-md-6 col-lg-4 mb-4">
            <div className={`card h-100 ${index < 3 ? 'border-warning border-2' : 'border-0'}`}>
              <div className="card-header bg-white border-0 pt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    {index === 0 && <span className="me-2">🥇</span>}
                    {index === 1 && <span className="me-2">🥈</span>}
                    {index === 2 && <span className="me-2">🥉</span>}
                    Rank #{entry.rank}
                  </h5>
                  <span className="badge bg-secondary">
                    {entry.activities_count} activities
                  </span>
                </div>
              </div>
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-primary fw-bold">
                  {entry.user_name || `User ${entry.user}`}
                </h6>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-info text-white fs-6">
                    {entry.team_name || `Team ${entry.team}`}
                  </span>
                  <span className="fs-4 fw-bold text-success">
                    {entry.points} pts
                  </span>
                </div>
              </div>
              <div className="card-footer bg-light text-muted small">
                Last updated: {new Date(entry.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {leaderboard.length === 0 && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No leaderboard entries found.
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
