
# Project Title
  eNetraCare Backend 


## Run Locally

Clone the project

```bash
  git clone https://github.com/Sagar-1103/eNetracare-Backend.git
```

Go to the project directory

```bash
  cd eNetracare-Backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## API Reference

### Authentication
####  Register User
```http
  POST /api/v1/users/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**|
| `password` | `string` | **Required**|

####  Login User
```http
  POST /api/v1/users/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**|
| `password` | `string` | **Required**|

####  Logout User
```http
  POST /api/v1/users/logout
```

####  Refresh Token
```http
  POST /api/v1/users/refresh-token
```

#### Current User

```http
  GET /api/v1/users/current-user
```

####  Change Password
```http
  POST /api/v1/users/change-password
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `oldPassword` | `string` | **Required**|
| `newPassword` | `string` | **Required**|

### News

####  Get All News
```http
  GET /api/v1/news
```

####  Post News
```http
  POST /api/v1/news/post
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**|
| `description` | `string` | **Required**|
| `image` | `file` | **Required**|


####  Update News Cover Image
```http
  PATCH /api/v1/news/update-image/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image` | `file` | **Required**|

####  Update News Content
```http
  PATCH /api/v1/news/update-content/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `newTitle` | `string` | **Required**|
| `newDescription` | `string` | **Required**|

####  Delete News
```http
  DELETE /api/v1/news/delete/${id}
```


## Tech Stack

**Server:** Node, Express

**Database:** MongoDB