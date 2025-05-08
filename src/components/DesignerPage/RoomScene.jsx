import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Plane, Box, PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import Furniture from "./Furniture";
import { useTexture } from "@react-three/drei";
import wood_floor from "../../assets/wood_floor.jpg";
import marble_floor from "../../assets/marble_floor.jpg";
import carpet_floor from "../../assets/carpet_floor.jpg";
import tile_floor from "../../assets/tile_floor.jpg";
import granite_floor from "../../assets/granite_floor.jpg";

import smooth_finish_wall from "../../assets/smoothfinish_wall.jpeg";
import knockdown_wall from "../../assets/knowckdown_wall.jpg";
import orange_peel_wall from "../../assets/orangepeel_wall.jpeg";
import popcorn_wall from "../../assets/popcorn_wall.jpeg";
import sand_swirl_wall from "../../assets/sand_wall.jpg";
import sand_stone_wall from "../../assets/sandstone_wall.jpg";

// A better camera updater that preserves state between view changes
const CameraUpdater = ({ is2D, prevViewModeRef }) => {
  const { camera, scene } = useThree();
  
  useEffect(() => {
    // Only update when view mode actually changes
    if (prevViewModeRef.current !== is2D) {
      console.log(`Switching to ${is2D ? '2D' : '3D'} mode`);
      
      if (is2D) {
        camera.position.set(0, 10 * 1.2, 0);
        camera.zoom = 5; // Start with more zoom in 2D
        camera.up.set(0, 0, -1);
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.set(8, 5, 8);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);
      }
      
      camera.updateProjectionMatrix();
      prevViewModeRef.current = is2D;
    }
  }, [is2D, camera]);

  return null;
};

// Control manager component to handle orbit & zoom across view changes
const ControlsManager = ({ 
  orbitControlsRef, 
  is2D, 
  cameraRef, 
  isDraggingFurniture 
}) => {
  useFrame(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.update();
    }
  });

  useEffect(() => {
    const handleZoomIn = () => {
      if (is2D && cameraRef.current) {
        cameraRef.current.zoom *= 1.2;
        cameraRef.current.updateProjectionMatrix();
      } else if (orbitControlsRef.current) {
        orbitControlsRef.current.dollyIn(1.2);
        orbitControlsRef.current.update();
      }
    };

    const handleZoomOut = () => {
      if (is2D && cameraRef.current) {
        cameraRef.current.zoom /= 1.2;
        cameraRef.current.updateProjectionMatrix();
      } else if (orbitControlsRef.current) {
        orbitControlsRef.current.dollyOut(1.2);
        orbitControlsRef.current.update();
      }
    };
    
    const handleResetCamera = () => {
      if (is2D && cameraRef.current) {
        cameraRef.current.position.set(0, 10 * 1.2, 0);
        cameraRef.current.zoom = 5;
        cameraRef.current.up.set(0, 0, -1);
        cameraRef.current.lookAt(0, 0, 0);
        cameraRef.current.updateProjectionMatrix();
      } else if (cameraRef.current && orbitControlsRef.current) {
        cameraRef.current.position.set(8, 5, 8);
        cameraRef.current.lookAt(0, 0, 0);
        cameraRef.current.updateProjectionMatrix();
        orbitControlsRef.current.reset();
      }
    };

    window.addEventListener('zoom-in', handleZoomIn);
    window.addEventListener('zoom-out', handleZoomOut);
    window.addEventListener('reset-camera', handleResetCamera);
    
    return () => {
      window.removeEventListener('zoom-in', handleZoomIn);
      window.removeEventListener('zoom-out', handleZoomOut);
      window.removeEventListener('reset-camera', handleResetCamera);
    };
  }, [is2D]);

  return null;
}

// An enhanced furniture component handler that properly manages rotation
const updateFurnitureRotation = (id, setFurnitureList, newRotation) => {
  setFurnitureList((prev) =>
    prev.map((f) => (f.id === id ? { ...f, rotation: newRotation } : f))
  );
};

