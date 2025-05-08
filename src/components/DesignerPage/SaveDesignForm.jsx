import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../utils/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Backend/firebase';

const SaveDesignForm = ({ show, handleClose, onSave, darkMode, existingDesign }) => {
  const [formData, setFormData] = useState({
    name: '',
    designerName: '',
    customerName: '',
    notes: ''
  });
  
  // Add context and state for user info
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user info on component mount or when currentUser changes
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const userDocRef = doc(db, "designers", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo(userData);
          
          // Auto-fill the designer name with user's full name
          setFormData(prev => ({
            ...prev,
            designerName: `${userData.firstName} ${userData.lastName}`
          }));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [currentUser]);

  // When modal is shown or when existing design changes
  useEffect(() => {
    if (show) {
      // If editing an existing design, populate the form
      if (existingDesign) {
        setFormData({
          name: existingDesign.name || '',
          // Keep auto-filled designer name if available, otherwise use from design
          designerName: formData.designerName || existingDesign.designerName || '',
          customerName: existingDesign.customerName || '',
          notes: existingDesign.notes || ''
        });
      } else {
        // For new designs, reset form but keep designer name
        setFormData(prev => ({
          name: '',
          // Keep the designer name from userInfo
          designerName: userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : prev.designerName,
          customerName: '',
          notes: ''
        }));
      }
    }
  }, [show, existingDesign, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      contentClassName={darkMode ? 'bg-dark text-light' : ''}
    >
      <Modal.Header 
        closeButton 
        closeVariant={darkMode ? 'white' : 'dark'}
        className={darkMode ? 'border-secondary' : ''}
      >
        <Modal.Title>{existingDesign ? 'Update Design' : 'Save Design'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Design Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter a name for your design"
              className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Designer</Form.Label>
            <Form.Control
              type="text"
              name="designerName"
              value={formData.designerName}
              onChange={handleChange}
              placeholder="Your name"
              className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              readOnly // Make this field read-only since it's auto-filled
              disabled // Also disable it
            />
            
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Optional: Customer name"
              className={darkMode ? 'bg-dark text-light border-secondary' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional: Add notes about this design"
              style={{ height: '100px' }}
              className={darkMode ? 'bg-dark text-light border-secondary' : ''}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className={darkMode ? 'border-secondary' : ''}>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {existingDesign ? 'Update' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SaveDesignForm;