import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Plane, Box } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import wood_floor from "../../assets/wood_floor.jpeg";
import marble_floor from "../../assets/marble_floor.jpg";
import carpet_floor from "../../assets/carpet_floor.jpg";
import tile_floor from "../../assets/tile_floor.jpg";
import granite_floor from "../../assets/granite_floor.jpg";

// Or if it's in a separate file: c:\Users\LOCHANA\Desktop\Furniture-Store-main\frontend\src\components\customer\Floor.jsx

const Floor = ({ roomWidth, roomLength, is2D, selectedFloor }) => {
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
      args={[roomWidth, roomLength]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow={!is2D}
    >
      <meshStandardMaterial map={texture} color={texture ? undefined : "#e0e0e0"} />
    </Plane>
  );
};