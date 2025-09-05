# 🍎 ExpiryWise - Food Expiry Tracker

A comprehensive web application that helps you track food expiry dates, reduce waste, and get intelligent recipe suggestions. Upload photos of your groceries and let AI extract the information automatically with advanced date parsing capabilities!

## ✨ Features

### 🔐 **User Authentication & Security**
- **Email/Password Authentication**: Secure user accounts with Firebase Auth
- **Google Sign-In**: Quick and easy authentication with Google OAuth
- **User-Specific Data**: Each user has their own private inventory and settings
- **Secure API Key Management**: Environment variables properly configured

### 📸 **Smart AI Integration**
- **Intelligent Photo Upload**: Take photos of food items and let AI extract details
- **Advanced Date Parsing**: Handles multiple date formats (DD/MM/YYYY, MM/DD/YYYY)
- **Food Item Recognition**: Automatically identifies food names, quantities, and expiry dates
- **Error-Resistant Processing**: Robust parsing for various date formats and edge cases

### 📊 **Comprehensive Inventory Management**
- **Smart Dashboard**: View all food items with expiry tracking and statistics
- **Advanced Filtering**: Filter by expiry status (expiring soon, expired, all items)
- **Search Functionality**: Find items quickly by name, category, or expiry status
- **Edit & Delete**: Update quantities, expiry dates, and other details
- **Mobile-Responsive Design**: Optimized for both desktop and mobile devices

### 🔔 **Intelligent Notification System**
- **Real-Time Alerts**: Get notified about items expiring soon or already expired
- **Customizable Settings**: Configure notification preferences and timing
- **Recipe Suggestions**: Get notified about recipe recommendations for expiring items
- **Persistent Storage**: Notifications saved locally and synced across devices

### 🍳 **Dynamic Recipe System**
- **Inventory-Driven Recipes**: Only shows recipes for items in your inventory
- **Expiring Item Priority**: Prioritizes recipes for items about to expire
- **Detailed Recipe Views**: Comprehensive recipe information with ingredients and instructions
- **Search & Filter**: Find recipes by ingredients or dietary preferences

### ⚙️ **Comprehensive Settings**
- **Notification Preferences**: Customize alert types, timing, and channels
- **Account Management**: Update profile information and preferences
- **Privacy Controls**: Manage data sharing and profile visibility
- **Display Options**: Customize theme, language, and view preferences
- **Data Management**: Export data (JSON/PDF) and clear all data

### 📱 **Cross-Device Experience**
- **Real-Time Sync**: Access your inventory from any device
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Offline Capability**: Works with cached data when offline

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager
- Firebase project (for backend and authentication)
- Google Gemini API key (for AI image processing)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rshashank20/foodexpiry-tracker.git
   cd foodexpiry-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Enable Google Authentication in Authentication > Sign-in method
   - Update the Firebase configuration in `src/firebase.js` with your project details
   - Set up Firestore security rules (included in `firestore.rules`)

5. **Deploy Cloud Functions (Optional)**
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `firebase deploy` - Deploy to Firebase Hosting
- `firebase deploy --only functions` - Deploy only Cloud Functions

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **TanStack Query** - Data fetching

### Backend & Services
- **Firebase Firestore** - NoSQL database with user-specific collections
- **Firebase Authentication** - User authentication and authorization
- **Firebase Cloud Functions** - Serverless functions for expiry checks
- **Google Gemini AI** - Advanced image analysis and food extraction
- **Firebase Admin SDK** - Server-side operations and security

### Key Libraries
- **Lucide React** - Modern icon library
- **date-fns** - Date utilities and parsing
- **Zod** - Schema validation
- **React Hook Form** - Form handling and validation
- **TanStack Query** - Data fetching and caching
- **jspdf & html2canvas** - PDF export functionality
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable UI components

## 📱 How to Use

### 🔐 **Getting Started**
1. **Sign Up/Login**
   - Create an account with email/password or use Google Sign-In
   - Your data is private and secure to your account

2. **Upload Food Items**
   - Go to the Upload tab
   - Take or select photos of your food items
   - AI will automatically extract item details with smart date parsing
   - Review and confirm the extracted information

### 📊 **Managing Your Inventory**
3. **View Your Inventory**
   - Check the Inventory tab for all your food items
   - See statistics: total items, expiring soon, expired items
   - Filter by expiry status (expiring soon, expired, all items)
   - Search for specific items by name

4. **Edit Items**
   - Click on any item to edit details
   - Update quantities, expiry dates, or other information
   - Delete items you no longer have

### 🍳 **Recipe Management**
5. **Discover Recipes**
   - Visit the Recipes tab for intelligent suggestions
   - See recipes only for items in your inventory
   - Prioritizes recipes for items about to expire
   - Search and filter recipes by ingredients

### 🔔 **Notifications & Settings**
6. **Configure Notifications**
   - Go to Settings > Notifications
   - Set up alerts for expiring items
   - Choose notification timing and preferences

7. **Customize Your Experience**
   - Adjust display preferences (theme, language, date format)
   - Manage privacy settings
   - Export your data (JSON or PDF format)

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication and set up sign-in methods:
   - Email/Password authentication
   - Google Sign-In (enable in Authentication > Sign-in method)
4. Update `src/firebase.js` with your config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```
5. Deploy Firestore security rules (included in `firestore.rules`)

### Gemini API Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. **Important**: Never commit your `.env` file to version control

### Cloud Functions Setup (Optional)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize functions: `firebase init functions`
4. Deploy: `firebase deploy --only functions`

## 🚀 Deployment

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize hosting: `firebase init hosting`
4. Build the project: `npm run build`
5. Deploy: `firebase deploy`

### Deploy Cloud Functions
1. Navigate to functions directory: `cd functions`
2. Install dependencies: `npm install`
3. Return to root: `cd ..`
4. Deploy functions: `firebase deploy --only functions`

### Live Application
- **Production URL**: [https://foodexpiry-tracker.web.app](https://foodexpiry-tracker.web.app)
- **GitHub Repository**: [https://github.com/rshashank20/foodexpiry-tracker](https://github.com/rshashank20/foodexpiry-tracker)

## 🔒 Security Features

- **User Authentication**: Secure login with Firebase Auth
- **Data Privacy**: Each user's data is isolated and private
- **API Key Protection**: Environment variables properly configured
- **Firestore Security Rules**: Database access restricted to authenticated users
- **Input Validation**: Robust date parsing and data validation
- **HTTPS**: Secure connections for all data transmission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the [GitHub Issues](https://github.com/rshashank20/foodexpiry-tracker/issues) for known problems
- Review the documentation above for setup and configuration help

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Barcode scanning for product lookup
- [ ] Integration with grocery store APIs
- [ ] Meal planning features
- [ ] Shopping list generation
- [ ] Multi-language support
- [ ] Advanced analytics and insights
