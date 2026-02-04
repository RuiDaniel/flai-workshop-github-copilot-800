import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
      console.log('Activities - Fetching from:', apiUrl);
      
      try {
        const response = await fetch(apiUrl);
        console.log('Activities - Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities - Fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities - Processed activities:', activitiesData);
        
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      } catch (error) {
        console.error('Activities - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchActivities();
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
          <h4 className="alert-heading">Error loading activities</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h2 className="display-6">📊 Activities</h2>
        <p className="text-muted">Track and monitor all fitness activities</p>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">User</th>
              <th scope="col">Activity Type</th>
              <th scope="col">Duration (min)</th>
              <th scope="col">Distance (km)</th>
              <th scope="col">Calories</th>
              <th scope="col">Points</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id}>
                <td className="fw-bold text-muted">{index + 1}</td>
                <td><strong>{activity.user_name || activity.user}</strong></td>
                <td>
                  <span className="badge bg-primary text-capitalize">
                    {activity.activity_type}
                  </span>
                </td>
                <td>{activity.duration}</td>
                <td>{activity.distance ? activity.distance.toFixed(2) : <span className="text-muted">N/A</span>}</td>
                <td><span className="badge bg-warning text-dark">{activity.calories} cal</span></td>
                <td><span className="badge bg-success">{activity.points} pts</span></td>
                <td className="text-muted">
                  {activity.date ? (
                    new Date(activity.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {activities.length === 0 && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No activities found.
        </div>
      )}
    </div>
  );
}

export default Activities;
