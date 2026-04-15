# Ngawang Sherpa — Portfolio Project

A premium, high-performance cybersecurity and AI/ML portfolio website. This project is designed with a "Cyber & AI" aesthetic, featuring advanced web animations and dedicated project detail pages.

## 🚀 Technology Stack
- **Core**: HTML5, Vanilla CSS, JavaScript
- **Animations**: [GSAP](https://greensock.com/gsap/) (ScrollTrigger), [Lenis](https://github.com/darkroomengineering/lenis) (Smooth Scroll)
- **Visuals**: Canvas Particles, 3D Tilt Effects, Text Scramble, Glitch Effects
- **Backend**: Node.js (Express) for contact form handling and static serving

## 📂 Project Structure
- `index.html`: The main landing page featuring Hero, Expertise, Projects grid, Stats, and Contact sections.
- `server.js`: Express server for handling SMTP email via Nodemailer and serving the frontend.
- `projects/`: Individual detail pages for all portfolio projects.
  - `template.html`: Reusable layout for new projects.
  - `malware-dev.html`: Custom Malware Development.
  - `firewall.html`: Firewall & Surveillance.
  - `phishing.html`: Phishing Simulation.
  - `Vonbot.html`: VONBOT (Open Claw-like Agent).
  - `milex.html`: MILEX (CLI Agent).
  - `spam-detection.html`: Spam Detection System.
  - `yolo.html`: YOLO Object Detection.
  - `n8n-chatbot.html`: n8n AI Chatbot.
- `assets/`:
  - `css/`: `style.css` (global) and `project-detail.css` (specialized for project pages).
  - `js/`: `script.js` (all interactive logic).
  - `images/`: Project screenshots and branding assets.

## 🛠️ Portfolio Projects Detailed
1. **Custom Malware Development**: Research on attack vectors and defensive countermeasures.
2. **Firewall & Surveillance**: PFSense network security combined with AI premises monitoring.
3. **Phishing Simulation**: Training platform for identifying human vulnerabilities to social engineering.
4. **VONBOT**: Custom robotic arm system with intelligent agent-driven task execution.
5. **MILEX (CLI Agent)**: Local-first terminal AI agent using Ollama for privacy and speed.
6. **Spam Detection System**: High-accuracy NLP-based message filtering.
7. **YOLO Object Detection**: Real-time security object detection using YOLOv8 and TensorRT.
8. **n8n AI Agent**: Intelligent workflow automation agent.

## 🎨 Design Principles
- **Aesthetic**: Futuristic, Dark Mode, Cyan/Purple accent glows.
- **Interactions**:
  - **Magnetic Buttons**: Elements that subtly follow the cursor.
  - **Custom Cursor**: A multi-layered interactive pointer.
  - **Text Scramble**: Dynamic reveal animations for section titles.
  - **Scroll Reveal**: GSAP-driven entrance animations.

## 📝 Recent Updates
- [x] Implementation of individual project pages.
- [x] Premium UI overhaul for project detail pages.
- [x] Fixed nested anchor tag issues in the main project grid.
- [x] Moved GitHub links to a dedicated "Check my GitHub" bottom section.
- [x] Renamed Robotics project to **VONBOT Agent**.
