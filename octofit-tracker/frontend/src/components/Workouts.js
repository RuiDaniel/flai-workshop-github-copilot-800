import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
      console.log('Workouts - Fetching from:', apiUrl);
      
      try {
        const response = await fetch(apiUrl);
        console.log('Workouts - Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts - Fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts - Processed workouts:', workoutsData);
        
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      } catch (error) {
        console.error('Workouts - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success';
      case 'intermediate':
        return 'bg-warning';
      case 'advanced':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

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
          <h4 className="alert-heading">Error loading workouts</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h2 className="display-6">💪 Workout Plans</h2>
        <p className="text-muted">Personalized workout programs for all fitness levels</p>
      </div>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 border-0">
              <div className="card-header bg-white border-bottom-0 pt-3">
                <h5 className="card-title mb-2">{workout.title || 'Untitled Workout'}</h5>
                <div>
                  <span className={`badge ${getDifficultyBadgeClass(workout.difficulty)} me-2`}>
                    {workout.difficulty ? workout.difficulty.toUpperCase() : 'N/A'}
                  </span>
                  <span className="badge bg-secondary text-capitalize">
                    {workout.exercise_type || 'General'}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="card-text text-muted mb-3">{workout.description || 'No description available'}</p>
                <hr />
                <div className="row text-center g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2 bg-light rounded">
                      <small className="text-muted d-block">Duration</small>
                      <span className="fw-bold">{workout.duration || 0} min</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded">
                      <small className="text-muted d-block">Target Cal</small>
                      <span className="fw-bold">{workout.target_calories || 0}</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-2 bg-primary bg-opacity-10 rounded">
                      <small className="text-muted d-block">Target Points</small>
                      <span className="fw-bold text-primary fs-5">{workout.target_points || 0} pts</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="mt-3">
                  <h6 className="fw-bold mb-2">
                    <i className="bi bi-list-check me-2"></i>Instructions:
                  </h6>
                  <pre className="small mb-0" style={{ whiteSpace: 'pre-wrap' }}>
{workout.instructions || 'No instructions provided'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {workouts.length === 0 && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No workouts found.
        </div>
      )}
    </div>
  );
}

export default Workouts;
