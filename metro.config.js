const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// ต้องระบุให้ชัดเจนว่ารู้จักทั้งนามสกุลไฟล์ 3D และรูปภาพ
config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg', 'jpeg');

module.exports = config;