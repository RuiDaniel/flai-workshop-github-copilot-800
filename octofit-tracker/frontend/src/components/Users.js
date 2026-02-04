import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
      console.log('Users - Fetching from:', apiUrl);
      
      try {
        const response = await fetch(apiUrl);
        console.log('Users - Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users - Fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        console.log('Users - Processed users:', usersData);
        
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      } catch (error) {
        console.error('Users - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
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
          <h4 className="alert-heading">Error loading users</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h2 className="display-6">👤 Users</h2>
        <p className="text-muted">Community members and their achievements</p>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Team</th>
              <th scope="col">Total Points</th>
              <th scope="col">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="fw-bold text-muted">{index + 1}</td>
                <td>
                  <strong className="text-primary">{user.name || 'N/A'}</strong>
                </td>
                <td className="text-dark">
                  <code className="bg-light px-2 py-1 rounded">{user.email ? user.email.split('@')[0] : 'N/A'}</code>
                </td>
                <td className="text-muted">{user.email || 'N/A'}</td>
                <td>
                  <span className="badge bg-info text-white">
                    {user.team ? `Team ${user.team}` : 'No Team'}
                  </span>
                </td>
                <td>
                  <span className="badge bg-success fs-6">
                    {user.total_points || 0} pts
                  </span>
                </td>
                <td className="text-muted">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No users found.
        </div>
      )}
    </div>
  );
}

export default Users;
