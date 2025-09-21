# Study Reminder System

A comprehensive full-stack web application that helps students manage their study schedules and receive automated email reminders to stay on track with their learning goals.

![Study Reminder System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Next.js](https://img.shields.io/badge/Next.js-14+-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## 🎯 Features

### Core Functionality
- **User Authentication**: Secure registration and login system with JWT tokens
- **Study Schedule Management**: Create, edit, delete, and toggle study schedules
- **Automated Email Reminders**: Receive beautiful HTML email notifications 10 minutes before study time
- **Multi-day Support**: Schedule study sessions across multiple days of the week
- **Real-time Dashboard**: Track your study schedules with interactive stats
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **Cron Job System**: Automated background service for reliable email delivery
- **Email Queue Management**: Robust email delivery with retry logic and failure handling
- **Dark/Light Theme**: Customizable user interface
- **Study Statistics**: Visual insights into your study habits
- **Timezone Support**: Accurate scheduling across different time zones
- **Rate Limiting**: Production-ready API security measures

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service integration
- **Node-cron** - Task scheduling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation
- **Axios** - HTTP client
- **React Hot Toast** - Notification system
- **Lucide React** - Icon library

### Email Service
- **Zoho Mail** - Professional email delivery
- **HTML Email Templates** - Beautiful, responsive email design
- **Retry Logic** - Reliable email delivery with fallback mechanisms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Zoho Mail account with app password
- Git installed

### Installation

1. **Clone the Repository**

 ```bash
git clone https://github.com/toshankanwar/Study-Remainder.git
cd study-reminder-system 
```


2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd frontend1
npm install
```

### Configuration

4. **Backend Environment Variables**
Create `backend/.env`:

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/study-reminder
JWT_SECRET=your-super-secret-jwt-key-12345
JWT_EXPIRES_IN=7d

Zoho Email Configuration
EMAIL_HOST=smtppro.zoho.in
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-zoho-app-password
EMAIL_FROM=Study Reminder your-email@yourdomain.com

FRONTEND_URL=http://localhost:3000
```

5. **Frontend Environment Variables**
Create `frontend/.env.local`:

```bash
cd backend
node server.js
```


7. **Start Frontend Server**
```bash
cd frontend
npm run dev
```

8. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📧 Email Setup (Zoho Configuration)

### Enable IMAP Access
1. Login to Zoho Mail
2. Go to **Settings** → **Mail Accounts**
3. Select your account → **IMAP/POP Access**
4. Enable **IMAP Access**

### Create App Password
1. Go to **Zoho Accounts** → **Security** → **App Passwords**
2. Generate new app password for "Mail"
3. Use this password in your `.env` file

## 📱 Usage

### Getting Started
1. **Register**: Create a new account with your email
2. **Login**: Access your personalized dashboard
3. **Add Schedule**: Create study schedules with topics and times
4. **Receive Reminders**: Get email notifications 10 minutes before study time
5. **Manage Schedules**: Edit, toggle, or delete schedules as needed

### Creating Study Schedules
- **Study Topic**: Enter what you want to study
- **Study Time**: Set your preferred study time
- **Days**: Select which days of the week
- **Description**: Add optional notes or details

### Email Notifications
- Automated emails sent 10 minutes before study time
- Beautiful HTML templates with study details
- Motivational content and study tips
- Reliable delivery with retry mechanisms


## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push to main branch

### Frontend Deployment (Vercel)
1. Import project from GitHub
2. Configure environment variables
3. Deploy with automatic CI/CD

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Update MONGODB_URI in environment variables
3. Configure network access and database users

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent API abuse
- **CORS Configuration** for secure cross-origin requests
- **Input Validation** for all user inputs
- **Helmet Security** headers for production
- **Environment Variables** for sensitive configuration


### API Testing
- Use the `/api/health` endpoint to verify backend connectivity
- Test email service with `/api/test-zoho-email` endpoint

## 📊 Monitoring & Logging

- Comprehensive error logging for debugging
- Email delivery status tracking
- Cron job execution monitoring
- API request/response logging in development

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues
- **Email not sending**: Check Zoho configuration and app password
- **Database connection**: Verify MongoDB URI and network access
- **CORS errors**: Ensure frontend URL is configured in backend
- **Build errors**: Check Node.js version and dependency compatibility

### Support
- Create an issue on GitHub for bug reports
- Check existing issues for known problems
- Review deployment logs for error details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by productivity and education needs
- Community-driven development approach

## 📞 Contact
-**Made by**: David Fule And Toshan Kanwar
- **GitHub**: [@toshankanwar](https://github.com/toshankanwar)
- **GitHub**: [@DavidFule](https://github.com/david-one8)
- **Email**: contact@toshankanwar.website
- **Project Link**: https://study-remainder.toshankanwar.website/

---

**⭐ If you find this project helpful, please give it a star on GitHub!**

Made with ❤️ for students everywhere who want to stay organized and achieve their learning goals.


