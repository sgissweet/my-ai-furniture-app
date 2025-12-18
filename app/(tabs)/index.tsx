import { ContactShadows, Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import { Asset } from 'expo-asset';
import React, { Suspense, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface GLTFResult extends GLTF {
  nodes: any;
  materials: any;
}

const wallTextureAsset = require('../../assets/images/argyle.png');

function RoomBase() {
  const [ready, setReady] = useState(false);

  // บังคับโหลด Asset ให้เสร็จก่อนเริ่ม render texture
  useEffect(() => {
    Asset.fromModule(wallTextureAsset).downloadAsync().then(() => setReady(true));
  }, []);

  // ... ใน RoomBase
  const wallAsset = require('../../assets/images/argyle.png');
  // ใช้ Asset.fromModule เพื่อดึง URI ที่แท้จริงออกมา (รองรับทั้ง Web และ Native)
  const asset = Asset.fromModule(wallAsset);
  const texture = useTexture(asset.uri || wallAsset) as THREE.Texture;

  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2); // ปรับเลขนี้ตามความเหมาะสมของลาย
  }

  // ถ้ายังโหลดไม่เสร็จ ให้คืนค่า null หรือพื้นเปล่าๆ ไปก่อน เพื่อไม่ให้แอปค้าง
  if (!ready || !texture) return (
    <mesh position={[0, -0.25, 0]}>
      <boxGeometry args={[10, 0.5, 10]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );

  return (
    <group>
      {/* พื้นห้อง */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[10, 0.5, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* ผนัง (ใส่ Texture) */}
      <mesh position={[-5.25, 2, 0]}>
        <boxGeometry args={[0.5, 4, 11]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
      <mesh position={[0, 2, -5.25]}>
        <boxGeometry args={[10, 4, 0.5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

function FurnitureModel({ url, position }: { url: any; position: [number, number, number] }) {
  const gltf = useGLTF(url) as GLTFResult;
  return (
    <primitive 
      object={gltf.scene} 
      position={position} 
      scale={0.001} 
      castShadow 
    />
  );
}

export default function App() {
  const sofaFile = require('../../assets/DEKAD_alarm_clock.glb');

  return (
    <View style={{ flex: 1, backgroundColor: '#d1d1d1' }}>
      <Canvas 
        shadows 
        // ปรับ Camera ให้มองเห็นกว้างขึ้นเล็กน้อย
        camera={{ position: [12, 12, 12], fov: 40, near: 0.1, far: 1000 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        
        <Suspense fallback={null}>
          <RoomBase />
          <FurnitureModel url={sofaFile} position={[0, 0, 0]} />
          
          <ContactShadows opacity={0.5} scale={15} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>

        {/* --- ระบบ Zoom และ Control --- */}
        <OrbitControls 
          makeDefault 
          enableZoom={true}       // เปิดการ Zoom
          minDistance={5}         // ซูมเข้าได้ใกล้สุดแค่ไหน
          maxDistance={30}        // ซูมออกได้ไกลสุดแค่ไหน
          maxPolarAngle={Math.PI / 2.1} // ป้องกันไม่ให้หมุนลงไปใต้พื้น
        />
      </Canvas>
    </View>
  );
}