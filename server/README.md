# Nutrition Tracking Application - Backend API

A comprehensive, scalable backend for a nutrition tracking application built with Node.js, Express.js, and MongoDB.

## Features

- **User Authentication & Authorization**
  - Separate login routes for users and admins
  - JWT-based authentication
  - Role-based access control

- **Food Management**
  - Pre-populated food database with nutritional information
  - Admin-only food creation and editing
  - User food search and selection
  - Food categorization and verification system

- **Nutrition Tracking**
  - Daily nutrition entry logging
  - Automatic nutritional calculation based on selected foods
  - Daily summaries and goal tracking
  - Date range reports with chart data

- **Admin Dashboard**
  - User management
  - System analytics and statistics
  - Food verification and management
  - Data export capabilities

- **Reports & Analytics**
  - Daily, weekly, and monthly nutrition reports
  - Chart data for visualization
  - Goal progress tracking
  - Comprehensive analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware

## Project Structure

```
server/
├── src/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── admin/         # Admin management routes
│   │   ├── foods/         # Food management routes
│   │   ├── nutrition/     # Nutrition tracking routes
│   │   └── user/          # User management routes
│   ├── config/            # Configuration files
│   ├── loaders/           # Application loaders
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Database models
│   ├── utils/             # Utility functions
│   └── views/             # HTML templates
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── server.js             # Application entry point
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   DB_URL=mongodb://localhost:27017/nutrition_tracker
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES=7d
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   Open your browser and navigate to `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### Authentication Routes (`/api/auth`)

- `POST /login` - User/Admin login
- `POST /register/user` - User registration
- `POST /register/admin` - Admin registration
- `POST /verify` - Verify JWT token

#### User Routes (`/api/users`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /goals` - Set nutrition goals

#### Food Routes (`/api/foods`)

- `GET /search?q=<query>` - Search foods (public)
- `GET /popular` - Get popular foods (public)
- `GET /categories` - Get food categories (public)
- `GET /:id` - Get food by ID (public)
- `GET /` - Get all foods (authenticated)
- `POST /` - Create food (admin only)
- `PUT /:id` - Update food (admin only)
- `DELETE /:id` - Delete food (admin only)
- `PATCH /:id/verify` - Verify food (admin only)

#### Nutrition Routes (`/api/nutrition`)

- `GET /` - Get nutrition entries
- `POST /` - Create nutrition entry
- `GET /:id` - Get nutrition entry by ID
- `PUT /:id` - Update nutrition entry
- `DELETE /:id` - Delete nutrition entry
- `GET /summary/daily` - Get daily summary
- `GET /reports` - Get nutrition reports
- `GET /charts` - Get chart data
- `GET /goals/progress` - Get goals progress

#### Admin Routes (`/api/admin`)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /stats/system` - Get system statistics
- `GET /analytics/users` - Get user analytics
- `GET /analytics/nutrition` - Get nutrition analytics
- `GET /analytics/foods` - Get food analytics
- `GET /export/users` - Export user data

## Database Models

### User Model
- username, email, password, role
- Password hashing and JWT generation methods

### Admin Model
- username, email, password, role, permissions
- Enhanced security features and permission management

### Food Model
- name, brand, category, serving information
- Nutritional data per 100g
- Verification and usage tracking

### Nutrition Entry Model
- User reference, date, food item, quantity
- Calculated nutritional values
- Meal type categorization

### Daily Summary Model
- Aggregated daily nutrition data
- Goal comparison and progress tracking

### Nutrition Goal Model
- User-specific daily nutrition targets
- Profile-based goal calculation support

## Testing

### Manual Testing with Postman

Import the provided Postman collection for comprehensive API testing.

### Test User Accounts

Create test accounts for different roles:

**Admin Account:**
```json
{
  "email": "admin@test.com",
  "password": "admin123456",
  "role": "admin"
}
```

**User Account:**
```json
{
  "email": "user@test.com",
  "password": "user123456",
  "role": "user"
}
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- CORS protection
- Environment variable configuration

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Configure proper JWT secrets
4. Set up reverse proxy (nginx)
5. Enable HTTPS
6. Configure logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Postman Test Collection

### Import Instructions

1. Open Postman
2. Click "Import" button
3. Select "Raw text" tab
4. Copy and paste the JSON collection below
5. Click "Continue" and then "Import"

### Environment Variables

Set up the following environment variables in Postman:

- `baseUrl`: `http://localhost:5000/api`
- `userToken`: (will be set automatically after login)
- `adminToken`: (will be set automatically after admin login)

### Test Collection JSON

