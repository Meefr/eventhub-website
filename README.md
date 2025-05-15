# EventHub - Event Management Platform

## Description

EventHub is a full-stack event management platform that allows users to discover, book, and manage events. The platform features user authentication, event creation/management, booking functionality, and an admin dashboard. Built with React, Tailwind CSS, and integrated with a Node.js backend API.

## Key Features

- **User Authentication**: Login/registration with JWT
- **Event Discovery**: Browse featured and upcoming events
- **Booking System**: Reserve tickets for events
- **Admin Dashboard**: Manage events, users, and categories
- **Multi-language Support**: Internationalization with react-i18next `(English, Arabic)`
- **Dark/Light Mode**: Theme switching functionality
- **Responsive Design**: Mobile-friendly interface

## Live Demo

The application is deployed on GitHub Pages:  
[https://Meefr.github.io/eventhub-website](https://Meefr.github.io/eventhub-website)

## Technologies

### Frontend

- **Framework**: React 18
- **Routing**: React Router 6
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Internationalization**: react-i18next
- **HTTP Client**: Axios
- **Icons**: Heroicons

### Backend (API)

- Node.js with Express
- MongoDB (Mongoose ODM)
- JWT Authentication
- Cloudinary for image storage

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Meefr/eventhub-website.git
   cd eventhub-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment:
   change `API_BASE_URL` in `src/config/index.js` based on backend is running local or deployed version 
   ```javascript 
   export const API_BASE_URL = "https://event-hub-api-iota.vercel.app/api/v1";
   // export const API_BASE_URL = "http://localhost:5000/api/v1";
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. For production build:
   ```bash
   npm run build
   ```

## Project Structure

```
/src
├── components/          # React components
│   ├── auth/            # Authentication components
│   ├── admin/           # Admin panel components
│   ├── common/          # Shared UI components
│   └── ...              # Other feature components
├── contexts/            # Context providers
├── lang/                # Internationalization files
├── services/            # API service modules
├── styles/              # Global styles
└── App.jsx              # Main application component
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
