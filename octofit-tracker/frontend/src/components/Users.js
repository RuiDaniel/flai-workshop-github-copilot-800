import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

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

  const fetchTeams = async () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const teamsData = data.results || data;
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error('Teams - Error fetching data:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      team: user.team || ''
    });
    setShowModal(true);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/${editingUser.id}/`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          team: editingUser.team || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      
      // Update the users list
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      setSaveSuccess(true);
      setSaveError(null);
      
      // Close modal after 1 second
      setTimeout(() => {
        setShowModal(false);
        setEditingUser(null);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving user:', error);
      setSaveError(error.message);
      setSaveSuccess(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingUser(null);
    setSaveSuccess(false);
    setSaveError(null);
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
              <th scope="col">Actions</th>
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
                <td>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(user)}
                  >
                    ✏️ Edit
                  </button>
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

      {/* Edit Modal */}
      {showModal && editingUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">✏️ Edit User Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                {saveSuccess && (
                  <div className="alert alert-success">
                    User updated successfully! ✓
                  </div>
                )}
                {saveError && (
                  <div className="alert alert-danger">
                    Error: {saveError}
                  </div>
                )}
                <form>
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label fw-bold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userEmail" className="form-label fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="userEmail"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userTeam" className="form-label fw-bold">Team</label>
                    <select
                      className="form-select"
                      id="userTeam"
                      value={editingUser.team}
                      onChange={(e) => setEditingUser({ ...editingUser, team: e.target.value })}
                    >
                      <option value="">No Team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