```json
{
  "info": {
    "name": "Nutrition Tracker API",
    "description": "Complete API test collection for Nutrition Tracking Application",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "User Registration",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"user@test.com\",\n  \"password\": \"user123456\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register/user",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register", "user"]
            }
          }
        },
        {
          "name": "Admin Registration",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"email\": \"admin@test.com\",\n  \"password\": \"admin123456\",\n  \"role\": \"admin\",\n  \"permissions\": [\"manage_users\", \"manage_foods\", \"view_analytics\"]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register/admin",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register", "admin"]
            }
          }
        },
        {
          "name": "User Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('userToken', response.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@test.com\",\n  \"password\": \"user123456\",\n  \"role\": \"user\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Admin Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('adminToken', response.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@test.com\",\n  \"password\": \"admin123456\",\n  \"role\": \"admin\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Verify Token",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/auth/verify",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "verify"]
            }
          }
        }
      ]
    },
    {
      "name": "Foods",
      "item": [
        {
          "name": "Search Foods (Public)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/foods/search?q=apple",
              "host": ["{{baseUrl}}"],
              "path": ["foods", "search"],
              "query": [
                {
                  "key": "q",
                  "value": "apple"
                }
              ]
            }
          }
        },
        {
          "name": "Get Popular Foods",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/foods/popular?limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["foods", "popular"],
              "query": [
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get Food Categories",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/foods/categories",
              "host": ["{{baseUrl}}"],
              "path": ["foods", "categories"]
            }
          }
        },
        {
          "name": "Create Food (Admin)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Apple\",\n  \"brand\": \"Test Brand\",\n  \"category\": \"fruits\",\n  \"servingSize\": \"100\",\n  \"servingUnit\": \"g\",\n  \"nutritionPer100g\": {\n    \"calories\": 52,\n    \"protein\": 0.3,\n    \"carbs\": 14,\n    \"fat\": 0.2,\n    \"fiber\": 2.4,\n    \"sugar\": 10,\n    \"sodium\": 1\n  },\n  \"description\": \"Fresh red apple\",\n  \"tags\": [\"fresh\", \"fruit\", \"healthy\"]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/foods",
              "host": ["{{baseUrl}}"],
              "path": ["foods"]
            }
          }
        },
        {
          "name": "Get All Foods",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/foods?page=1&limit=20",
              "host": ["{{baseUrl}}"],
              "path": ["foods"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "20"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Nutrition",
      "item": [
        {
          "name": "Create Nutrition Entry",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"date\": \"2024-01-15\",\n  \"foodItem\": \"Apple\",\n  \"quantity\": \"1 medium\",\n  \"calories\": 95,\n  \"protein\": 0.5,\n  \"carbs\": 25,\n  \"fat\": 0.3,\n  \"fiber\": 4,\n  \"sugar\": 19,\n  \"sodium\": 2,\n  \"mealType\": \"snack\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/nutrition",
              "host": ["{{baseUrl}}"],
              "path": ["nutrition"]
            }
          }
        },
        {
          "name": "Get Nutrition Entries",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/nutrition?page=1&limit=20",
              "host": ["{{baseUrl}}"],
              "path": ["nutrition"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "20"
                }
              ]
            }
          }
        },
        {
          "name": "Get Daily Summary",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/nutrition/summary/daily?date=2024-01-15",
              "host": ["{{baseUrl}}"],
              "path": ["nutrition", "summary", "daily"],
              "query": [
                {
                  "key": "date",
                  "value": "2024-01-15"
                }
              ]
            }
          }
        },
        {
          "name": "Get Nutrition Reports",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/nutrition/reports?startDate=2024-01-01&endDate=2024-01-31",
              "host": ["{{baseUrl}}"],
              "path": ["nutrition", "reports"],
              "query": [
                {
                  "key": "startDate",
                  "value": "2024-01-01"
                },
                {
                  "key": "endDate",
                  "value": "2024-01-31"
                }
              ]
            }
          }
        },
        {
          "name": "Get Chart Data",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/nutrition/charts?startDate=2024-01-01&endDate=2024-01-31&chartType=daily",
              "host": ["{{baseUrl}}"],
              "path": ["nutrition", "charts"],
              "query": [
                {
                  "key": "startDate",
                  "value": "2024-01-01"
                },
                {
                  "key": "endDate",
                  "value": "2024-01-31"
                },
                {
                  "key": "chartType",
                  "value": "daily"
                }
              ]
            }
          }
        },
        {
          "name": "Get Goals Progress",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{userToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/nutrition/goals/progress?date=2024-01-15",
              "host": ["{{baseUrl}}"],
              "path": ["nutrition", "goals", "progress"],
              "query": [
                {
                  "key": "date",
                  "value": "2024-01-15"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/admin/users?page=1&limit=20",
              "host": ["{{baseUrl}}"],
              "path": ["admin", "users"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "20"
                }
              ]
            }
          }
        },
        {
          "name": "Get System Stats",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/admin/stats/system",
              "host": ["{{baseUrl}}"],
              "path": ["admin", "stats", "system"]
            }
          }
        },
        {
          "name": "Get User Analytics",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/admin/analytics/users?startDate=2024-01-01&endDate=2024-01-31",
              "host": ["{{baseUrl}}"],
              "path": ["admin", "analytics", "users"],
              "query": [
                {
                  "key": "startDate",
                  "value": "2024-01-01"
                },
                {
                  "key": "endDate",
                  "value": "2024-01-31"
                }
              ]
            }
          }
        },
        {
          "name": "Get Food Analytics",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/admin/analytics/foods",
              "host": ["{{baseUrl}}"],
              "path": ["admin", "analytics", "foods"]
            }
          }
        },
        {
          "name": "Export Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/admin/export/users?format=json",
              "host": ["{{baseUrl}}"],
              "path": ["admin", "export", "users"],
              "query": [
                {
                  "key": "format",
                  "value": "json"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

### Testing Workflow

1. **Setup**: Run "User Registration" and "Admin Registration"
2. **Authentication**: Run "User Login" and "Admin Login" to get tokens
3. **Food Management**: Test food creation (admin) and search (public)
4. **Nutrition Tracking**: Create entries and view summaries/reports
5. **Admin Features**: Test user management and analytics

## Support

For support and questions, please contact the development team or create an issue in the repository.