const RoomScene = ({
  wallColor,
  wallHeight,
  wallThickness,
  roomWidth = 10,  // Default to 10 if not provided
  roomLength = 10, // Default to 10 if not provided
  roomSize,        // Keep for backward compatibility
  furnitureColor,
  furnitureWidth,
  furnitureHeight,
  furnitureLength,
  isDraggingFurniture,
  setIsDraggingFurniture,
  furnitureList,
  setFurnitureList,
  selectedFurnitureId,
  setSelectedFurnitureId,
  selectedFloor,
  selectedWall,
  viewMode,
  darkMode,
  // Add shadow and lighting properties to RoomScene props
  roomShadowIntensity = 0.8,
  ambientLightIntensity = 0.5,
  roomLightPosition = [5, 10, 5],
}) => {
  // Use roomSize for backward compatibility if provided, otherwise use roomWidth/roomLength
  const effectiveRoomWidth = roomWidth || roomSize || 10;
  const effectiveRoomLength = roomLength || roomSize || 10;
  const maxRoomDimension = Math.max(effectiveRoomWidth, effectiveRoomLength);
  
  const orbitControlsRef = useRef();
  const cameraRef = useRef();
  const prevViewModeRef = useRef(viewMode === "2D");
  const is2D = viewMode === "2D";
  
  // State to force orbit controls to reset when mode changes
  const [controlsKey, setControlsKey] = useState(0);
  
  // Reset controls when view mode changes
  useEffect(() => {
    if (prevViewModeRef.current !== is2D) {
      setControlsKey(prev => prev + 1);
    }
  }, [is2D]);

  // Update CameraUpdater component to use the new dimensions
  const CameraUpdater = ({ is2D, prevViewModeRef }) => {
    const { camera, scene } = useThree();
    
    useEffect(() => {
      // Only update when view mode actually changes
      if (prevViewModeRef.current !== is2D) {
        console.log(`Switching to ${is2D ? '2D' : '3D'} mode`);
        
        if (is2D) {
          camera.position.set(0, maxRoomDimension * 1.2, 0);
          camera.zoom = 5; // Start with more zoom in 2D
          camera.up.set(0, 0, -1);
          camera.lookAt(0, 0, 0);
        } else {
          camera.position.set(
            effectiveRoomWidth * 0.8, 
            maxRoomDimension * 0.5, 
            effectiveRoomLength * 0.8
          );
          camera.up.set(0, 1, 0);
          camera.lookAt(0, 0, 0);
        }
        
        camera.updateProjectionMatrix();
        prevViewModeRef.current = is2D;
      }
    }, [is2D, camera]);
  
    return null;
  };

  const updateFurniturePosition = (id, newPosition) => {
    setFurnitureList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, position: newPosition } : f))
    );
  };
  
  // Function to update furniture rotation when needed
  const handleFurnitureRotation = (id, newRotation) => {
    updateFurnitureRotation(id, setFurnitureList, newRotation);
  };

  // Add a new function to handle furniture deletion
  const handleFurnitureDelete = (id) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this furniture?")) {
      setFurnitureList(prev => prev.filter(f => f.id !== id));
      if (selectedFurnitureId === id) {
        setSelectedFurnitureId(null);
      }
    }
  };

  // Update the Floor component to use rectangular dimensions
  const Floor = ({ is2D, selectedFloor }) => {
    // Load textures with error handling
    const woodTexture = useTexture(wood_floor);
    const marbleTexture = useTexture(marble_floor);
    const graniteTexture = useTexture(granite_floor);
    const carpetTexture = useTexture(carpet_floor);
    const tileTexture = useTexture(tile_floor);

    // Decide which one to use
    let texture;
    try {
      texture =
        selectedFloor === "Wood Floor"
          ? woodTexture
          : selectedFloor === "Marble Floor"
          ? marbleTexture
          : selectedFloor === "Granite Floor"
          ? graniteTexture
          : selectedFloor === "Carpet Floor"
          ? carpetTexture
          : selectedFloor === "Tile Floor"
          ? tileTexture
          : woodTexture; // Default fallback
    } catch (e) {
      console.error("Error loading texture:", e);
      texture = null;
    }

    return (
      <Plane
        args={[effectiveRoomWidth, effectiveRoomLength]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={!is2D}
      >
        <meshStandardMaterial map={texture} color={texture ? undefined : "#e0e0e0"} />
      </Plane>
    );
  };

  // Update the Wall component to use rectangular dimensions
  const Wall = ({
    wallHeight,
    wallThickness,
    wallColor,
    selectedWall,
  }) => {
    // Load wall textures with error handling
    let texture = null;
    
    try {
      const smoothFinishTexture = useTexture(smooth_finish_wall);
      const knockdownTexture = useTexture(knockdown_wall);
      const orangePeelTexture = useTexture(orange_peel_wall);
      const popcornTexture = useTexture(popcorn_wall);
      const sandSwirlTexture = useTexture(sand_swirl_wall);
      const sandStoneTexture = useTexture(sand_stone_wall);

      // Decide which one to use
      texture =
        selectedWall === "Smooth Finish Wall"
          ? smoothFinishTexture
          : selectedWall === "Knockdown Wall"
          ? knockdownTexture
          : selectedWall === "Orange Peel Wall"
          ? orangePeelTexture
          : selectedWall === "Popcorn Wall"
          ? popcornTexture
          : selectedWall === "Sand Swirl Wall"
          ? sandSwirlTexture
          : selectedWall === "Sand Stone Wall"
          ? sandStoneTexture
          : null;
    } catch (e) {
      console.error("Error loading wall texture:", e);
    }

    return (
      <>
        {/* Front wall */}
        <Box
          args={[effectiveRoomWidth, wallHeight, wallThickness]}
          position={[0, wallHeight / 2, -effectiveRoomLength / 2]}
        >
          <meshStandardMaterial map={texture} color={texture ? undefined : wallColor} />
        </Box>
        
        {/* Back wall */}
        <Box
          args={[effectiveRoomWidth, wallHeight, wallThickness]}
          position={[0, wallHeight / 2, effectiveRoomLength / 2]}
        >
          <meshStandardMaterial map={texture} color={texture ? undefined : wallColor} />
        </Box>
        
        {/* Left wall */}
        <Box
          args={[wallThickness, wallHeight, effectiveRoomLength]}
          position={[-effectiveRoomWidth / 2, wallHeight / 2, 0]}
        >
          <meshStandardMaterial map={texture} color={texture ? undefined : wallColor} />
        </Box>
        
        {/* Right wall */}
        <Box
          args={[wallThickness, wallHeight, effectiveRoomLength]}
          position={[effectiveRoomWidth / 2, wallHeight / 2, 0]}
        >
          <meshStandardMaterial map={texture} color={texture ? undefined : wallColor} />
        </Box>
      </>
    );
  };

  return (
    <Canvas
      shadows={!is2D}
      orthographic={is2D}
      camera={{
        position: is2D
          ? [0, maxRoomDimension * 1.2, 0]
          : [effectiveRoomWidth * 0.8, maxRoomDimension * 0.5, effectiveRoomLength * 0.8],
        zoom: is2D ? 5 : 1,
        fov: 50,
        near: 0.1,
        far: 1000,
        up: is2D ? [0, 0, -1] : [0, 1, 0]
      }}
    >
      {/* Update the scene background */}
      <color attach="background" args={[darkMode ? '#151515' : '#f5f5f5']} />
      
      {/* Updated lighting with intensity controls */}
      <ambientLight intensity={darkMode ? ambientLightIntensity * 1.2 : ambientLightIntensity} />
      
      {/* Main directional light with shadow intensity control */}
      <directionalLight 
        position={roomLightPosition} 
        castShadow={!is2D} 
        intensity={darkMode ? roomShadowIntensity * 0.9 : roomShadowIntensity * 0.8}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-maxRoomDimension}
        shadow-camera-right={maxRoomDimension}
        shadow-camera-top={maxRoomDimension}
        shadow-camera-bottom={-maxRoomDimension}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light to soften shadows */}
      <hemisphereLight 
        intensity={darkMode ? 0.4 : 0.3} 
        color={darkMode ? '#6b7280' : '#ffffff'} 
        groundColor={darkMode ? '#27272a' : '#bbbbff'} 
      />

      {/* Unified camera reference */}
      {is2D ? (
        <OrthographicCamera
          ref={cameraRef}
          makeDefault
          position={[0, maxRoomDimension * 1.2, 0]}
          zoom={5}
          near={0.1}
          far={maxRoomDimension * 3}
          up={[0, 0, -1]}
        />
      ) : (
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[
            effectiveRoomWidth * 0.8, 
            maxRoomDimension * 0.5, 
            effectiveRoomLength * 0.8
          ]}
          fov={50}
          near={0.1}
          far={1000}
          up={[0, 1, 0]}
        />
      )}

      <CameraUpdater is2D={is2D} prevViewModeRef={prevViewModeRef} />
      <ControlsManager 
        orbitControlsRef={orbitControlsRef}
        is2D={is2D}
        cameraRef={cameraRef}
        isDraggingFurniture={isDraggingFurniture}
      />

      <Floor is2D={is2D} selectedFloor={selectedFloor} />

      {!is2D && selectedWall !== "Custom Color" && (
        <Wall
          wallColor={wallColor}
          wallHeight={wallHeight}
          wallThickness={wallThickness}
          selectedWall={selectedWall}
        />
      )}
      
      {!is2D && selectedWall === "Custom Color" && (
        <>
          {/* Front wall */}
          <Box
            args={[effectiveRoomWidth, wallHeight, wallThickness]}
            position={[0, wallHeight / 2, -effectiveRoomLength / 2]}
          >
            <meshStandardMaterial color={wallColor} />
          </Box>
          
          {/* Back wall */}
          <Box
            args={[effectiveRoomWidth, wallHeight, wallThickness]}
            position={[0, wallHeight / 2, effectiveRoomLength / 2]}
          >
            <meshStandardMaterial color={wallColor} />
          </Box>
          
          {/* Left wall */}
          <Box
            args={[wallThickness, wallHeight, effectiveRoomLength]}
            position={[-effectiveRoomWidth / 2, wallHeight / 2, 0]}
          >
            <meshStandardMaterial color={wallColor} />
          </Box>
          
          {/* Right wall */}
          <Box
            args={[wallThickness, wallHeight, effectiveRoomLength]}
            position={[effectiveRoomWidth / 2, wallHeight / 2, 0]}
          >
            <meshStandardMaterial color={wallColor} />
          </Box>
        </>
      )}

      {furnitureList.map((item) => (
        <Furniture
          key={item.id}
          id={item.id}
          position={item.position || [0, 0, 0]}
          type={item.type || "chair1"}
          color={item.color || "#ff0000"}
          size={item.size || [1, 1, 1]}
          rotation={item.rotation || [0, 0, 0]}
          onDragging={setIsDraggingFurniture}
          isSelected={selectedFurnitureId === item.id}
          onClick={() => setSelectedFurnitureId(item.id)}
          onPositionChange={(newPos) => updateFurniturePosition(item.id, newPos)}
          onRotationChange={(newRot) => handleFurnitureRotation(item.id, newRot)}
          onDelete={handleFurnitureDelete}
          viewMode={viewMode}
        />
      ))}

      {/* Use key to force recreate controls when mode changes */}
      <OrbitControls
        key={`orbit-controls-${controlsKey}`}
        ref={orbitControlsRef}
        enabled={!isDraggingFurniture}
        enableRotate={!is2D}
        enablePan={true}
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.07}
        rotateSpeed={0.8}
        zoomSpeed={1.0}
        panSpeed={0.8}
        minDistance={1}
        maxDistance={maxRoomDimension * 3}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minAzimuthAngle={is2D ? 0 : -Infinity}
        maxAzimuthAngle={is2D ? 0 : Infinity}
      />
    </Canvas>
  );
};

export default RoomScene;
