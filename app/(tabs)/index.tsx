import { ContactShadows, OrbitControls, useGLTF, useTexture } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import React, { Suspense } from 'react';
import { View } from 'react-native';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface GLTFResult extends GLTF {
  nodes: any;
  materials: any;
}

// ส่วนของห้อง: พื้น และ ผนังที่มีความหนา (Thickness)
function RoomBase() {
  const wallThickness = 0.5;
  const wallHeight = 4;
  const roomSize = 10;
  const floorThickness = 0.5;

  // 1. โหลด Texture (เปลี่ยนชื่อไฟล์ตามที่มีใน assets)
  // ถ้ายังไม่มีไฟล์ภาพ ให้คอมเมนต์บรรทัดนี้ออกก่อนครับ
  const texture = useTexture(require('../../assets/images/argyle.png')) as THREE.Texture; 
  
  // ปรับการซ้ำของลาย (Tiling) ให้ดูสมจริง
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1); 

  return (
    <group>
      {/* 1. พื้นห้อง (Floor) - อยู่ที่ตำแหน่ง y = 0 */}
      <mesh position={[0, -floorThickness / 2, 0]}>
        <boxGeometry args={[roomSize, floorThickness, roomSize]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* 2. ผนังฝั่งซ้าย (Left Wall) - ปรับตำแหน่ง y ให้เริ่มจาก 0 */}
      <mesh position={[-(roomSize / 2 + wallThickness / 2), wallHeight / 2 - 0.01, 0]}>
        <boxGeometry args={[wallThickness, wallHeight, roomSize + (wallThickness * 2)]} />
        {/* ใส่ Texture ที่นี่ */}
        <meshStandardMaterial map={texture} color="#ffffff" /> 
      </mesh>

      {/* 3. ผนังฝั่งหลัง (Back Wall) - ปรับตำแหน่ง y ให้เริ่มจาก 0 */}
      <mesh position={[0, wallHeight / 2 - 0.01, -(roomSize / 2 + wallThickness / 2)]}>
        <boxGeometry args={[roomSize, wallHeight, wallThickness]} />
        {/* ถ้าอยากให้ผนังคนละด้านมีลายต่างกัน ก็โหลด Texture เพิ่มอีกตัวมาใส่ตรงนี้ได้ครับ */}
        <meshStandardMaterial map={texture} color="#ffffff" />
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
          {/* <Environment preset="city" /> */}
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