import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaTrash, FaSearch, FaFileImport } from 'react-icons/fa';
import { AuthContext } from '../../utils/authContext';

const DesignManager = ({ show, handleClose, onLoad, onDelete, darkMode }) => {
  const [designs, setDesigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dateModified');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get current user from context
  const { currentUser } = useContext(AuthContext);
  
  // Load designs when modal is opened
  useEffect(() => {
    if (show) {
      loadDesigns();
    }
  }, [show, currentUser]);
  
  // Function to load designs from localStorage
  // Update DesignManager.jsx loadDesigns function

const loadDesigns = () => {
  if (!currentUser) {
    setError("You must be logged in to view designs");
    return;
  }
  
  setLoading(true);
  setError(null);
  
  try {
    // Get all designs from localStorage
    const savedDesignsString = localStorage.getItem('savedDesigns') || '[]';
    console.log('All saved designs in localStorage:', savedDesignsString); // Debug
    
    const allDesigns = JSON.parse(savedDesignsString);
    console.log('Parsed designs:', allDesigns); // Debug
    console.log('Current user ID:', currentUser.uid); // Debug
    
    // Filter designs for current user only
    const userDesigns = allDesigns.filter(design => design.userId === currentUser.uid);
    console.log('Filtered user designs:', userDesigns); // Debug
    
    setDesigns(userDesigns);
  } catch (err) {
    console.error('Error loading designs:', err);
    setError('Failed to load designs. Please try again.');
  } finally {
    setLoading(false);
  }
};
  
  // Handle deleting a design
  const handleDeleteDesign = (designId) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      const success = onDelete(designId);
      if (success) {
        // Update the local state without having to refetch
        setDesigns(designs.filter(design => design.id !== designId));
      }
    }
  };
  
  // Filter designs based on search term
  const filteredDesigns = designs.filter(design => {
    const searchLower = searchTerm.toLowerCase();
    return (
      design.name?.toLowerCase().includes(searchLower) || 
      design.designerName?.toLowerCase().includes(searchLower) || 
      design.customerName?.toLowerCase().includes(searchLower)
    );
  });
  
  // Sort designs
  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    if (sortField === 'dateModified') {
      return sortDirection === 'asc' 
        ? new Date(a.dateModified) - new Date(b.dateModified)
        : new Date(b.dateModified) - new Date(a.dateModified);
    }
    
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Toggle sort order
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      contentClassName={darkMode ? 'bg-dark text-light' : ''}
    >
      <Modal.Header 
        closeButton 
        closeVariant={darkMode ? 'white' : 'dark'}
        className={darkMode ? 'border-secondary' : ''}
      >
        <Modal.Title>My Designs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text className={darkMode ? 'bg-dark text-light border-secondary' : ''}>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search designs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={darkMode ? 'bg-dark text-light border-secondary' : ''}
          />
        </InputGroup>
        
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading your designs...</p>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-danger">
            <p>{error}</p>
            <Button variant="primary" onClick={loadDesigns}>
              Retry
            </Button>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center p-5">
            <h5>No saved designs found</h5>
            <p className="text-muted">Create and save a design to see it here</p>
          </div>
        ) : (
          <div className="table-responsive" style={{maxHeight: '50vh'}}>
            <Table
              striped
              hover
              variant={darkMode ? 'dark' : 'light'}
              className="align-middle"
            >
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
                    Design Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('customerName')} style={{cursor: 'pointer'}}>
                    Customer {sortField === 'customerName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('dateModified')} style={{cursor: 'pointer'}}>
                    Last Modified {sortField === 'dateModified' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDesigns.map((design) => (
                  <tr key={design.id}>
                    <td>{design.name}</td>
                    <td>{design.customerName || '—'}</td>
                    <td>{formatDate(design.dateModified)}</td>
                    <td className="text-end">
                      <Button
                        variant={darkMode ? "outline-light" : "outline-primary"}
                        size="sm"
                        className="me-2"
                        onClick={() => onLoad(design)}
                        title="Load Design"
                      >
                        <FaFileImport /> Load
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteDesign(design.id)}
                        title="Delete Design"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className={darkMode ? 'border-secondary' : ''}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DesignManager;