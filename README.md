# 🍎 ExpiryWise - Food Expiry Tracker

A smart web application that helps you track food expiry dates, reduce waste, and get recipe suggestions for items about to expire. Upload photos of your groceries and let AI extract the information automatically!

## ✨ Features

- **📸 Smart Photo Upload**: Take photos of food items and let AI extract item names, quantities, and expiry dates
- **📊 Inventory Dashboard**: View all your food items with expiry tracking and smart filtering
- **⚠️ Expiry Alerts**: Get notified about items expiring soon or already expired
- **🍳 Recipe Suggestions**: Discover recipes based on your expiring items
- **🔍 Search & Filter**: Find items quickly by name, category, or expiry status
- **📱 Cross-Device Sync**: Access your inventory from any device with real-time synchronization
- **✏️ Edit Items**: Update quantities, expiry dates, and other details

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager
- Firebase project (for backend)
- Google Gemini API key (for AI image processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd expiry-wise-webapp
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
   - Enable Firestore Database
   - Update the Firebase configuration in `src/firebase.js` with your project details

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

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
- **Firebase Firestore** - Database
- **Firebase Functions** - Serverless functions
- **Google Gemini AI** - Image analysis and food extraction
- **Firebase Admin SDK** - Server-side operations

### Key Libraries
- **Lucide React** - Icons
- **date-fns** - Date utilities
- **Zod** - Schema validation
- **Recharts** - Data visualization

## 📱 How to Use

1. **Upload Food Items**
   - Go to the Upload tab
   - Take or select photos of your food items
   - AI will automatically extract item details

2. **Manage Inventory**
   - View all items in the Inventory tab
   - Filter by expiry status (expiring soon, expired, all)
   - Sort by expiry date, name, or category
   - Edit item details by clicking on any item

3. **Get Recipe Suggestions**
   - Visit the Recipes tab
   - See suggested recipes based on your expiring items
   - Reduce food waste by using items before they expire

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Update `src/firebase.js` with your config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     // ... other config
   };
   ```

### Gemini API Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

## 🚀 Deployment

### Deploy with Lovable
Simply open [Lovable](https://lovable.dev/projects/3ec67349-bf77-4c48-9fea-b0f1bee5c02b) and click on Share -> Publish.

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## 🌐 Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the setup instructions

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

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
- Visit the [Lovable Project](https://lovable.dev/projects/3ec67349-bf77-4c48-9fea-b0f1bee5c02b) for live editing
