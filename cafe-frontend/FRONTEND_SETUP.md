# Café Frontend - Interactive React Application

A modern, responsive React-based frontend for the Café Management System. This application provides a seamless user experience for browsing menu items, managing orders, and admin capabilities.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Auto-logout on token expiration
- Persistent user sessions

### 🍽️ Menu Management
- Browse available menu items
- Filter items by category
- Search functionality
- Item details with prices and availability

### 🛒 Shopping Cart
- Add items to cart
- Adjust quantities
- Remove items
- Real-time cart total calculation
- Tax calculation (10%)

### 📋 Order Management
- Place orders from cart
- View order history
- Track order status
- Cancel orders (pending/confirmed)
- Order details with itemized list

### 👨‍💼 Admin Panel
- Create, edit, and delete menu items
- Manage categories
- Set item availability
- Manage prices and descriptions
- Upload item images

## Project Structure

```
src/
├── components/          # React components
│   ├── Admin.jsx
│   ├── Cart.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Menu.jsx
│   ├── Navigation.jsx
│   ├── Orders.jsx
│   ├── ProtectedRoute.jsx
│   └── Register.jsx
├── context/            # State management
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── services/           # API communication
│   └── api.js
├── styles/            # CSS styling
│   ├── admin.css
│   ├── auth.css
│   ├── cart.css
│   ├── global.css
│   ├── home.css
│   ├── menu.css
│   ├── navbar.css
│   └── orders.css
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Configuration

### API Base URL
Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Key Dependencies

- **react**: ^19.2.4
- **react-dom**: ^19.2.4
- **react-router-dom**: ^6.20.1 - Client-side routing
- **axios**: ^1.6.5 - HTTP client for API calls

## API Integration

The frontend communicates with the Spring Boot backend using REST APIs:

### Available Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Menu
- `GET /api/menu` - Get available items
- `GET /api/menu/all` - Get all items (admin)
- `GET /api/menu/{id}` - Get item by ID
- `GET /api/menu/category/{categoryId}` - Filter by category
- `GET /api/menu/search?keyword=...` - Search items

#### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{itemId}` - Update quantity
- `DELETE /api/cart/items/{itemId}` - Remove item
- `DELETE /api/cart` - Clear cart

#### Orders
- `POST /api/order` - Create order
- `GET /api/order` - Get user's orders
- `GET /api/order/{id}` - Get order details
- `PUT /api/order/{id}/cancel` - Cancel order

#### Admin
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/{id}` - Update menu item
- `DELETE /api/admin/menu/{id}` - Delete menu item
- `POST /api/admin/category` - Create category
- `PUT /api/admin/category/{id}` - Update category
- `DELETE /api/admin/category/{id}` - Delete category

## Context & State Management

### AuthContext
Manages:
- User authentication state
- Login/register/logout functions
- User roles (admin detection)
- Token management

### CartContext
Manages:
- Shopping cart items
- Add/remove/update operations
- Cart total and item count
- Cart persistence with backend

## Authentication Flow

1. User registers/login
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. On 401 response, user is logged out
6. User redirected to login page

## Styling

The application uses a custom CSS framework with:
- **Primary Color**: `#8b6f47` (Coffee brown)
- **Secondary Color**: `#d4a574` (Café beige)
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Cards, shadows, and smooth transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### File Structure Best Practices
- One component per file
- Descriptive component names
- CSS modules organization
- API calls in services layer

### Debugging
- React Developer Tools extension
- Browser DevTools Network tab for API calls
- Console for error tracking

## Deployment

### Build Optimization
```bash
npm run build
```

The build output is in the `dist/` directory.

### Deployment to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend has CORS enabled:
```spring
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Configure CORS...
    }
}
```

### API Connection Issues
- Verify backend is running on `localhost:8080`
- Check network tab in DevTools
- Ensure JWT token is valid

### Cart Not Persisting
- Check localStorage in DevTools
- Verify cart endpoint returns correct data
- Check API response format

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Order tracking with real-time updates
- [ ] User profile management
- [ ] Wishlist feature
- [ ] Reviews and ratings
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Guest checkout option

## License

This project is part of the Café Management System.

## Support

For issues or questions, please contact the development team.
