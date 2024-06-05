## About project

APi_SHOES_FMY is a backend service made with the **EXPRESS** library for much greater scalability, it connects to a PostgreSQL database. Use the **Sequelize** ORM to make the queries that you consider to the tables of your Database. It handles data and relationships 1 to 1, 1 to N and N to N (N = Many). It offers a variety of endpoints using CRUD methods to process data and some internal processes to improve the quality of the response, all with validations in middlewares using the **JOI** library.

## Functionalities

- Register and login
- View product, user details
- Filter products by category, size and color.
- Create, edit and delete products, categories, sizes, users, order product 

## Technologies

- express
- express validator
- dotenv
- sequelize
- potgres sql

## Routes

In all routes you have the different types of CRUD endpoints [GET, POST, PUT, DELETE]
However, all routes have an Additional **ENDPOINT** (GET /:id) to obtain only a specific piece of data according to its **ID**.

The available routes:

   -  Users -> /api/v1/users

   -  Categories -> /api/v1/categories

   -  Products -> /api/v1/products

   -  Orders -> /api/v1/orders

   -  Tallas -> /api/v1/sizes

To have access for editing or deletion or display to all users it is only with the validation of the administrator user.

##### Clone this repository from GitHub:

  -  git clone https://github.com/ingridCamachoU/api-shoes-fmy.git

#####  Install the project dependencies:

-  npm install

##### To run the application in a local environment, use the following command:

 - npm run dev

## Licencia
This project is under the ISC license.