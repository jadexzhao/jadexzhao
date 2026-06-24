# Online Ordering System

Problem: Small restaurants need reliable online ordering without costly vendor lock-in.

What I built: End-to-end ordering platform for a family restaurant (menu, orders, payments) — production-tested since 2020.

Status: Legacy / Maintained

## Features

🍜 **Menu Management**
- Dynamic menu display
- Category organization
- Item descriptions with images
- Pricing and special pricing rules
- Seasonal item management

🛒 **Shopping Cart**
- Add/remove items
- Quantity management
- Special instructions per item
- Real-time price calculation
- Cart persistence

📱 **Order Processing**
- Online order placement
- Order confirmation emails
- Real-time order status
- Order history tracking
- Reorder functionality

🚗 **Delivery & Pickup**
- Delivery zone management
- Pickup time scheduling
- Delivery fee calculation
- Address validation
- Driver tracking (optional)

💳 **Payments**
- Multiple payment methods
- Secure payment processing
- Order receipt generation
- Refund handling

👨‍💼 **Admin Dashboard**
- Order management
- Menu updates
- Sales analytics
- Customer management
- Staff scheduling

## Tech Stack

### Frontend
- **Framework**: React / Vue.js
- **Styling**: CSS / Bootstrap
- **State**: Redux / Vuex
- **Build**: Webpack / Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB / PostgreSQL
- **Authentication**: JWT
- **Payment Integration**: Stripe / Square

### Deployment
- Heroku / DigitalOcean
- Static hosting for frontend

## Project Structure

```
online-ordering-system/
├── src/                     # Frontend
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
├── backend/                 # Node.js server
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── config/
├── README.md
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 12+
- MongoDB or PostgreSQL
- npm or yarn

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Development

```bash
# Start frontend dev server
npm run dev

# In another terminal, start backend
cd backend
npm run dev
```

### Build & Deploy

```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build

# Deploy to hosting platform
```

## Key Business Features

- Online ordering reducing phone call volume
- Order management system for kitchen staff
- Customer accounts with order history
- Email notifications for order updates
- Admin panel for menu and order management
- Basic reporting and analytics

## Performance Considerations

- Fast load times for menu browsing
- Optimized image delivery
- Mobile-responsive design
- Reliable payment processing
- Real-time order status updates

## Impact

This first project taught me the full cycle of software development:
- Requirements gathering from restaurant owner
- Design and architecture decisions
- Frontend and backend development
- Deployment and maintenance
- Customer support and feedback

It demonstrated real business value and led to continued partnerships and opportunities in software engineering.

## Technical Lessons Learned

- Full-stack development workflow
- User-centered design thinking
- Deployment and DevOps basics
- Customer communication
- Iterative feature development

## Legacy

This project remains in production use and continues to process orders for the restaurant, validating the importance of building reliable systems that serve real business needs.
