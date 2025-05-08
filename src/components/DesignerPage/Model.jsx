import React, { useRef, useEffect, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const ChairModel = forwardRef((props, ref) => {
  const { color, size = [1, 1, 1] } = props;
  const { scene: chair1 } = useGLTF("/assets/chaira.glb");
  const { scene: chair2 } = useGLTF("/assets/chair_02.glb");

  const { scene: table1 } = useGLTF("/assets/table_01.glb");
  const { scene: table2 } = useGLTF("/assets/table_02.glb");

  const { scene: sofa1 } = useGLTF("/assets/sofa_01.glb");
  const { scene: sofa2 } = useGLTF("/assets/sofa_02.glb");

  const { scene: cupboard1 } = useGLTF("/assets/closet_01.glb");
  const { scene: cupboard2 } = useGLTF("/assets/closet_02.glb");

  const { scene: bed1 } = useGLTF("/assets/bed_01.glb");
  const { scene: bed2 } = useGLTF("/assets/bed_02.glb");
  const modelRef = useRef();

  if (props.type === "chair1") {
    // Clone scene so each instance is separate
    const clonedScene = chair1.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "chair2") {
    // Clone scene so each instance is separate
    const clonedScene = chair2.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "table1") {
    // Clone scene so each instance is separate
    const clonedScene = table1.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "table2") {
    // Clone scene so each instance is separate
    const clonedScene = table2.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "sofa1") {
    // Clone scene so each instance is separate
    const clonedScene = sofa1.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "sofa2") {
    // Clone scene so each instance is separate
    const clonedScene = sofa2.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "cupboard1") {
    // Clone scene so each instance is separate
    const clonedScene = cupboard1.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "cupboard2") {
    // Clone scene so each instance is separate
    const clonedScene = cupboard2.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "bed1") {
    // Clone scene so each instance is separate
    const clonedScene = bed1.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }

  if (props.type === "bed2") {
    // Clone scene so each instance is separate
    const clonedScene = bed2.clone(true);

    // Apply color and shading properties
    useEffect(() => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            // Create new material with shading properties
            const newMaterial = new THREE.MeshStandardMaterial({ 
              color, 
              metalness: props.metalness || 0.2,
              roughness: props.roughness || 0.7,
              // Preserve any existing maps
              map: child.material?.map,
              normalMap: child.material?.normalMap,
              aoMap: child.material?.aoMap
            });
            
            // Set shadow properties
            child.castShadow = props.castShadow !== false;
            child.receiveShadow = props.receiveShadow !== false;
            
            child.material = newMaterial;
          }
        });
      }
    }, [clonedScene, color, props.metalness, props.roughness, props.castShadow, props.receiveShadow]);

    useEffect(() => {
      if (!clonedScene) return;

      const box = new THREE.Box3().setFromObject(clonedScene);
      const originalSize = new THREE.Vector3();
      box.getSize(originalSize);

      const [targetX, targetY, targetZ] = size;

      const scaleX = targetX / originalSize.x;
      const scaleY = targetY / originalSize.y;
      const scaleZ = targetZ / originalSize.z;

      clonedScene.scale.set(scaleX, scaleY, scaleZ);

      console.log("Original size:", originalSize);
      console.log("Target size:", size);
      console.log("Applied scale:", clonedScene.scale);
    }, [clonedScene, size]);

    return <primitive ref={modelRef} object={clonedScene} {...props} />;
  }
});

export default ChairModel;
