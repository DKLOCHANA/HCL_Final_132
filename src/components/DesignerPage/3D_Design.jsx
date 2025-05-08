import React, { useContext, useState, useEffect } from "react";
import { auth, signOut } from "../../../Backend/firebase.jsx";
import { useNavigate } from "react-router-dom";
import wall_icon from "../../assets/wall_icon.png";
import chair1 from "../../assets/chair.png";
import chair2 from "../../assets/chair_02.png";
import table1 from "../../assets/lounge_booth_table.png";
import table3 from "../../assets/round_modern_side_table_wood.png";
import sofa1 from "../../assets/sofa.png";
import sofa2 from "../../assets/sofa02.png";
import bed1 from "../../assets/bed_02.png";
import bed2 from "../../assets/bed02.png";
import closet1 from "../../assets/closet01.png";
import closet2 from "../../assets/closet02.png";
import { HiOutlineSwitchHorizontal, HiDotsHorizontal, HiHome } from "react-icons/hi";
import { FaCube, FaArrowsAlt, FaTimes, FaPlus, FaMinus, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsGrid1X2, BsEraser, BsSave, BsFillLightbulbFill } from "react-icons/bs";
import RoomScene from "./RoomScene.jsx";
import floor_icon from "../../assets/floor_icon.png";
import Sidebar from "./SideBar.jsx";
import SaveDesignForm from './SaveDesignForm.jsx';
import DesignManager from './DesignManager.jsx';
import { FaSave, FaFolderOpen } from 'react-icons/fa';
import { AuthContext } from "../../utils/authContext.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Backend/firebase.jsx";

const CustomerDashboard = () => {
  // Add user info state
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState("3D");
  const [wallColor, setWallColor] = useState("#e8e8e8");
  const [wallHeight, setWallHeight] = useState(3);
  const [wallThickness, setWallThickness] = useState(0.2);
  const [furnitureColor, setFurnitureColor] = useState("#6d4c41");
  const [furnitureWidth, setFurnitureWidth] = useState(1);
  const [furnitureHeight, setFurnitureHeight] = useState(1);
  const [furnitureLength, setFurnitureLength] = useState(1);
  const [isDraggingFurniture, setIsDraggingFurniture] = useState(false);
  const [roomWidth, setRoomWidth] = useState(10);
  const [roomLength, setRoomLength] = useState(10);
  const [furnitureList, setFurnitureList] = useState([]);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState(null);
  const [selectedWall, setSelectedWall] = useState("Sand Stone Wall");
  const [selectedFloor, setSelectedFloor] = useState("Tile Floor");
  
  // Lighting and shadow control variables
  const [roomShadowIntensity, setRoomShadowIntensity] = useState(0.8);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.5);
  const [roomLightPosition, setRoomLightPosition] = useState([5, 10, 5]);
  const [roomAmbiance, setRoomAmbiance] = useState("neutral");

  // Add these state variables in the CustomerDashboard component
