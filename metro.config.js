const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// เพิ่มนามสกุลไฟล์ที่ต้องการให้ Metro ยอมรับ
config.resolver.assetExts.push('glb', 'gltf', 'obj', 'mtl');

module.exports = config;