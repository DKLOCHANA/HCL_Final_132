import React, { useState, useEffect, useRef } from "react";
import { Box } from "@react-three/drei";
import MoveHandle from "./MoveHandle";
import Model from "./Model.jsx";
import * as THREE from "three"; 

const Furniture = ({
  id,
  position,
  rotation = [0, 0, 0],
  color = "orange",
  size,
  onDragging,
  isSelected,
  onClick,
  onPositionChange,
  onRotationChange,
  viewMode,
  type,
  // Add these new props
  shadowIntensity = 1, 
  metalness = 0.2, 
  roughness = 0.7,
  onShadingChange
}) => {
  const modelRef = useRef();
  const groupRef = useRef(); // Add ref for the main group
  const [modelSize, setModelSize] = useState([1, 1, 1]);
  const [pos, setPos] = useState([0, 0, 0]);
  const [dragging, setDragging] = useState(false);
  const is2D = viewMode === "2D";
  const roomHalf = 5;
  const [modelScale, setModelScale] = useState(1);

  const adjustedSize = is2D ? [modelSize[0], 0.01, modelSize[2]] : modelSize;

  // Update position based on props
  useEffect(() => {
    const yPos = is2D ? 0.05 : 0;
    setPos([position[0], yPos, position[2]]);
  }, [position, modelSize, is2D]);

  // Update the useEffect that handles rotation to ensure it works in both views:
  useEffect(() => {
    if (groupRef.current && rotation) {
      // For 2D view, only allow rotation around Y axis
      if (is2D) {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = rotation[1] || 0;
        groupRef.current.rotation.z = 0;
      } else {
        // For 3D view, allow full rotation
        groupRef.current.rotation.set(
          rotation[0] || 0,
          rotation[1] || 0,
          rotation[2] || 0
        );
      }
    }
  }, [rotation, is2D]);

  useEffect(() => {
    console.log(type, "type");
  }, []);

  const onPointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
    onDragging(true);
    onClick?.();
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    setDragging(false);
    onDragging(false);
    onPositionChange?.(pos);
  };

  const onPointerMove = (e) => {
    if (dragging) {
      const [sx, sy, sz] = modelSize;
      const newX = Math.max(
        -roomHalf + sx / 2,
        Math.min(roomHalf - sx / 2, e.point.x)
      );
      const newZ = Math.max(
        -roomHalf + sz / 2,
        Math.min(roomHalf - sz / 2, e.point.z)
      );
      const newPos = [newX, is2D ? 0 : sy / 2, newZ];
      setPos(newPos);
      onPositionChange?.(newPos);
    }
  };

  const handleMove = (axis, delta) => {
    setPos((prev) => {
      const newPos = [...prev];
      const index = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      const half = modelSize[index] / 2;

      if (axis === "x" || axis === "z") {
        const max = roomHalf - half;
        const min = -roomHalf + half;
        newPos[index] = Math.max(min, Math.min(max, newPos[index] + delta));
      } else if (axis === "y" && !is2D) {
        newPos[1] = Math.max(modelSize[1] / 2, newPos[1] + delta);
      }

      onPositionChange?.(newPos);
      return newPos;
    });
  };

  // Add a new function to handle rotation
  const handleRotate = (clockwise = true) => {
    if (groupRef.current) {
      // Get current rotation
      const currentY = groupRef.current.rotation.y;
      
      // Calculate new rotation (90 degrees in radians = Math.PI/2)
      const newY = clockwise 
        ? currentY + Math.PI/2 
        : currentY - Math.PI/2;
      
      // Update the component's rotation
      groupRef.current.rotation.y = newY;
      
      // Notify parent component about rotation change
      if (onRotationChange) {
        onRotationChange([groupRef.current.rotation.x, newY, groupRef.current.rotation.z]);
      }
    }
  };

  // Add keyboard event listener for rotation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected) {
        if (e.key === 'r') {
          // 'r' key for clockwise rotation
          handleRotate(true);
          e.preventDefault();
        } else if (e.key === 'R' || (e.shiftKey && e.key === 'r')) {
          // 'R' or Shift+r for counter-clockwise rotation
          handleRotate(false);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected]);

  // Pass shading properties to the Model component
  return (
    <group
      ref={groupRef}
      position={pos}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <Model
        ref={modelRef}
        color={color}
        size={size}
        type={type}
        shadowIntensity={shadowIntensity}
        metalness={metalness}
        roughness={roughness}
        castShadow={!is2D}
        receiveShadow={!is2D}
      />

      {isSelected && (
        <Box args={adjustedSize}>
          <meshBasicMaterial color="yellow" wireframe />
        </Box>
      )}

      {isSelected && !is2D && (
        <>
          <MoveHandle
            axis="x"
            position={[modelSize[0] / 2 + 0.3, 0, 0]}
            onMove={handleMove}
            onDraggingChange={onDragging}
          />
          <MoveHandle
            axis="y"
            position={[0, modelSize[1] / 2 + 0.3, 0]}
            onMove={handleMove}
            onDraggingChange={onDragging}
          />
          <MoveHandle
            axis="z"
            position={[0, 0, modelSize[2] / 2 + 0.3]}
            onMove={handleMove}
            onDraggingChange={onDragging}
          />
          {/* Add rotation handles */}
          <mesh
            position={[0, modelSize[1] / 2 + 0.3, -modelSize[2] / 2 - 0.3]}
            onClick={(e) => {
              e.stopPropagation();
              handleRotate(false); // counter-clockwise
            }}
          >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="blue" />
          </mesh>
          <mesh
            position={[0, modelSize[1] / 2 + 0.3, modelSize[2] / 2 + 0.3]}
            onClick={(e) => {
              e.stopPropagation();
              handleRotate(true); // clockwise
            }}
          >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Furniture;