const [showSaveForm, setShowSaveForm] = useState(false);
const [showDesignManager, setShowDesignManager] = useState(false);
const [currentDesignId, setCurrentDesignId] = useState(null);
  
  // For furniture-specific shading
  const [furnitureMetalness, setFurnitureMetalness] = useState(0.2);
  const [furnitureRoughness, setFurnitureRoughness] = useState(0.7);
  const [furnitureShadowIntensity, setFurnitureShadowIntensity] = useState(1);
  
  const [collapsed, setCollapsed] = useState({
    leftPanel: false,
    rightPanel: false,
    roomSettings: false,
    wallSettings: false,
    furnitureSettings: false,
    lightingSettings: false
  });
  
  const [darkMode] = useState(true); // Dark mode is now default and not toggleable

  // Toggle panel collapse state
  const toggleCollapse = (panel) => {
    setCollapsed(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete selected furniture with Delete key
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFurnitureId) {
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
          
          if (window.confirm("Delete selected furniture?")) {
            setFurnitureList(prev => prev.filter(item => item.id !== selectedFurnitureId));
            setSelectedFurnitureId(null);
          }
        }
      }
      
      // Toggle 2D/3D view with Tab key
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA' &&
            document.activeElement.tagName !== 'BUTTON') {
          e.preventDefault();
          toggleView();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFurnitureId]);

  const toggleView = () => {
    // Update furniture positions for the new view
    setFurnitureList(prevList => 
      prevList.map(item => {
        const newItem = {...item};
        
        if (viewMode === "3D") {
          // Going to 2D - lower items to floor level
          if (newItem.position) {
            newItem.position = [
              newItem.position[0] || 0,
              0.05, // Set very low to the ground for 2D view
              newItem.position[2] || 0
            ];
          }
        } else {
          // Going to 3D - raise items to proper height
          if (newItem.position) {
            const height = (newItem.size && newItem.size[1]) 
              ? newItem.size[1] / 2 + 0.1 
              : 0.6;
            newItem.position = [
              newItem.position[0] || 0,
              height,
              newItem.position[2] || 0
            ];
          }
        }
        
        return newItem;
      })
    );
    
    // Update the view mode and reset camera
    setViewMode(prev => (prev === "3D" ? "2D" : "3D"));
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('reset-camera'));
    }, 100);
  };

  const selectedFurniture = furnitureList.find(
    (f) => f.id === selectedFurnitureId
  );
  const handleLogout = async () => {
    try {
      // The correct way to use signOut is to pass auth as an argument, not call it as a method
      await signOut(auth);
      
      // Clear any stored authentication data in localStorage
      localStorage.removeItem("authToken");
      
      // Navigate to login page after logout
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };
  

  const updateSelectedFurniture = (key, value) => {
    setFurnitureList((prevList) =>
      prevList.map((f) =>
        f.id === selectedFurnitureId ? { ...f, [key]: value } : f
      )
    );
  };
  
  // Update function for selected furniture shading
  const updateSelectedFurnitureShading = (key, value) => {
    if (!selectedFurnitureId) return;
    
    setFurnitureList(prevList => 
      prevList.map(item => 
        item.id === selectedFurnitureId 
          ? { ...item, [key]: value } 
          : item
      )
    );
  };

  const addFurniture = (type) => {
    const newFurniture = {
      id: Date.now(),
      type: type,
      position: [0, furnitureHeight / 2 + 0.1, 0],
      size: [furnitureWidth, furnitureHeight, furnitureLength],
      color: furnitureColor,
      rotation: [0, 0, 0],
      metalness: furnitureMetalness,
      roughness: furnitureRoughness,
      shadowIntensity: furnitureShadowIntensity
    };
    setFurnitureList((prev) => [...prev, newFurniture]);
  };

  const clearRoom = () => {
    if (window.confirm("Are you sure you want to clear all furniture from the room?")) {
      setFurnitureList([]);
      setSelectedFurnitureId(null);
    }
  };

  const saveLayout = () => {
    try {
      const layoutData = {
        roomWidth,
        roomLength,
        wallColor,
        wallHeight,
        wallThickness,
        selectedWall,
        selectedFloor,
        furnitureList,
        // Add lighting properties
        roomShadowIntensity,
        ambientLightIntensity,
        roomLightPosition,
        roomAmbiance,
        furnitureMetalness,
        furnitureRoughness,
        furnitureShadowIntensity
      };
      localStorage.setItem('savedRoomLayout', JSON.stringify(layoutData));
      alert('Room layout saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Failed to save room layout.');
    }
  };

  const loadLayout = () => {
    try {
      const savedLayout = localStorage.getItem('savedRoomLayout');
      if (savedLayout) {
        const layoutData = JSON.parse(savedLayout);
        setRoomWidth(layoutData.roomWidth || 10);
        setRoomLength(layoutData.roomLength || 10);
        setWallColor(layoutData.wallColor || "#e8e8e8");
        setWallHeight(layoutData.wallHeight || 3);
        setWallThickness(layoutData.wallThickness || 0.2);
        setSelectedWall(layoutData.selectedWall || "Sand Stone Wall");
        setSelectedFloor(layoutData.selectedFloor || "Tile Floor");
        setFurnitureList(layoutData.furnitureList || []);
        
        // Load lighting properties
        setRoomShadowIntensity(layoutData.roomShadowIntensity || 0.8);
        setAmbientLightIntensity(layoutData.ambientLightIntensity || 0.5);
        setRoomLightPosition(layoutData.roomLightPosition || [5, 10, 5]);
        setRoomAmbiance(layoutData.roomAmbiance || "neutral");
        setFurnitureMetalness(layoutData.furnitureMetalness || 0.2);
        setFurnitureRoughness(layoutData.furnitureRoughness || 0.7);
        setFurnitureShadowIntensity(layoutData.furnitureShadowIntensity || 1);
        
        alert('Room layout loaded successfully!');
      } else {
        alert('No saved layout found');
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      alert('Failed to load room layout.');
    }
  };

  const themeClass = darkMode ? 'theme-dark' : 'theme-light';
  const bgStyle = darkMode ? 
    { backgroundColor: '#1a1a1a', backgroundImage: 'none' } : 
    {
      backgroundImage: `
        linear-gradient(to top, #f5f5f5 20%, #e1f5fe 60%, #b3e5fc 100%),
        linear-gradient(#ddd 1px, transparent 1px),
        linear-gradient(to right, #ddd 1px, transparent 1px)
      `,
      backgroundSize: "100% 100%, 40px 40px, 40px 40px",
      backgroundPosition: "center bottom, center bottom, center bottom",
      backgroundRepeat: "no-repeat, repeat, repeat",
    };

    // Add these functions in the CustomerDashboard component

// Save design with metadata
// Add these changes to CustomerDashboard.jsx

// First, update the handleSaveDesign function to include userId in the design data
const handleSaveDesign = (formData) => {
  try {
    // Get existing designs or initialize empty array
    const existingSavedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    
    // Check if user is logged in
    if (!currentUser) {
      alert('Please log in to save designs');
      return;
    }
    
    // Collect all design properties
    const designData = {
      // Room properties
      roomWidth,
      roomLength,
      wallColor,
      wallHeight,
      wallThickness,
      selectedWall,
      selectedFloor,
      furnitureList,
      // Lighting properties
      roomShadowIntensity,
      ambientLightIntensity,
      roomLightPosition,
      roomAmbiance,
      furnitureMetalness,
      furnitureRoughness,
      furnitureShadowIntensity,
      // Meta data
      ...formData,
      dateModified: new Date().toISOString(),
      // Add user ID to associate design with current user
      userId: currentUser.uid
    };
    
    // If we're editing an existing design
    if (currentDesignId) {
      const designIndex = existingSavedDesigns.findIndex(d => d.id === currentDesignId);
      if (designIndex >= 0) {
        designData.id = currentDesignId;
        existingSavedDesigns[designIndex] = designData;
      } else {
        // If design not found, create new with new ID
        designData.id = Date.now().toString();
        designData.dateCreated = designData.dateModified;
        existingSavedDesigns.push(designData);
      }
    } else {
      // New design
      designData.id = Date.now().toString();
      designData.dateCreated = designData.dateModified;
      existingSavedDesigns.push(designData);
    }
    
    // Save back to localStorage
    localStorage.setItem('savedDesigns', JSON.stringify(existingSavedDesigns));
    setCurrentDesignId(designData.id);
    
    console.log('Design saved:', designData); // Add debugging
    console.log('All designs:', existingSavedDesigns); // Add debugging
    
    alert(`Design "${formData.name}" saved successfully!`);
    
    // Force design manager to reload if it's open
    if (showDesignManager) {
      setShowDesignManager(false);
      setTimeout(() => setShowDesignManager(true), 100);
    }
  } catch (error) {
    console.error('Error saving design:', error);
    alert('Failed to save design. Please try again.');
  }
};
// Load a design
const loadDesign = (design) => {
  try {
    // Set all design properties
    setRoomWidth(design.roomWidth || 10);
    setRoomLength(design.roomLength || 10);
    setWallColor(design.wallColor || "#e8e8e8");
    setWallHeight(design.wallHeight || 3);
    setWallThickness(design.wallThickness || 0.2);
    setSelectedWall(design.selectedWall || "Sand Stone Wall");
    setSelectedFloor(design.selectedFloor || "Tile Floor");
    setFurnitureList(design.furnitureList || []);
    
    // Load lighting properties
    setRoomShadowIntensity(design.roomShadowIntensity || 0.8);
    setAmbientLightIntensity(design.ambientLightIntensity || 0.5);
    setRoomLightPosition(design.roomLightPosition || [5, 10, 5]);
    setRoomAmbiance(design.roomAmbiance || "neutral");
    setFurnitureMetalness(design.furnitureMetalness || 0.2);
    setFurnitureRoughness(design.furnitureRoughness || 0.7);
    setFurnitureShadowIntensity(design.furnitureShadowIntensity || 1);
    
    // Set the current design ID
    setCurrentDesignId(design.id);
    // Close design manager
    setShowDesignManager(false);
    
    alert(`Design "${design.name}" loaded successfully!`);
  } catch (error) {
    console.error('Error loading design:', error);
    alert('Failed to load design. Please try again.');
  }
};
// Add this function in CustomerDashboard component

// Function to start a new design
const startNewDesign = () => {
  if (furnitureList.length > 0 && !window.confirm("Start a new design? Any unsaved changes will be lost.")) {
    return;
  }

  // Reset all state to default values
  setRoomWidth(10);
  setRoomLength(10);
  setWallColor("#e8e8e8");
  setWallHeight(3);
  setWallThickness(0.2);
  setSelectedWall("Sand Stone Wall");
  setSelectedFloor("Tile Floor");
  setFurnitureList([]);
  
  // Reset lighting properties
  setRoomShadowIntensity(0.8);
  setAmbientLightIntensity(0.5);
  setRoomLightPosition([5, 10, 5]);
  setRoomAmbiance("neutral");
  setFurnitureMetalness(0.2);
  setFurnitureRoughness(0.7);
  setFurnitureShadowIntensity(1);
  
  // Clear current design ID
  setCurrentDesignId(null);
  
  // Reset camera
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('reset-camera'));
  }, 100);
};

