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
      <h2 className="mb-4">Leaderboard</h2>
      <div className="row">
        {leaderboard.map((entry, index) => (
          <div key={entry.id} className="col-md-6 mb-3">
            <div className={`card ${index < 3 ? 'border-warning' : ''}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      Rank #{entry.rank}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {entry.user_name || `User ${entry.user}`}
                    </h6>
                    <p className="card-text">
                      <span className="badge bg-info me-2">
                        {entry.team_name || `Team ${entry.team}`}
                      </span>
                      <strong>{entry.points}</strong> points
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="badge bg-secondary">
                      {entry.activities_count} activities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {leaderboard.length === 0 && (
        <div className="alert alert-info">
          No leaderboard entries found.
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
