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
      <h2 className="mb-4">Workout Plans</h2>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">{workout.title}</h5>
                <span className={`badge ${getDifficultyBadgeClass(workout.difficulty)}`}>
                  {workout.difficulty}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text">{workout.description}</p>
                <hr />
                <div className="row text-center">
                  <div className="col-6">
                    <small className="text-muted">Duration</small>
                    <p className="fw-bold">{workout.duration} min</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Type</small>
                    <p className="fw-bold">{workout.exercise_type}</p>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-6">
                    <small className="text-muted">Target Calories</small>
                    <p className="fw-bold">{workout.target_calories}</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Target Points</small>
                    <p className="fw-bold">{workout.target_points}</p>
                  </div>
                </div>
                <hr />
                <div className="mt-3">
                  <h6>Instructions:</h6>
                  <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>
                    {workout.instructions}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {workouts.length === 0 && (
        <div className="alert alert-info">
          No workouts found.
        </div>
      )}
    </div>
  );
}

export default Workouts;
