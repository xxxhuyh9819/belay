# Belay

#### A React-Flask-SQLite3 project with several key features of a chatting application. 

### **How To Run**

Go to the backend directory and run the application at http://127.0.0.1:5000.

```
flask run
```

Go to the frontend directory and run:

```
yarn install
yarn start
```

so that it runs at  http://localhost:3000



### Application Features

- The frontend is built using React, which manages components with hooks such as useState and useEffect and fetches data from the backend via REST API calls.
- Separated the front end from the back end for better maintainability and flexibility.
- The backend is built using Flask, which creates the REST APIs for the front end and connects to the database.
- SQLite3 is used for data persistence.

### Application Functionalities

- Users can log in or create a new account to access the home page and update their username and password.
- User authentication: Users not logged in have no access to the home page and are instead directed to the login page.
- Users can join, leave, and create a channel.
- Users can post on a channel and reply to a post.
- Automatically refreshes channels and posts.

### **What I learned**

- Enhanced understanding of fetching data via REST API calls.
- Improved understanding of user authentication.
- Practiced the Flask and React frameworks
- Further practiced building web pages with HTML and CSS 

### **TODO**

- Improve the robustness of user authentication with JWT.
- Allow users to recall messages within a certain amount of time.
- ...



