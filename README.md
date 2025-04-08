# Litmark - Backend API

Litmark - Backend API is a robust backend service that provides a set of APIs for managing user, bookmarks and folder. This backend service is designed to be scalable, secure, and easy to integrate with various frontend applications.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Swagger Link](#swagger-link)

## Features

- **RESTful API:** Provides a clean and intuitive interface for interacting with the backend.
- **Authentication:** Secure user authentication using JWT (JSON Web Tokens).
- **Data Management:** CRUD operations for managing users, posts, user stories.
- **Error Handling:** Comprehensive error responses for better debugging.
- **Soft delete:** Retrive deleted data

## Technologies Used
This project is built using the following technologies:

- **Node.js** for the server-side runtime
- **Express.js** for building the API
- **Postgres** for the database
- **Knex** for running query
- **JWT** for authentication
- **Joi** for validation
- **Multer** for image processing
- **Logger** for loggin the errors

## API Endpoints

Here are some of the key API endpoints available in this project:

### Bookmark
- **Get All Bookmarks**
  - `GET /api/bookmark`
  - Description: Get all the bookmarks based on user.

- **Add New Bookmark**
  - `POST /api/bookmark`
  - Description: Add a new bookmark.

- **Get Bookmarks by Folder ID**
  - `GET /api/bookmark/{id}`
  - Description: Get all the bookmarks based on user by folder ID.

- **Update Bookmark Name**
  - `PATCH /api/bookmark/{id}`
  - Description: Update bookmark name based on a certain ID.

- **Delete Bookmark by ID**
  - `DELETE /api/bookmark/{id}`
  - Description: Delete a bookmark by ID.

- **Sort Bookmarks**
  - `GET /api/bookmark/sort`
  - Description: Sort bookmarks by date and alphabet of a folder.

- **Search Bookmarks**
  - `GET /api/bookmark/search`
  - Description: Get all the bookmarks based on user.

---

### Chip

- **Get All Chips**
  - `GET /api/chip`
  - Description: Get all the chips based on user.

- **Add New Chip**
  - `POST /api/chip`
  - Description: Add new chips.

- **Update Chip Name**
  - `PATCH /api/chip/{id}`
  - Description: Update the chip name by ID.

- **Delete Chip by ID**
  - `DELETE /api/chip/{id}`
  - Description: Delete the chip by ID.

---

### Folder

- **Get All Folders**
  - `GET /api/folder`
  - Description: Get all the folders related to the user.

- **Create a New Folder**
  - `POST /api/folder`
  - Description: Create a new folder.

- **Get Folders by Folder ID**
  - `GET /api/folder/{id}`
  - Description: Get all the folders related to the user from a folder ID.

- **Update Folder Name**
  - `PATCH /api/folder/{id}`
  - Description: Update the folder name.

- **Delete Folder by ID**
  - `DELETE /api/folder/{id}`
  - Description: Delete a folder by ID.

- **Sort Folders**
  - `GET /api/folder/sort`
  - Description: Sort folders by date and alphabet of a folder.

---

### RecentBookmark

- **Get Recently Clicked Bookmarks**
  - `GET /api/bookmark/recent`
  - Description: Get all recently clicked bookmarks.

- **Delete Recent Bookmark by ID**
  - `DELETE /api/bookmark/recent/{id}`
  - Description: Delete recent bookmark based on the ID.

- **Update Recent Bookmark Click Date**
  - `PATCH /api/bookmark/recent/{id}`
  - Description: Update the date of when the bookmark was clicked by bookmark ID.

- **Sort Recently Clicked Bookmarks**
  - `GET /api/bookmark/recent/sort`
  - Description: Get all recently clicked bookmarks.

- **Search Recently Clicked Bookmarks**
  - `GET /api/bookmark/recent/search`
  - Description: Search bookmarks based on title.

---

### User

- **Create a New User**
  - `POST /api/user`
  - Description: Create a new user.

- **Get User by ID**
  - `GET /api/user/{id}`
  - Description: Get a user by ID.

- **Update Username and Password**
  - `PATCH /api/user/{id}`
  - Description: Update a username and password by user ID.

- **Delete User by ID**
  - `DELETE /api/user/{id}`
  - Description: Delete a user by ID.
---
### Authentication Endpoints

- **Login**
  - `POST /api/auth/login`

- **Refresh**
  - `POST /api/auth/register`


## Getting Started

To get a local copy of the project up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/abhishek98s/LITMARK_BACKEND2/
   
2. **Navigate to the project directory:**

    ```bash
    cd LITMARK_BACKEND2
    
3. **Install dependencies:**

    ```bash
    npm install

    
4. **Set up environment variables:**
Create a .env file in the root directory and add your configuration variables.
    ```
    GOOGLE_SEARCH_API_KEY=
    GOOGLE_SEARCH_ID=
    POSTGRES_URL=
    PORT=
    CLOUDNARY_NAME=
    CLOUDNARY_KEY=
    CLOUDNARY_SECRET=
    JWT_TOKEN=
    SERVER_PORT=
    NAME=
    ACTIVE_DB=
    DB_NAME=
    DB_POSTGRES_STRING=
    DB_POSTGRES=
    DB_POSTGRES_USER=
    DB_POSTGRES_PASSWORD=
    DB_POSTGRES_NAME=
    DB_POSTGRES_HOST=
    DB_POSTGRES_PORT=
    ```

5. **Run the server:**

    ```bash
    npm run start:dev
    
## Usage
Use tools like Postman or cURL to interact with the API endpoints.
Ensure to include the Authorization header with the JWT token for protected routes.

## Swagger link
Here is the link to swagger documentation for detail of each api endpoints
https://litmark-backend-2.vercel.app/api-docs