// Delete a design
const deleteDesign = (designId) => {
  try {
    const existingSavedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    const updatedDesigns = existingSavedDesigns.filter(d => d.id !== designId);
    
    localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
    
    // If the current design was deleted, reset the ID
    if (currentDesignId === designId) {
      setCurrentDesignId(null);
    }
    
    alert('Design deleted successfully!');
  } catch (error) {
    console.error('Error deleting design:', error);
    alert('Failed to delete design. Please try again.');
  }
};

// Get the current design for editing (if exists)
const getCurrentDesign = () => {
  if (!currentDesignId) return null;
  
  try {
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    return savedDesigns.find(d => d.id === currentDesignId) || null;
  } catch (error) {
    console.error('Error getting current design:', error);
    return null;
  }
};

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const userDocRef = doc(db, "designers", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.log("No user document found for this user");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [currentUser]);

  return (
    <div className={`container-fluid p-0 vh-100 ${themeClass}`} style={bgStyle}>
      <div className="row m-0 vh-100">
        {/* Header Bar */}
        <div className="col-12 px-4 py-2" style={{ 
          backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
          borderBottom: darkMode ? '1px solid #444' : '1px solid #e9ecef',
          height: '60px',
          zIndex: 1000
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
  <h4 className="mb-0" style={{ color: darkMode ? '#e0e0e0' : '#333' }}>
    <FaCube className="me-2" /> 
    {loading ? (
      <span className="small spinner-border spinner-border-sm me-2" />
    ) : userInfo ? (
      `${userInfo.firstName}'s Design Studio`
    ) : (
      "Room Planner Pro"
    )}
  </h4>
</div>
            
          
<div className="d-flex">
  <button 
    className={`btn ${viewMode === "3D" ? "btn-primary" : "btn-outline-primary"} d-flex align-items-center me-2`}
    onClick={toggleView}
  >
    {viewMode === "3D" ? <FaCube className="me-2" /> : <BsGrid1X2 className="me-2" />}
    {viewMode === "3D" ? "3D View" : "2D View"}
  </button>
  
  <button 
    className="btn btn-outline-secondary me-2 d-flex align-items-center"
    onClick={startNewDesign}
    title="Create New Design"
  >
    <FaPlus className="me-2" /> New
  </button>
  
  <button 
    className="btn btn-outline-success me-2 d-flex align-items-center"
    onClick={() => setShowSaveForm(true)}
    title={currentDesignId ? "Save/Update Design" : "Save Design"}
  >
    <FaSave className="me-2" /> 
    {currentDesignId ? "Update" : "Save"}
  </button>
  
  <button 
    className="btn btn-outline-info me-2 d-flex align-items-center"
    onClick={() => setShowDesignManager(true)}
    title="Manage Designs"
  >
    <FaFolderOpen className="me-2" /> Designs
  </button>
  
  <button 
    className="btn btn-outline-danger me-2"
    onClick={clearRoom}
    title="Clear Room"
    disabled={furnitureList.length === 0}
  >
    <BsEraser />
  </button>
  <button 
                className="btn btn-outline-danger d-flex align-items-center"
                onClick={handleLogout}
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right me-2" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                Logout
              </button>
</div>
          </div>
        </div>

        {/* Left Panel - Furniture Library */}
        <div 
  className="p-0 d-flex flex-column" 
  style={{ 
    width: collapsed.leftPanel ? '8%' : '20%',  // <- Custom width
    backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
    borderRight: darkMode ? '1px solid #444' : '1px solid #e9ecef',
    height: 'calc(100vh - 60px)',
    transition: 'all 0.3s ease',
    overflowX: 'hidden'
  }}
>
  <div className="d-flex justify-content-between align-items-center mb-3 px-3 pt-3">
    <h5 style={{ color: darkMode ? '#e0e0e0' : '#333', margin: 0, display: collapsed.leftPanel ? 'none' : 'block' }}>
      Furniture Library
    </h5>
  </div>

  {!collapsed.leftPanel && (
    <div className="px-3 overflow-auto" style={{ flex: '1 1 auto' }}>
              <div className="mt-4">
                {[
                  { id: "chair1", label: "Chair", img: chair1 },
                  { id: "chair2", label: "Office Chair", img: chair2 },
                  { id: "table1", label: "Coffee Table", img: table1 },
                  { id: "table2", label: "Dining Table", img: table3 },
                  { id: "sofa1", label: "Sofa", img: sofa1 },
                  
                  { id: "bed1", label: "Single Bed", img: bed1 },
                  
                  
                ].map((item) => (
                  <div
                    key={item.id}
                    className="border rounded mb-2 d-flex align-items-center"
                    style={{
                      borderColor: darkMode ? '#444' : '#dee2e6',
                      backgroundColor: darkMode ? '#383838' : '#ffffff',
                    }}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("furniture-type", item.id)
                    }
                  >
                    {/* Thumbnail on left */}
                    <div 
                      className="p-2 d-flex align-items-center justify-content-center"
                      style={{ width: "70px", height: "70px" }}
                    >
                      <img
                        src={item.img}
                        alt={item.label}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          filter: darkMode ? 'brightness(0.85)' : 'none'
                        }}
                      />
                    </div>
                    
                    {/* Title in middle */}
                    <div className="flex-grow-1 px-2">
                      <span style={{ color: darkMode ? '#e0e0e0' : '#333' }}>{item.label}</span>
                    </div>
                    
                    {/* Add button on right */}
                    <div className="p-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => addFurniture(item.id)}
                        title={`Add ${item.label}`}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Content - Room Scene */}
        <div
          className={`${collapsed.leftPanel && collapsed.rightPanel ? 'col-10' : collapsed.leftPanel || collapsed.rightPanel ? 'col-9' : 'col-7'}`}
          style={{ 
            height: 'calc(100vh - 60px)',
            padding: 0,
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
        >
          <div
            className="w-100 h-100"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const type = e.dataTransfer.getData("furniture-type");
              if (type) {
                addFurniture(type);
              }
            }}
          >
            <RoomScene
              wallColor={wallColor}
              wallHeight={wallHeight}
              roomWidth={roomWidth}
              roomLength={roomLength}
              wallThickness={wallThickness}
              furnitureColor={furnitureColor}
              furnitureWidth={furnitureWidth}
              furnitureHeight={furnitureHeight}
              furnitureLength={furnitureLength}
              isDraggingFurniture={isDraggingFurniture}
              setIsDraggingFurniture={setIsDraggingFurniture}
              furnitureList={furnitureList}
              selectedFurnitureId={selectedFurnitureId}
              setSelectedFurnitureId={setSelectedFurnitureId}
              setFurnitureList={setFurnitureList}
              viewMode={viewMode}
              selectedFloor={selectedFloor}
              selectedWall={selectedWall}
              darkMode={darkMode}
              
              // Add new lighting & shadow props
              roomShadowIntensity={roomShadowIntensity}
              ambientLightIntensity={ambientLightIntensity}
              roomLightPosition={roomLightPosition}
              roomAmbiance={roomAmbiance}
            />
            
            {/* Floating controls */}
            <div className="position-absolute d-flex flex-column gap-2" style={{ bottom: "20px", right: "20px" }}>
              <button 
                className={`btn ${darkMode ? 'btn-dark' : 'btn-light'} shadow-sm`}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('zoom-in'));
                }}
                title="Zoom In"
              >
                <FaPlus />
              </button>
              
              <button 
                className={`btn ${darkMode ? 'btn-dark' : 'btn-light'} shadow-sm`}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('zoom-out'));
                }}
                title="Zoom Out"
              >
                <FaMinus />
              </button>
              
              <button 
                className={`btn ${darkMode ? 'btn-dark' : 'btn-light'} shadow-sm`}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('reset-camera'));
                }}
                title="Reset View"
              >
                <HiHome />
              </button>
              
              <button 
                className={`btn ${darkMode ? 'btn-dark' : 'btn-light'} shadow-sm`}
                onClick={toggleView}
                title={`Switch to ${viewMode === "3D" ? "2D" : "3D"} View`}
              >
                {viewMode === "3D" ? <BsGrid1X2 /> : <FaCube />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div 
  className="p-0 d-flex flex-column" 
  style={{ 
    width: collapsed.leftPanel ? '8%' : '22.5%',
    backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
    borderLeft: darkMode ? '1px solid #444' : '1px solid #e9ecef',
    height: 'calc(100vh - 60px)',
    transition: 'all 0.3s ease',
    position: 'absolute',
    top: '60px',
    right: 0,
    zIndex: 10,
    overflowY: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  }}
>
  <div className="d-flex justify-content-between align-items-center mb-3 px-3 pt-3">
    <h5 style={{ color: darkMode ? '#e0e0e0' : '#333', margin: 0, display: collapsed.rightPanel ? 'none' : 'block' }}>
      Properties
    </h5>
  </div>

  {!collapsed.rightPanel && (
    <div className="px-3 overflow-auto" style={{ flex: '1 1 auto' }}>
              {/* Room Settings */}
              <div 
                className={`panel mb-3 rounded ${darkMode ? 'bg-dark' : 'bg-white'}`} 
                style={{ border: darkMode ? '1px solid #444' : '1px solid #dee2e6' }}
              >
                <div 
                  className="panel-header d-flex justify-content-between align-items-center p-2 cursor-pointer"
                  onClick={() => toggleCollapse('roomSettings')}
                  style={{ 
                    borderBottom: collapsed.roomSettings ? 'none' : (darkMode ? '1px solid #444' : '1px solid #dee2e6'),
                    cursor: 'pointer' 
                  }}
                >
                  <h6 className="mb-0" style={{ color: darkMode ? '#e0e0e0' : '#333' }}>Room Settings</h6>
                  <button className="btn btn-sm btn-link p-0">
                    {collapsed.roomSettings ? <FaAngleDown /> : <FaAngleUp />}
                  </button>
                </div>
                
                {!collapsed.roomSettings && (
                  <div className="panel-body p-3">
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Room Width
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="6"
                          max="20"
                          step="0.5"
                          value={roomWidth}
                          onChange={(e) => setRoomWidth(parseFloat(e.target.value))}
                        />
                        <input
                          type="number"
                          className={`form-control form-control-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                          style={{ width: '70px' }}
                          value={roomWidth}
                          onChange={(e) => setRoomWidth(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Room Length
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="6"
                          max="20"
                          step="0.5"
                          value={roomLength}
                          onChange={(e) => setRoomLength(parseFloat(e.target.value))}
                        />
                        <input
                          type="number"
                          className={`form-control form-control-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                          style={{ width: '70px' }}
                          value={roomLength}
                          onChange={(e) => setRoomLength(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <button
                        className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'} w-100`}
                        onClick={() => {
                          setRoomWidth(roomLength);
                          setRoomLength(roomWidth);
                        }}
                        title="Swap width and length"
                      >
                        <HiOutlineSwitchHorizontal className="me-2" /> Swap Width & Length
                      </button>
                    </div>

                    {/* Wall Styles */}
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Wall Style
                      </label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {[
                          { id: "Smooth Finish Wall", label: "Granaite" },
                          { id: "Knockdown Wall", label: "Concrete" },
                          
                        ].map((wallOption) => (
                          <button
                            key={wallOption.id}
                            className={`btn btn-sm ${selectedWall === wallOption.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setSelectedWall(wallOption.id)}
                            style={{
                              minWidth: '60px',
                              backgroundColor: selectedWall === wallOption.id ? undefined : (darkMode ? '#3d3d3d' : undefined),
                              borderColor: selectedWall === wallOption.id ? undefined : (darkMode ? '#666' : undefined)
                            }}
                          >
                            {wallOption.label}
                          </button>
                        ))}
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          { id: "Popcorn Wall", label: "Wavy" },
                          { id: "Sand Swirl Wall", label: "Sanded" },
                          { id: "Sand Stone Wall", label: "Brick" }
                        ].map((wallOption) => (
                          <button
                            key={wallOption.id}
                            className={`btn btn-sm ${selectedWall === wallOption.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setSelectedWall(wallOption.id)}
                            style={{
                              minWidth: '60px',
                              backgroundColor: selectedWall === wallOption.id ? undefined : (darkMode ? '#3d3d3d' : undefined),
                              borderColor: selectedWall === wallOption.id ? undefined : (darkMode ? '#666' : undefined)
                            }}
                          >
                            {wallOption.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Floor Styles */}
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Floor Style
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          { id: "Wood Floor", label: "Wood" },
                          { id: "Marble Floor", label: "Marble" },
                          { id: "Granite Floor", label: "Granite" },
                          { id: "Carpet Floor", label: "Carpet" },
                          { id: "Tile Floor", label: "Tile" }
                        ].map((floorOption) => (
                          <button
                            key={floorOption.id}
                            className={`btn btn-sm ${selectedFloor === floorOption.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setSelectedFloor(floorOption.id)}
                            style={{
                              minWidth: '60px',
                              backgroundColor: selectedFloor === floorOption.id ? undefined : (darkMode ? '#3d3d3d' : undefined),
                              borderColor: selectedFloor === floorOption.id ? undefined : (darkMode ? '#666' : undefined)
                            }}
                          >
                            {floorOption.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Room Styles/Presets */}
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Room Style
                      </label>
                      <select 
                        className={`form-select form-select-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                        onChange={(e) => {
                          // Apply preset room styles based on selection
                          const selectedStyle = e.target.value;
                          
                          switch (selectedStyle) {
                            case 'modern':
                              setWallColor("#f5f5f5");
                              setSelectedWall("Smooth Finish Wall");
                              setSelectedFloor("Tile Floor");
                              break;
                            case 'rustic':
                              setWallColor("#e0d2c5");
                              setSelectedWall("Knockdown Wall");
                              setSelectedFloor("Wood Floor");
                              break;
                            case 'minimalist':
                              setWallColor("#ffffff");
                              setSelectedWall("Smooth Finish Wall");
                              setSelectedFloor("Marble Floor");
                              break;
                            case 'industrial':
                              setWallColor("#9e9e9e");
                              setSelectedWall("Sand Stone Wall");
                              setSelectedFloor("Granite Floor");
                              break;
                            case 'cozy':
                              setWallColor("#ede7e0");
                              setSelectedWall("Orange Peel Wall");
                              setSelectedFloor("Carpet Floor");
                              break;
                            default:
                              break;
                          }
                        }}
                      >
                        <option value="">Choose a Room Style</option>
                        <option value="modern">Modern</option>
                        <option value="rustic">Rustic</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="industrial">Industrial</option>
                        <option value="cozy">Cozy</option>
                      </select>
                    </div>
                    
                    {/* Room Ambiance/Lighting */}
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Room Ambiance
                      </label>
                      <select 
                        className={`form-select form-select-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                        value={roomAmbiance}
                        onChange={(e) => {
                          // Set room ambiance preset
                          const selectedAmbiance = e.target.value;
                          setRoomAmbiance(selectedAmbiance);
                          
                          // Apply preset lighting settings
                          switch (selectedAmbiance) {
                            case 'warm':
                              setAmbientLightIntensity(0.7);
                              setRoomShadowIntensity(0.6);
                              setRoomLightPosition([5, 8, 5]);
                              break;
                            case 'cool':
                              setAmbientLightIntensity(0.5);
                              setRoomShadowIntensity(0.9);
                              setRoomLightPosition([0, 10, 0]);
                              break;
                            case 'evening':
                              setAmbientLightIntensity(0.3);
                              setRoomShadowIntensity(0.4);
                              setRoomLightPosition([8, 3, 8]);
                              break;
                            case 'morning':
                              setAmbientLightIntensity(0.8);
                              setRoomShadowIntensity(0.7);
                              setRoomLightPosition([10, 5, 0]);
                              break;
                            case 'neutral':
                            default:
                              setAmbientLightIntensity(0.5);
                              setRoomShadowIntensity(0.8);
                              setRoomLightPosition([5, 10, 5]);
                              break;
                          }
                        }}
                      >
                        <option value="neutral">Neutral Lighting</option>
                        <option value="warm">Warm Lighting</option>
                        <option value="cool">Cool Lighting</option>
                        <option value="evening">Evening</option>
                        <option value="morning">Morning</option>
                      </select>
                    </div>
                    
                    {/* Custom Wall Color */}
                    <div className="mb-3">
                      <label className="form-label small d-flex justify-content-between align-items-center">
                        <span style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>Custom Wall Color</span>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox"
                            checked={selectedWall === "Custom Color"}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWall("Custom Color");
                              } else {
                                setSelectedWall("Smooth Finish Wall");
                              }
                            }}
                            style={{
                              backgroundColor: selectedWall === "Custom Color" ? '#0d6efd' : undefined,
                              borderColor: darkMode ? '#666' : undefined
                            }}
                          />
                        </div>
                      </label>
                      
                      {selectedWall === "Custom Color" && (
                        <input
                          type="color"
                          className="form-control form-control-color w-100"
                          value={wallColor}
                          onChange={(e) => setWallColor(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Wall Settings */}
              <div 
                className={`panel mb-3 rounded ${darkMode ? 'bg-dark' : 'bg-white'}`} 
                style={{ border: darkMode ? '1px solid #444' : '1px solid #dee2e6' }}
              >
                <div 
                  className="panel-header d-flex justify-content-between align-items-center p-2"
                  onClick={() => toggleCollapse('wallSettings')}
                  style={{ 
                    borderBottom: collapsed.wallSettings ? 'none' : (darkMode ? '1px solid #444' : '1px solid #dee2e6'),
                    cursor: 'pointer' 
                  }}
                >
                  <h6 className="mb-0" style={{ color: darkMode ? '#e0e0e0' : '#333' }}>Wall Settings</h6>
                  <button className="btn btn-sm btn-link p-0">
                    {collapsed.wallSettings ? <FaAngleDown /> : <FaAngleUp />}
                  </button>
                </div>
                
                {!collapsed.wallSettings && (
                  <div className="panel-body p-3">
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Wall Height
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="2"
                          max="5"
                          step="0.1"
                          value={wallHeight}
                          onChange={(e) => setWallHeight(parseFloat(e.target.value))}
                        />
                        <input
                          type="number"
                          className={`form-control form-control-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                          style={{ width: '70px' }}
                          value={wallHeight}
                          onChange={(e) => setWallHeight(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Wall Thickness
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="0.1"
                          max="1"
                          step="0.05"
                          value={wallThickness}
                          onChange={(e) => setWallThickness(parseFloat(e.target.value))}
                        />
                        <input
                          type="number"
                          className={`form-control form-control-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                          style={{ width: '70px' }}
                          value={wallThickness}
                          onChange={(e) => setWallThickness(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Furniture Settings */}
              <div 
                className={`panel mb-3 rounded ${darkMode ? 'bg-dark' : 'bg-white'}`} 
                style={{ 
                  border: darkMode ? '1px solid #444' : '1px solid #dee2e6',
                  opacity: selectedFurnitureId ? 1 : 0.7
                }}
              >
                <div 
                  className="panel-header d-flex justify-content-between align-items-center p-2"
                  onClick={() => toggleCollapse('furnitureSettings')}
                  style={{ 
                    borderBottom: collapsed.furnitureSettings ? 'none' : (darkMode ? '1px solid #444' : '1px solid #dee2e6'),
                    cursor: 'pointer' 
                  }}
                >
                  <h6 className="mb-0" style={{ color: darkMode ? '#e0e0e0' : '#333' }}>
                    {selectedFurnitureId ? 'Furniture Properties' : 'Default Furniture Settings'}
                  </h6>
                  <button className="btn btn-sm btn-link p-0">
                    {collapsed.furnitureSettings ? <FaAngleDown /> : <FaAngleUp />}
                  </button>
                </div>
                
                {!collapsed.furnitureSettings && (
                  <div className="panel-body p-3">
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Color
                      </label>
                      <input
                        type="color"
                        className="form-control form-control-color w-100"
                        value={selectedFurniture?.color || furnitureColor}
                        onChange={(e) => {
                          if (selectedFurnitureId) {
                            updateSelectedFurniture("color", e.target.value);
                          } else {
                            setFurnitureColor(e.target.value);
                          }
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Width
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={selectedFurniture?.size[0] || furnitureWidth}
                          onChange={(e) => {
                            const newWidth = parseFloat(e.target.value);
                            if (selectedFurnitureId) {
                              const newSize = [...selectedFurniture.size];
                              newSize[0] = newWidth;
                              updateSelectedFurniture("size", newSize);
                            } else {
                              setFurnitureWidth(newWidth);
                            }
                          }}
                        />
                        <input
                          type="number"
                          className={`form-control form-control-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                          style={{ width: '70px' }}
                          value={selectedFurniture?.size[0] || furnitureWidth}
                          onChange={(e) => {
                            const newWidth = parseFloat(e.target.value);
                            if (selectedFurnitureId) {
                              const newSize = [...selectedFurniture.size];
                              newSize[0] = newWidth;
                              updateSelectedFurniture("size", newSize);
                            } else {
                              setFurnitureWidth(newWidth);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Height
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={selectedFurniture?.size[1] || furnitureHeight}
                          onChange={(e) => {
                            const newHeight = parseFloat(e.target.value);
                            if (selectedFurnitureId) {
                              const newSize = [...selectedFurniture.size];
                              newSize[1] = newHeight;
                              updateSelectedFurniture("size", newSize);
                            } else {
                              setFurnitureHeight(newHeight);
                            }
                          }}
                        />
                        <input
                          type="number"
                          className={`form-control form-control-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                          style={{ width: '70px' }}
                          value={selectedFurniture?.size[1] || furnitureHeight}
                          onChange={(e) => {
                            const newHeight = parseFloat(e.target.value);
                            if (selectedFurnitureId) {
                              const newSize = [...selectedFurniture.size];
                              newSize[1] = newHeight;
                              updateSelectedFurniture("size", newSize);
                            } else {
                              setFurnitureHeight(newHeight);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Length
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={selectedFurniture?.size[2] || furnitureLength}
                          onChange={(e) => {
                            const newLength = parseFloat(e.target.value);
                            if (selectedFurnitureId) {
                              const newSize = [...selectedFurniture.size];
                              newSize[2] = newLength;
                              updateSelectedFurniture("size", newSize);
                            } else {
                              setFurnitureLength(newLength);
                            }
                          }}
                        />
                        <input
                          type="number"
                          className={`form-control form-control-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                          style={{ width: '70px' }}
                          value={selectedFurniture?.size[2] || furnitureLength}
                          onChange={(e) => {
                            const newLength = parseFloat(e.target.value);
                            if (selectedFurnitureId) {
                              const newSize = [...selectedFurniture.size];
                              newSize[2] = newLength;
                              updateSelectedFurniture("size", newSize);
                            } else {
                              setFurnitureLength(newLength);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Material Properties - Add these to enable shading for selected furniture */}
                    {selectedFurnitureId && (
                      <>
                        <hr className={darkMode ? 'border-secondary' : ''} />
                        
                        <div className="mb-3">
                          <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                            Material Shine (Metalness)
                          </label>
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="range"
                              className="form-range flex-grow-1"
                              min="0"
                              max="1"
                              step="0.05"
                              value={selectedFurniture?.metalness || furnitureMetalness}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (selectedFurnitureId) {
                                  updateSelectedFurnitureShading("metalness", value);
                                } else {
                                  setFurnitureMetalness(value);
                                }
                              }}
                            />
                            <span className="small" style={{ width: '40px', textAlign: 'right' }}>
                              {(selectedFurniture?.metalness || furnitureMetalness).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                            Material Texture (Roughness)
                          </label>
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="range"
                              className="form-range flex-grow-1"
                              min="0"
                              max="1"
                              step="0.05"
                              value={selectedFurniture?.roughness || furnitureRoughness}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (selectedFurnitureId) {
                                  updateSelectedFurnitureShading("roughness", value);
                                } else {
                                  setFurnitureRoughness(value);
                                }
                              }}
                            />
                            <span className="small" style={{ width: '40px', textAlign: 'right' }}>
                              {(selectedFurniture?.roughness || furnitureRoughness).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Rotation Controls */}
                    {selectedFurniture && (
                      <div className="mb-3">
                        <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                          Rotation
                        </label>
                        <div className="d-flex gap-2">
                          <button
                            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} flex-grow-1`}
                            onClick={() => {
                              if (selectedFurnitureId) {
                                const furniture = furnitureList.find(f => f.id === selectedFurnitureId);
                                if (!furniture) return;
                                
                                const currentRotation = furniture.rotation || [0, 0, 0];
                                const newRotation = [...currentRotation];
                                newRotation[1] = (newRotation[1] || 0) - Math.PI/2;
                                
                                setFurnitureList(prev => 
                                  prev.map(f => f.id === selectedFurnitureId ? 
                                    {...f, rotation: newRotation} : f
                                  )
                                );
                              }
                            }}
                          >
                            ↺ Rotate Left
                          </button>
                          <button
                            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} flex-grow-1`}
                            onClick={() => {
                              if (selectedFurnitureId) {
                                const furniture = furnitureList.find(f => f.id === selectedFurnitureId);
                                if (!furniture) return;
                                
                                const currentRotation = furniture.rotation || [0, 0, 0];
                                const newRotation = [...currentRotation];
                                newRotation[1] = (newRotation[1] || 0) + Math.PI/2;
                                
                                setFurnitureList(prev => 
                                  prev.map(f => f.id === selectedFurnitureId ? 
                                    {...f, rotation: newRotation} : f
                                  )
                                );
                              }
                            }}
                          >
                            ↻ Rotate Right
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Delete Button */}
                    {selectedFurniture && (
                      <div className="mb-3 mt-4">
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this furniture?")) {
                                setFurnitureList(prevList => 
                                  prevList.filter(item => item.id !== selectedFurnitureId)
                                );
                                setSelectedFurnitureId(null);
                              }
                            }}
                          >
                            <FaTimes className="me-2" /> Delete Furniture
                          </button>
                          
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => setSelectedFurnitureId(null)}
                          >
                            Deselect
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Room Lighting Controls */}
              <div 
                className={`panel mb-3 rounded ${darkMode ? 'bg-dark' : 'bg-white'}`} 
                style={{ border: darkMode ? '1px solid #444' : '1px solid #dee2e6' }}
              >
                <div 
                  className="panel-header d-flex justify-content-between align-items-center p-2 cursor-pointer"
                  onClick={() => toggleCollapse('lightingSettings')}
                  style={{ 
                    borderBottom: collapsed.lightingSettings ? 'none' : (darkMode ? '1px solid #444' : '1px solid #dee2e6'),
                    cursor: 'pointer' 
                  }}
                >
                  <h6 className="mb-0" style={{ color: darkMode ? '#e0e0e0' : '#333' }}>
                    <BsFillLightbulbFill className="me-2" /> Lighting & Shadows
                  </h6>
                  <button className="btn btn-sm btn-link p-0">
                    {collapsed.lightingSettings ? <FaAngleDown /> : <FaAngleUp />}
                  </button>
                </div>
                
                {!collapsed.lightingSettings && (
                  <div className="panel-body p-3">
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Room Shadow Intensity
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="0"
                          max="1"
                          step="0.1"
                          value={roomShadowIntensity}
                          onChange={(e) => setRoomShadowIntensity(parseFloat(e.target.value))}
                        />
                        <span className="small" style={{ width: '40px', textAlign: 'right' }}>
                          {roomShadowIntensity.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Ambient Light
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={ambientLightIntensity}
                          onChange={(e) => setAmbientLightIntensity(parseFloat(e.target.value))}
                        />
                        <span className="small" style={{ width: '40px', textAlign: 'right' }}>
                          {ambientLightIntensity.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Light position preset buttons */}
                    <div className="mb-3">
                      <label className="form-label small" style={{ color: darkMode ? '#bdbdbd' : '#6c757d' }}>
                        Light Position
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          { label: "Top", position: [0, 10, 0] },
                          { label: "Front", position: [0, 5, 10] },
                          { label: "Side", position: [10, 5, 0] },
                          { label: "Corner", position: [5, 10, 5] }
                        ].map((option) => (
                          <button
                            key={option.label}
                            className={`btn btn-sm ${
                              JSON.stringify(roomLightPosition) === JSON.stringify(option.position) 
                                ? 'btn-primary' 
                                : 'btn-outline-secondary'
                            }`}
                            onClick={() => setRoomLightPosition(option.position)}
                            style={{
                              minWidth: '60px',
                              backgroundColor: JSON.stringify(roomLightPosition) === JSON.stringify(option.position) 
                                ? undefined 
                                : (darkMode ? '#3d3d3d' : undefined),
                              borderColor: JSON.stringify(roomLightPosition) === JSON.stringify(option.position) 
                                ? undefined 
                                : (darkMode ? '#666' : undefined)
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Save Design Form Modal */}
<SaveDesignForm
  show={showSaveForm}
  handleClose={() => setShowSaveForm(false)}
  onSave={handleSaveDesign}
  darkMode={darkMode}
  existingDesign={getCurrentDesign()}
/>

{/* Design Manager Modal */}
<DesignManager
  show={showDesignManager}
  handleClose={() => setShowDesignManager(false)}
  onLoad={loadDesign}
  onDelete={deleteDesign}
  darkMode={darkMode}
/>

      {/* Add CSS for the theme */}
      <style jsx>{`
        .theme-dark {
          color: #e0e0e0;
        }
        
        .theme-dark .form-control {
          background-color: #3d3d3d;
          border-color: #555;
          color: #e0e0e0;
        }
        
        .theme-dark .btn-outline-secondary {
          color: #bdbdbd;
          border-color: #666;
        }
        
        .theme-dark .btn-outline-secondary:hover {
          background-color: #555;
          color: white;
        }
        
        .form-range::-webkit-slider-thumb {
          background: ${darkMode ? '#0d6efd' : '#0d6efd'};
        }
        
        .form-range::-moz-range-thumb {
          background: ${darkMode ? '#0d6efd' : '#0d6efd'};
        }
      `}</style>
      
    </div>
  );
};

export default CustomerDashboard;