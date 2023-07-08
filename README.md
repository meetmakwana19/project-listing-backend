# A Project Listing App's Backend

Developing NodeJS environment `v18.16.0`

Initialized the app in following manner : 

```bash
npm install express
npm install --save-dev nodemon
touch server.js
touch .gitignore
npm i mongoose
npm i dotenv
npm i eslint 
```

Did setup of eslint with following options 
```bash
npm init @eslint/config
```

```bash
✔ How would you like to use ESLint? · To check syntax, find problems, and enforce code style
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No 
✔ Where does your code run? · node
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · airbnb
✔ What format do you want your config file to be in? · JavaScript
```

---

## API Index 

### Organization

- [x] Create new Organization - POST `/organizations`
- [x] Retrive all Organization - GET `/organizations`
- [x] Retrive specific Organization - GET `/organizations/:id`
- [x] Update specific Organization - PATCH `/organizations/:id`
- [x] Delete specific Organization - DELETE `/organizations/:id`

### Project

- [x] Create new Project - POST `/projects`
- [x] Retrive all Projects - GET `/projects`
- [x] Retrive specific Project - GET `/projects/:id`
- [x] Update specific Project - PATCH `/projects/:id`
- [x] Delete specific Project - DELETE `/projects/:id`


### Developer


- [x] Create new Developer - POST `/developer`
- [x] Retrieve all Developers - GET `/developer`
- [x] Retrieve specific Developer - GET `/developer/:id`
- [x] Update specific Developer - PATCH `/developer/:id`
- [x] Delete specific Developer - DELETE `/developer
/:id`

---

## About Backend Development :

#### Main Project Structure 

1. `server.js` - Entry point for the backend server
2. `/routes` - Folder for all routes
3. `/models` - Folder for all schemas 
4. `/utils` - Folder for extra utility functions
5. `/middleware` - Folder for middlewares
6. `/config` - Folder for any configuration setups

---

#### Other setups :

```bash
npm i express-fileupload
npm i cloudinary
```

---

developer schema :
1. relation "organization" (new/option)...
2. add "projects" - role.

project schema :
1. add "image"
2. add relation with "org"
3. add relation with "developer"(can count how many are there)

ROUTES :

1. Sign in for developer & org

