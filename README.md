# WebXR Photorealistic Viewer

A modern, photorealistic 3D viewer with VR and AR support built with Three.js and WebXR. This project demonstrates advanced 3D rendering techniques including PBR materials, HDRI lighting, and immersive XR experiences.

## 🌟 Features

- **Photorealistic Rendering**: PBR materials with physically-based lighting
- **HDRI Environment**: Studio lighting with high-dynamic-range imaging
- **VR Support**: Full VR experience on Quest 2 and other VR headsets
- **AR Support**: Augmented reality on Android Chrome and iOS Safari
- **Responsive Design**: Works on desktop, mobile, and XR devices
- **PWA Ready**: Progressive Web App with offline capabilities
- **Modern UI**: Clean, intuitive interface with WebXR buttons

## 🚀 Quick Start

### Prerequisites
- Modern web browser with WebGL support
- For VR: WebXR-compatible headset (Quest 2, etc.)
- For AR: Android Chrome or iOS Safari

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bakedpsyche/Ashish-VR.git
   cd Ashish-VR
   ```

2. **Start the development server**
   ```bash
   # Using Python (recommended)
   python -m http.server 5000
   
   # Or using Node.js
   npx serve .
   ```

3. **Open in browser**
   - Navigate to `http://localhost:5000`
   - For VR testing: Use HTTPS (required for WebXR)

## 🎮 Controls

### Desktop
- **Mouse**: Orbit around the 3D scene
- **Scroll**: Zoom in/out
- **Right-click**: Pan the view

### VR Mode
- **VR Button**: Enter immersive VR experience
- **Controllers**: Use VR controllers for interaction
- **Head movement**: Look around naturally

### AR Mode
- **AR Button**: Launch AR experience (Android)
- **Touch**: Tap to place objects in real world
- **Camera**: Point device at surfaces for placement

## 📁 Project Structure

```
Ashish-VR/
├── index.html          # Main HTML file
├── main.js            # Core WebXR application
├── style.css          # Styling (if needed)
├── manifest.json      # PWA manifest
├── sw.js             # Service worker
├── package.json       # Dependencies
├── README.md         # This file
└── assets/
    ├── models/       # 3D models (.glb files)
    └── env/          # HDRI environment maps
```

## 🛠️ Development

### Key Technologies
- **Three.js**: 3D graphics library
- **WebXR**: VR/AR web standard
- **GLTF**: 3D model format
- **HDR**: High dynamic range lighting

### Browser Support
- ✅ Chrome (desktop & mobile)
- ✅ Firefox (desktop)
- ✅ Safari (iOS AR)
- ✅ Edge (desktop)

### VR/AR Support
- ✅ Meta Quest 2/3/Pro
- ✅ Android Chrome AR
- ✅ iOS Safari AR
- ✅ Desktop VR headsets

## 🎨 Customization

### Adding Your Own Models
1. Place `.glb` files in `assets/models/`
2. Update the model path in `main.js`
3. Adjust positioning and scaling as needed

### Changing Environment
1. Add HDR files to `assets/env/`
2. Update the HDRI path in `main.js`
3. Adjust lighting parameters

### Modifying Materials
- Edit PBR material properties in `main.js`
- Adjust `envMapIntensity` for reflections
- Modify `toneMapping` for different looks

## 🔧 Troubleshooting

### Black Screen Issues
1. **Check WebGL support**: Visit `chrome://gpu/`
2. **Update graphics drivers**: Ensure latest GPU drivers
3. **Enable hardware acceleration**: In browser settings
4. **Try different browser**: Chrome recommended

### VR Not Working
1. **Use HTTPS**: WebXR requires secure connection
2. **Check headset connection**: Ensure proper setup
3. **Update browser**: Use latest Chrome/Firefox
4. **Enable WebXR**: Check browser flags

### Performance Issues
1. **Reduce model complexity**: Simplify geometry
2. **Lower texture resolution**: Compress images
3. **Disable shadows**: If not needed
4. **Use simpler lighting**: Reduce light count

## 📱 PWA Features

This project includes Progressive Web App capabilities:
- **Offline support**: Service worker caching
- **Install prompt**: Add to home screen
- **App-like experience**: Full-screen mode
- **Fast loading**: Optimized assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for the amazing 3D library
- WebXR community for VR/AR standards
- Khronos Group for GLTF format
- All contributors and testers

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Search existing issues
3. Create a new issue with details
4. Include browser version and device info

---

**Made with ❤️ for the WebXR community** 