# AI Calorie Tracker 🥗📸

AI Calorie Tracker is a mobile application built with **React Native** and **Expo** that leverages **Google Gemini AI** and **Google Cloud Vision** to analyze food images and provide detailed nutritional information. It helps users track their daily calorie intake, monitor their progress, and achieve their health goals.

## ✨ Features

- **🔍 AI Food Scanning**: Snap a photo or upload an image of your meal to get instant nutritional analysis using advanced AI.
- **📊 Calorie Tracking**: Automatically log calories, macronutrients (protein, carbs, fats), and portion sizes.
- **📜 History & Logs**: Keep a daily record of your meals and track your nutritional trends over time.
- **👤 Personalized Profiles**: Set up your profile with age, weight, height, and activity level to receive tailored calorie recommendations.
- **🔐 Secure Authentication**: Integrated with **Firebase Auth** for secure user login and data storage.
- **📱 Cross-Platform**: Seamlessly runs on both iOS and Android thanks to Expo.

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, React Navigation
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI/ML**: Google Gemini Pro Vision API, Google Cloud Vision API
- **State Management**: React Context API
- **Styling**: React Native StyleSheet (Custom Premium UI)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Expo Go](https://expo.dev/go) app on your mobile device (for testing)
- [Firebase account](https://firebase.google.com/) for backend services
- [Google Cloud Console](https://console.cloud.google.com/) account for Gemini and Vision API keys

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aryannaikar/AI-Calorie-Tracker.git
   cd AI-Calorie-Tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GOOGLE_VISION_API_KEY=your_vision_api_key
   GEMINI_API_KEY=your_gemini_api_key
   
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```

5. **Run on your device**:
   Scan the QR code displayed in the terminal using the **Expo Go** app (Android) or the **Camera app** (iOS).

## 📁 Project Structure

```text
AI-Calorie-Tracker/
├── assets/             # Images, fonts, and static assets
├── context/            # React Context for global state (Auth, etc.)
├── navigation/         # App navigation configuration
├── screens/            # Application screens (Dashboard, Scan, History, etc.)
│   ├── Dashboard/      # Main stats and daily overview
│   ├── Scan/           # Camera and image analysis interface
│   ├── History/        # Past meal logs
│   └── ProfileSetup/   # User onboarding and goals
├── services/           # API and third-party service logic (Gemini, Vision, Firebase)
└── firebaseConfig.js   # Firebase initialization
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
