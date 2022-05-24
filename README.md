# Projet-7
## About The Project
Social Network for a fictional company, Groupomania. This is an exercice from OpenClassrooms.

### Built With
<ul>
  <li>
    <a href="https://reactjs.org/">React.js</a>
  </li>
  <li>
    <a href="https://nodejs.org/en/">Node.js</a>
  </li>
  <li>
    <a href="https://expressjs.com/fr/">Express.js</a>
  </li>
  <li>
    <a href="https://sequelize.org/">Sequelize</a>
  </li>
  <li>
    <a href="https://www.mysql.com/fr/">mysql</a>
  </li>
  <li>
    <a href="https://sass-lang.com/">SCSS</a>
  </li>
 </ul>
 
 ##Getting Started
 To get a local copy up and running follow these simple example steps.
 
### Prerequisites

The software you need and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
  
  * mysql
  ```sh
  npm install mysql
  ```
  
### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/jeanchok/Projet-7.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a mysql data base and write the name in the .env file as DBNAME
   ```
   ```
4. Create a file `.env` in backend (here is an exemple)
   ```sh
   DBUSER = Groupomania
   DBPASSWORD = MyComplexPassword
   DBHOST = localhost
   DBNAME = Groupomania
   TOKEN_KEY = "051d76f6b05cf4168ffb34bd9ff655ec"
   ```
5. Run the backend server - in backend terminal :
   ```sh
   nodemon server
   ```
6. Run the frontend server - in frontend terminal :
   ```sh
   npm start
   ```
