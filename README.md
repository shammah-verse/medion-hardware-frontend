# Medion Hardware

A modern, high-performance e-commerce platform designed for hardware vendors and tech enthusiasts. Medion Hardware provides a seamless shopping experience for customers and a comprehensive vendor dashboard for store owners.

## 🌟 Key Features

### For Customers
* **Modern & Responsive UI**: Built with a sleek, dark-mode ready design using Tailwind CSS and micro-animations.
* **Authentication**: Secure JWT-based authentication system.
* **Shopping Cart & Checkout**: Real-time cart management with a slide-out drawer and an integrated Pesapal checkout flow.
* **Product Discovery**: Browse hardware components, read detailed descriptions, and filter by categories.
* **Ratings & Reviews**: Authenticated users can leave reviews and ratings for products they've purchased.
* **Order Management**: View past orders and manage profile details.

### For Vendors & Admins
* **Vendor Dashboard**: A dedicated portal for vendors to manage their store and inventory.
* **Product CRUD**: Easily create, update, and delete product listings.
* **Multiple Image Uploads**: Drag-and-drop support for uploading and managing multiple high-quality product images via secure endpoints.
* **Admin Analytics**: High-level overviews of store performance and revenue tracking.

## 🛠 Tech Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tool**: Vite for lightning-fast HMR and optimized production builds
* **Styling**: Tailwind CSS for utility-first styling and dynamic theming
* **State Management**: Zustand for global state (Auth, Cart)
* **Routing**: React Router DOM v6
* **API Client**: Axios with global interceptors for JWT injection
* **Icons & Assets**: Lucide React for crisp SVG icons and DotLottie for dynamic success animations

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and npm installed.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/medion-hardware-frontend.git
   cd medion-hardware-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and configure your backend API URL and any other necessary secrets:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
You can then preview the build locally using:
```bash
npm run preview
```

## 📁 Project Structure

```text
src/
├── api/             # Axios client, interceptors, and API service functions
├── components/      # Reusable UI components (Buttons, Inputs, Modals, Navbar)
├── pages/           # Route-level components (Home, Checkout, Dashboards)
├── store/           # Zustand state slices (useAuthStore, useCartStore)
├── assets/          # Static assets, CSS, and global styles
└── App.tsx          # Main application router and layout wrapper
```

## 🔐 Authentication Flow
The application uses JSON Web Tokens (JWT) for authorization.
* Upon successful login or registration, the backend issues an `accessToken`.
* The token is stored globally using Zustand.
* An Axios interceptor automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests.
* Protected routes (e.g., `/checkout`, `/vendor`) automatically redirect unauthenticated users to `/login`.

## 🤝 Contributing
Contributions are always welcome! Please follow standard Git workflow practices:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License
This project is licensed under the MIT License.
