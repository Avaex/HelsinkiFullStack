# Helsinki Full Stack Course Notes

## Part 0

### General Info

- HTTP GET:

  - The server and web browser communicate with each other using the HTTP Protocol
  - The network tab shows how the browser and server communicate
  - When you reload the example application, the console will show two events have happened:
    1. The browser has fetched the contents of the page studies.cs.helsinki.fi/exampleapp from the server
    2. And has downloaded the image kuva.png
  - Because of the img tag, the browser needs to make another HTTP GET request to download this image from the server where the example app is hosted
  - The request for this image was made to the address https://studies.cs.helsinki.fi/exampleapp/kuva.png and its type is HTTP GET
  - Chain of events caused by opening the page:
    1. First, the browser sends an HTTP GET request to the server to fetch the HTML code of the page
    2. The img tag in the HTML prompts the browser to fetch the image kuva.png
    3. The browser renders the HTML page and the image to the screen
  - The HTML page begins to render before the image has been fetched from the server
  - Each HTTP GET request has a type, whether it be HTML, CSS, JS, JSON, etc.
    - For example, since the head section of the HTML contains a script tag, we need to make an HTTP GET request for this Javascript file
  - Immediately after fetching the script tag, the browser begins to execute the code
  - In the notes example page, the Javascript code downloads the JSON data containing the notes, and forms a bulleted list from the notes contents
  - Event handlers and Callback functions:

    ```
    var xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = function() {
      // code that takes care of the server response
    }

    xhttp.open('GET', '/data.json', true)
    xhttp.send()
    ```

    - The request to the server is sent on the last line, but the code to handle the response can be found further up. What's going on?

    ```
    xhttp.onreadystatechange = function () {
    ```

    - On this line, an event handler for event onreadystatechange is defined for the xhttp object doing the request
    - When the state of the object changes, the browser calls the event handler function
    - The function code checks that the readyState equals 4 (which depicts the situation The operation is complete) and that the HTTP status code of the response is 200
    - Essentially, the function to handle the state change for the xhttp object is created before the request is made
    - Once the GET request is made, the xhttp.onreadystatechange function is called because the state changes
    - This function checks to make sure the HTTP request was valid and error free, at which point our web page will update by executing whatever is in this function
    - This is why we define our state change function before the HTTP request

    - Event handlers are called callback functions
    - The application code does not invoke the functions itself, byt the runtime environment, the browser, invokes the function at an appropriate time when the event has occurred

- Document Object Model or DOM

  - We can think of HTML pages as implicit tree structures

    ```
    html
    head
      link
      script
    body
      div
        h1
        div
          ul
            li
            li
            li
        form
          input
          input
    ```

  - This same treelike structure can be seen on the console tab Elements
  - Document Object Model, or DOM, is an Application Programming Interface (API) which enables programmatic modification of the element trees corresponding to web page
  - The following code creates a new node to the variable ul,and adds some child nodes to it:

    ```
    var ul = document.createElement('ul')

    data.forEach(function(note) {
      var li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(document.createTextNode(note.content))
    })
    ```

  - Finally, the tree branch of the ul variable is connected to its proper place in the HTML tree of the whole page:
    ```
    document.getElementById('notes').appendChild(ul)
    ```
  - Manipulating the document-object from console

    - The topmost node of the DOM tree of an HTML document is called the document object
    - We can perform variaous operations on a web page using the DOM API
    - You can access the document object by typing document in the Console tab
    - Let's add a new note to the page from the console:

      1. First, we'll get the list of ntoes from the page. The list is in the first ul element of the page

      ```
      list = document.getElementsByTagName('ul')[0]
      ```

      2. Then create a new li element and add some text content to it

      ```
      newElement = document.createElement('li')
      newElement.textContent = 'Page manipulation from console is easy'
      ```

      3. And add the new li element to the list

      ```
      list.appendChild(newElement)
      ```

    - These changes are not permanent as they are not server side, so refreshing the page will get rid of these changes

- CSS

  - Cascading Style Sheets, or CSS, is used to determine the appearance of web pages
  - The example page has a main.css file with two class selectors
  - A class selector in CSS always starts with a period, and contains the name of the class

  ```
  .container {
    padding: 10px;
    border: 1px solid;
  }

  .notes {
    color: blue;
  }
  ```

  - The CSS rule defines that elements with the container class will be outlined with a one pixel wide border
  - HTML elements can also have an ID, which is what Javascript code uses to select an HTML element

- Review on what happens when the page is opened in the browser:

  1. The browser fetches the HTML code defining the content and structure of the page from the server using an HTTP GET request
  2. Links in the HTML code cause the browser to also fetch the CSS style sheet main.css
  3. The JS code file main.js is also fetched (linked in the script tag)
  4. The browser executes the JS code. The code makes an HTTP GET request to the address https://studies.cs.helsinki.fi/exampleapp/data.json which returns the notes as JSON data
  5. When the data has been fetched, the browser executes an event handler, which renders the notes to the page using the DOM API

- Forms and HTTP Post

  - Let's examine how adding a new note is done
  - The note page contains an HTML Form element
  - When the save button on the form is clicked, the browser will send the user input to the server
  - Submitting the form causes no less than 5 HTTP Requests
  - The first one is the form submit event
  - It is an HTTP POst request to the server address new_note
  - The server responds with HTTP status code 302
    - This is a URL redirect, with which the server asks the broser to do a new HTTP GET request to the address defined in the header's Location - the address notes
  - So, the browser reloads the Notes page and the reload causes three more HTTP requests:
    1. Fetching the style sheet (main.css)
    2. The Javascript code (main.js)
    3. The raw data of the ntoes (data.json)
  - The HTML Form tag has attributes action and method, which define that submitting the form is done as an HTTP POST Request to the address new_note
    ```
    <form action="/new_note" method="POST"></form>
    ```
  - The code responsible for the POST request is quite simple (this code is on the server and not on the JS code fetched from the browser)

    ```
    app.post('/new_note', (req, res) => {
      notes.push({
        content: req.body.note,
        date: new Date(),
      })

      return res.redirect('/notes')
    })
    ```

  - Data is sent as the body of the POST-request
  - The server can access the data by accessing the req.body field of the request object req
  - The server creates a new note object, and adds it to an array called notes

- AJAX

  - The example app follows an early 90s style of web development and "uses Ajax"
  - AJAX (Asynchronous Javascript and XML) is a term introduced in 2005 on the back of advancements in browser technology to describe a new revolutionary approach that enabled the fetching of content to web pages using JavaScript included within the HTML, without the need to rerender the page.
  - Prior to the AJAX era, all web pages worked like the traditional web application we saw earlier in this chapter
  - All data shown on the page was detched with the HTML code generated by the server
  - The notes page uses AJAX to fetch the notes data, while the form submission uses traditional mechanisms of submitting web forms

- Single page app

  - In our example app, the home page works like a traditional web page: all the logic is on the server and the browser only renders the HTML as instructed
  - The Notes page gives some responsibility, generating the HTML for existing notes, to the browser
  - The browser tackles this task by executing the JS code it fetched from the server
  - The code fetches the notes from the server as JSON-data and adds HTML elements for displaying the notes to the page using the DOM API
  - In recent years, the Single Page Application (SPA) style of creating web apps has emerged
  - SPA style websites don't fetch all of their pages separately from the server like our sample application does, but instead cimporise only one HTML page fetched from the server, the contents of which are manipualted with JS that executes in the browser
  - The Notes page of our app bears some resemblance to SPA style apps, but it's not quite there yet
  - Even though the logic for rendering the notes is run on the browser, the page still uses the traditional way of adding new notes
  - The data is sent to the server with form submit, and the server instructs the browser to reload the Notes page with a redirect

- Full Stack Web Development
  - The full stack consists of the frontend (Javascript in the browser), the backend (the server hosting the web page), and the database (NoSQL or SQL database)
  - We do not need to use the same programming language for the frontend and backend, but it makes things easier

## Part 1

### Intro to React

- Setting up a React App

  - The default way to setup a React app is to use the command:
    ```
    npx create-react-app project-name
    ```

- Component

  - The file App.js now defines a React component with the name App
  - The command on the final line of index.js renders its contents into the div-element, defined in the file public/index.html
    ```
    ReactDOM.render(<App />, document.getElementById('root'))
    ```
  - When using React, all content that needs to be rendered is usually defined in React components
  - The code defining the App component:
    ```
    const App = () => (
      <div>
        <p>Hello world</p>
      </div>
    )
    ```
    - This component will be rendered as a div tag, which wraps the p tag containing the text Hello World
    - This component is defined as a Javascript function
    - The following is a function which does not receive any paramters:
      ```
      () => (
        <div>
          <p>Hello world</p>
        </div>
      )
      ```
    - The function is then assigned to a constant variable App
    - There are a few ways to define functions in Javascript, and in this instance we are using arrow functions
  - Arrow functions:
    - Traditional:
      ```
      function bob(a, b) {
        let chuck = 42;
        return a + b + 100;
      }
      ```
    - Arrow function:
      ```
      let bob = (a, b) => {
        let chuck = 42;
        a + b + 100;
      }
      ```
  - We can have dynamic content in our React components by placing Javascript code before the return statement in the component

    ```
    function App() {
      console.log('Hello World!');

      const now = new Date();
      const a = 10;
      const b = 20;

      return (
        <div className="App">
          <p>Hello World, it is {now.toDateString()}</p>
          <p>
            {a} plus {b} is {a+b}
          </p>
        </div>
      );
    }

    export default App;
    ```

  - We insert Javascript code into the HTML using curly braces { }

- JSX

  - Under the hood, JSX returned by React components is compiled into Javascript
  - The compiling is handled by Babel
  - In JSX, every tag needs to be closed

- Multiple Components
  - We can create a component inside the file of another component and then use that component later
  - Example:
    ```
    const Hello = () => {
      return (
        <div>
        <p>Hello world</p>
        </div>
      )
    }
    const App = () => {
      return (
        <div>
          <h1>Greetings</h1>
          <Hello />
        </div>
      )
    }
    ```
  - A component can be used many times
  - A core philosophu of React is composing applications from many specialized, reusable components
  - The root component, App, is the component that contains all other components
- Props

  - It is possible to pass data to components using props

    ```
    const Hello = (props) => {
      return (
        <div>
          <p>Hello {props.name}</p>
        </div>
      )
    }

    const App = () => {
      return (
        <div>
          <h1>Greetings</h1>
          <Hello name="George" />
          <Hello name="Daisy" />
        </div>
      )
    }
    ```

  - There can be an arbitrary number of props
  - React component names must be capitalized
    - This is because when using the component, such as `<Hello />`, React only recognizes custom components by capital letters
  - All React components also need at least one root element
    - For example, in the return statement for all React components, we can wrap our HTML in a div, and not doing so would result in an error
    - However, we can also return an array of components instead if we want, such as replacing the ( ) with [ ] in the return statement for the component to return an array of HTML elements instead of one big one

- Javascript

  - During this course, we have a goal and need to learn a sufficient amount of Javascript in addition to web development
  - Javascript has advanced rapidly in the last few years and this course we use features from the newer versions
  - The official name of the Javascript standard is ECMAScript
  - Browsers do not yet support all of Javascript's newest features
  - Due to this, a lot of code in browsers has been transpiled from a newer version of Javascript to an older, more compatible version
  - Today the most popular way to do transpiling is using Babel
  - Transpilation is automatically configured in React applications created with create-react-app
  - Node.js is a JS runtime environment based on Google's Chrome V8 JS Engine and works practically anywhere, from servers to phones
  - Node.js code is written into files ending in .js that are run by issuing the command
    ```
    $ node name_of_file.js
    ```
  - Variables

    - In Javascript there are a few ways to define variables

      ```
      const x = 1;
      let y = 5;

      console.log(x, y) // 1, 5 are printed
      y += 10;
      console.log(x, y) // 1, 15 are printed
      y = 'sometext';
      console.log(x, y) // 1, sometext are printed
      x = 4; // Causes an error as this is a const so cannot be changed
      ```

    - In Javascript, the type of a variable can be changed
      - The type of y changed from an integer to a string, which is unlike something like Java where variables cannot change types
    - Variables can also be defined using var, but this is outdated and should not be used

  - Arrays

    - JS array usage:

      ```
      const t = [1, -1, 3]

      t.push(5)

      console.log(t.length) // 4 is printed
      console.log(t[1])     // -1 is printed

      t.forEach(value => {
        console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
      })
      ```

    - In this example, the contents of the array are being modified even though the array object t is a const
    - Because the array is an object, the variable always points to the same object
    - However, the contrent of the array changes as new items are added to it
    - One way to iterate through an array is with a forEach as seen in the above code
    - forEach receives a function defined using the arrow syntax as a parameter
    - forEach calls the function for each of the items in the array, always passing the individual item as an argument
    - The function as the argument of forEach may also receive other arguments
    - In Javascript, we can add to an existing array with the .push() method
    - However, it can be better to do the functional programming approach of making data structures immutable, thus we should not add to an array in this way
    - Instead, we can use the t.concat() method which does not add a new item to the old array but returns a new array which, besides containing the items of the old array, also contains the new item

      ```
      const t = [1, -1, 3]

      const t2 = t.concat(5)

      console.log(t)  // [1, -1, 3] is printed
      console.log(t2) // [1, -1, 3, 5] is printed
      ```

    - Using the .map() method for an array creates a new array populated with the results of calling a provided function on every element in the calling array

      ```
      const array1 = [1, 4, 9, 16];

      // pass a function to map
      const map1 = array1.map(x => x * 2);

      console.log(map1);
      // expected output: Array [2, 8, 18, 32]
      ```

    - Based on the old array, the .map() method creates a new array for which the function given as a parameter is used to create the items
    - Map can also transform the array into something completely different
      ```
      const m2 = t.map(value => '<li>' + value + '</li>');
      console.log(m2);
      // [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
      ```
    - Here an array filled with integer values is transformed into an array containing strings of HTML using the map method
    - Destructuring assignment is used to easily assign variables to individuals items in an array

      ```
      const t = [1, 2, 3, 4, 5];

      const [first, second, ...rest] = t;

      console.log(first, second);  // 1, 2 is printed
      console.log(rest);          // [3, 4, 5] is printed
      ```

    - `first` and `second` will receive the first two integers of the array as their values
    - The remaining integers are "collected" into an array of their own which is then assigned to the variable `rest`

  - Objects

    - There are a few ways of defining objects in Javascript
    - One common method is using object literals, which happens by listing its properties within braces

      ```
      const object1 = {
        name: 'Arto Hellas',
        age: 35,
        education: 'PhD',
      }

      const object2 = {
        name: 'Full Stack web application development',
        level: 'intermediate studies',
        size: 5,
      }

      const object3 = {
        name: {
          first: 'Dan',
          last: 'Abramov',
        },
        grades: [2, 3, 5, 3],
        department: 'Stanford University',
      }
      ```

    - The values of the properties can be of any type, like integers, strings, arrays, objects, etc.
    - The properties of an object are referenced by using the "dot" notation, or by using brackets
      ```
      console.log(object1.name)         // Arto Hellas is printed
      const fieldName = 'age'
      console.log(object1[fieldName])    // 35 is printed
      ```
    - You can also add or modify properties on the fly by either using dot notation or brackets
      ```
      object1.address = 'Helsinki';
      object1['secret number'] = 12341;
      ```
    - Note that if you want to add a property to an object that contains a space (such as secret number) you need to use bracket notation rather than dot notation (cannot do object1.secret number as there is a space)
    - Objects can also be created from constructor methods, however Javascript does not have classes in the same sense as other object oriented languages

  - Functions

    - We have already become familiar with arrow functions
    - The complete process to defining an arrow function is as follows:

      ```
      const sum = (p1, p2) => {
        console.log(p1);
        console.log(p2);
        return p1 + p2;
      }

      const result = sum(10, 20);
      console.log(result);
      ```

    - If there is a single parameter, we exclude the parentheses from the definition:
      ```
      const square = p => {
        console.log(p);
        return p * p;
      }
      ```
    - If the function only contains a single expression then the curly braces aren't needed
      ```
      const square = p => p * p;
      ```
    - This form is particularly handy when manipulating array, such as using the map method
      ```
      const t = [1, 2, 3,];
      const tSquared = t.map(p => p * p);
      ```
    - Two ways of defining a function:

      - First way is giving a name in a function declaration:

        ```
        function product(a, b) {
          return a * b
        }

        const result = product(2, 6);
        ```

      - The other way is to define the function using a function expression
      - In this case we do not need to give the function a name but instead put the function into a variable

        ```
        const average = function(a, b) {
          return (a + b) / 2;
        }

        const result = average(2, 5); // result is 3.5
        ```

  - Object methods and "this"

    - Due to the fact that this course is using the new version of React containing Hooks, we have no need to define objects with methods
    - However, this information is good to know for understanding older React code
    - Arrow functions and functions defined using the `function` keyword vary substantially when it comes to how they behave with respect to the keytword this, which refers to the object itself
    - We can assign methods to an object by defining properties that are functions:

      ```
      const arto = {
        name: 'Arto Hellas',
        age: 35,
        education: 'PhD',
        greet: function() {
          console.log('hello, my name is ' + this.name)
        },
      }

      arto.greet()  // "hello, my name is Arto Hellas" gets printed
      ```

    - Methods can be assigned to objects even after the creation of the object

      ```
      const arto = {
        name: 'Arto Hellas',
        age: 35,
        education: 'PhD',
        greet: function() {
          console.log('hello, my name is ' + this.name)
        },
      }

      arto.growOlder = function() {
        this.age += 1
      }
      console.log(arto.age)   // 35 is printed
      arto.growOlder()
      console.log(arto.age)   // 36 is printed
      ```

  - Classes

    - There is no class mechanism like the ones in other object oriented languages
    - There are, however, features in JS which make simulating OOP classes possible

      ```
      class Person {
      constructor(name, age) {
        this.name = name
        this.age = age
      }
      greet() {
        console.log('hello, my name is ' + this.name)
      }
      }

      const adam = new Person('Adam Ondra', 35)
      adam.greet()

      const janja = new Person('Janja Garnbret', 22)
      janja.greet()
      ```

    - We created a custom Person object in the above code
    - As far as JS is concerned, each Person is simply of Object type since JS essentioaly only defines types for Boolean, Null, Undefined, Number, String, Symbol, BigInt, and Object
    - This class syntax is not needed anymore now that React Hooks have been introduced and are widely used

- Component state, event handlers

  ```
  const Hello = (props) => {
    return (
      <div>
        <p>
          Hello {props.name}, you are {props.age} years old
        </p>
      </div>
    )
  }

  const App = () => {
    const name = 'Peter'
    const age = 10

    return (
      <div>
        <h1>Greetings</h1>
        <Hello name="Maya" age={26 + 10} />
        <Hello name={name} age={age} />
      </div>
    )
  }
  ```

  - Let's expand our Hello component so that it guesses the year of birth of the person being greeted

    ```
    const Hello = (props) => {
    const bornYear = () => {
      const yearNow = new Date().getFullYear()
      return yearNow - props.age
    }

      return (
        <div>
          <p>
            Hello {props.name}, you are {props.age} years old
          </p>
          <p>So you were probably born in {bornYear()}</p>
        </div>
      )
    }
    ```

  - The logic for guessing the year of birth is separated into a function of its own that is called when the component is rendered
    -The person's age does not have to be passed as a parameter to the function since it can directly access all props that are passed into the component (the scope of the props is available for the bornYear function)
  - In Java we typically don't define functions inside one another, but in JS this is pretty common

- Destructuring

  - Destructuring allows us to destructure values from objects and arrays upon assignment
    ```
    props = {
      name: 'Artos Hellas',
      age: 35,
    }
    ```
  - Since props is an object, we can streamline our component by assigning the values of the properties directly into two variables `name` and `age` which we can then use in our code

    ```
    const Hello = (props) => {
      const name = props.name
      const age = props.age
      const bornYear = () => new Date().getFullYear() - age

      return (
        <div>
          <p>Hello {name}, you are {age} years old</p>
          <p>So you were probably born in {bornYear()}</p>
        </div>
      )
    }
    ```

  - To recap, the two function definitions below are equivalent:

    ```
    const bornYear = () => new Date().getFullYear() - age

    const bornYear = () => {
      return new Date().getFullYear() - age
    }
    ```

  - Destructuring makes the assignment of variables even easier, since we can use it to extract and gather the values of an object's properties into separate variables

    ```
    const Hello = (props) => {
      const { name, age } = props
      const bornYear = () => new Date().getFullYear() - age

      return (
        <div>
          <p>Hello {name}, you are {age} years old</p>
          <p>So you were probably born in {bornYear()}</p>
        </div>
      )
    }

    props = {
      name: 'Arto Hellas',
      age: 35,
    }
    ```

  - The expression `const { name, age } = props` assigns the values 'Artos Hellas' to `name` and 34 to `age`
  - We can take destructuring a step further:

    ```
    const Hello = ({ name, age }) => {
      const bornYear = () => new Date().getFullYear() - age

      return (
        <div>
          <p>
            Hello {name}, you are {age} years old
          </p>
          <p>So you were probably born in {bornYear()}</p>
        </div>
      )
    }
    ```

  - The props that are passed to the component are now directly destructured into the variables name and age
  - This means that instead of assigning the entire props object into a variable called props and then assigning its properties into the variables name and age
  - Essentially we can do the second destructuring shown below rather than the first

    ```
    const Hello = (props) => {
      const { name, age } = props

    const Hello = ({ name, age})
    ```

  - We are essentially getting to name the properties passed in the props object

- Page rerendering

  - So far all our applications have been such that their appearance remains the same after the initial rendering
  - What if we want to create a counter where the value increased as a function of time or at the click of a button
  - Let's start with the following code:

    - App.js

    ```
    import React from 'react'

    const App = (props) => {
      const {counter} = props
      return (
        <div>{counter}</div>
      )
    }

    export default App
    ```

    - index.js

    ```
    import ReactDOM from 'react-dom'
    import App from './App'

    let counter = 1

    ReactDOM.render(
      <App counter={counter} />,
      document.getElementById('root')
    )
    ```

  - The App component is given the value of the counter via the counter prop
  - This component renders the value to the screen
  - What happens when the value of counter changes?
  - We can call the function `refresh()` to rerender the App component every time we update the counter, but this is not the correct way to rerender the component

- Stateful component

  - All of our components so far have been simple in the sense they have not contained any state that could change during the lifetime of the component
  - We can use the state hook
  - We can change App.js to the following:

    ```
    import React, { useState } from 'react'
    const App = () => {
      const [ counter, setCounter ] = useState(0)
      setTimeout(
        () => setCounter(counter + 1),
        1000
      )
      return (
        <div>{counter}</div>
      )
    }

    export default App
    ```

  - The function call adds state to the component and renders it initialized with the value of zero (useState(0) line)
  - The function returns an array that contains two items
  - We assign these array items to the variables `counter` and `setCounter` by using the destructuring syntax
  - The `counter` variable has an initial value of 0 as passed in by `useState(0)`
  - The function `setCounter` will modify the state
  - Whenever `setCounter` is called, React automatically rerenders the component
  - This means that if we want to update counter, we simply call setCounter and React will rerender out component, showing the correct counter value
  - Whenever a component is rerendered, the function body of the component is reexecuted

- Event handling

  - Let's change our application so that increasing the counter happens when a user clicks a button, implemented in a button element

    ```
    const App = () => {
      const [ counter, setCounter ] = useState(0)

      const handleClick = () => {
        console.log('clicked')
      }

      return (
        <div>
          <div>{counter}</div>
          <button onClick={handleClick}>
            plus
          </button>
        </div>
      )
    }
    ```

  - We set the value of the button's onClick attribute to be a reference to the handleClick function defined in the code
  - Now every click of the plus button causes the handleClick function to be called, meaning that every click event will log a clicked message to the console
  - We can also define the behavior for the onClick event handler directly in the value assignment
    ```
    ...
    <button onClick={() => console.log('clicked')}>
    ```
  - And we can also change the event handler to the following to get our desired counter update
    ```
    <button onClick={() => setCounter(counter + 1)}>
      plus
    </button>
    ```
  - Here we have achieved the desired goal of updating the counter variable and rerendering the component whenever the counter variable changes
  - We can also add a button for resetting the counter
    ```
    <button onClick={() => setCounter(0)}>
      zero
    </button>
    ```

- Event handler is a function

  - We define the event handlers for our buttons where we declare their onClick attributes
    ```
    <button onClick={() => setCounter(counter + 1)}>
      plus
    </button>
    ```
  - We cannot do the following:
    ```
    <button onClick={setCounter(counter + 1)}>
      plus
    </button>
    ```
  - An event handler is supposed to be either a function or a function reference, and writing setCounter(counter+1) this is only a function call, not a function
  - Usually, defining event handlers within JSX is not a good idea but it is fine here with simple components
  - The following code is valid:

    ```
    const App = () => {
      const [ counter, setCounter ] = useState(0)

      const increaseByOne = () => setCounter(counter + 1)    const setToZero = () => setCounter(0)
      return (
        <div>
          <div>{counter}</div>
          <button onClick={increaseByOne}>        plus
          </button>
          <button onClick={setToZero}>        zero
          </button>
        </div>
      )
    }
    ```

- Passing state to child components

  - It's recommended to write React components that are small and reusable across the application and even multiple projects
  - Let's refactor our app into three smaller components; one component for displaying the counter, two for the buttons
  - Let's first implement a Display component that is responsible for displaying the counter
  - Our best practice in React is to lift the state up in the component hierarchy
  - So let's place the application's state in the App component and pass it down to the Display component through props
    ```
    const Display = (props) => {
      return (
        <div>{props.counter}</div>
      )
    }
    ```
  - Using the component is straightforward, as we only need to pass the state of the counter to it

    ```
    const App = () => {
      const [ counter, setCounter ] = useState(0)

      const increaseByOne = () => setCounter(counter + 1)
      const setToZero = () => setCounter(0)

      return (
        <div>
          <Display counter={counter}/>      <button onClick={increaseByOne}>
            plus
          </button>
          <button onClick={setToZero}>
            zero
          </button>
        </div>
      )
    }
    ```

  - Everything still works, when the buttons are clicked and the App gets rerendered, all of its children including the Display component are also rerendered
  - Next let's make a Button component for all buttons in our application
  - We have to pass the event handler and title of the button through the component's props
    ```
    const Button = (props) => {
      return (
        <button onClick={props.onClick}>
          {props.text}
        </button>
      )
    }
    ```
  - Our App component now looks like this:

    ```
    const App = () => {
      const [ counter, setCounter ] = useState(0)

      const increaseByOne = () => setCounter(counter + 1)
      const decreaseByOne = () => setCounter(counter - 1)
      const setToZero = () => setCounter(0)

      return (
        <div>
          <Display counter={counter}/>
          <Button
            onClick={increaseByOne}
            text='plus'
          />
          <Button
            onClick={setToZero}
            text='zero'
          />
          <Button
            onClick={decreaseByOne}
            text='minus'
          />
        </div>
      )
    }
    ```

  - Since we now have an easily reusable Button component, we've also implemented functionality into our app by adding a button that can decrement the counter
  - The event handler is passed to the Button component through the onClick prop
  - Basically, to pass state to a child component we just pass in a function that at some point will call the setState function

- Changes in state cause rerendering
  - Let's go over the main principles of how an application works once more:
    - When the app starts, the code in `App` is executed
    - This code uses a useState hook to create the application state, setting an initial value of the variable `counter`
    - This component contains the Display component, which displays the counter's value, 0 - and three button components
    - The buttons all have event handlers, which are used to change the state of the counter
    - When one of the buttons is clicked, the event handler is executed
    - The event handler changes the state of the App component with the setCounter function
    - Calling a function which changes the state causes the component to rerender
    - So, if a user clicks the plus button, the button's event handler chang3es the value of counter to 1, and the App component is rerendered
    - This causes the App component's subcomponents (Display, Button) to also rerender
    - Display receives the new counter value of 1 through props
- Refactoring the components
  - The Display component, which displays the value of the counter, is as follows:
    ```
    const Display = (props) => {
      return (
        <div>{props.counter}</div>
      )
    }
    ```
  - The component only uses the counter field of its props
  - This means we can simplify the component with destructuring
    ```
    const Display = ({ counter }) => {
      return (
        <div>{counter}</div>
      )
    }
    ```
  - We can also make it even more simple
    ```
    const Display = ({ counter }) => <div>{counter}</div>
    ```
  - We can simplify the Button component as well
    ```
    const Button = (props) => {
      return (
        <button onClick={props.onClick}>
          {props.text}
        </button>
      )
    }
    ```
  - We can use destructuring to get only the fields we want from props
    ```
    const Button = ({ onClick, text }) => (
      <button onClick={onClick}>
        {text}
      </button>
    )
    ```
- Complex State

  - In our previous example the application state was simple as it was comprised of a single integer
  - What if our application requires a more complex state?
  - In most cases the easiest and best way to accompish this is by using the useState function multiple times to create separate "pieces" of state
  - In the following code we create two pieces of state for the application named left and right that both get the initial value of 0

    ```
    const App = () => {
      const [left, setLeft] = useState(0)
      const [right, setRight] = useState(0)

      return (
        <div>
          {left}
          <button onClick={() => setLeft(left + 1)}>
            left
          </button>
          <button onClick={() => setRight(right + 1)}>
            right
          </button>
          {right}
        </div>
      )
    }
    ```

  - The component gets access to the functions setLeft and setRight that it can use to update the two pieces of state
  - The component's state or a piece of its state can be of any type (doesn't just have to be an integer like in our counter example)
  - Essentially, we could do the same code by combining the two states if we wanted to:

    ```
    const App = () => {
      const [clicks, setClicks] = useState({
        left: 0, right: 0
      })

      const handleLeftClick = () => {
        const newClicks = {
          left: clicks.left + 1,
          right: clicks.right
        }
        setClicks(newClicks)
      }

      const handleRightClick = () => {
        const newClicks = {
          left: clicks.left,
          right: clicks.right + 1
        }
        setClicks(newClicks)
      }

      return (
        <div>
          {clicks.left}
          <button onClick={handleLeftClick}>left</button>
          <button onClick={handleRightClick}>right</button>
          {clicks.right}
        </div>
      )
    }
    ```

  - Now the component only has a single piece of state and the event handlers have to take care of chaning the entire application state (which is probably not a good idea)
  - When the left button is clicked, the following function is called:
    ```
    const handleLeftClick = () => {
      const newClicks = {
        left: clicks.left + 1,
        right: clicks.right
      }
      setClicks(newClicks)
    }
    ```
  - The following is set as the new state of the application:
    ```
    {
      left: clicks.left + 1,
      right: clicks.right
    }
    ```
  - We can define the new state object a bit more neatly using the object spread syntax

    ```
    const handleLeftClick = () => {
      const newClicks = {
        ...clicks,
        left: clicks.left + 1
      }
      setClicks(newClicks)
    }

    const handleRightClick = () => {
      const newClicks = {
        ...clicks,
        right: clicks.right + 1
      }
      setClicks(newClicks)
    }
    ```

  - In practice, { ...click } creates a new object that has copies of all the properties of the clicks object
  - When we specify a particular property - e.g. right in { ...clicks, right: 1 }, the value of `right` property in the new object will be 1
  - Essentially, the spread syntax grabs the rest of the object or array without you needing to type it all out
  - We can simplify the functions even further with the following:

    ```
    const handleLeftClick = () =>
      setClicks({ ...clicks, left: clicks.left + 1 })

    const handleRightClick = () =>
      setClicks({ ...clicks, right: clicks.right + 1 })
    ```

  - We cannot do
    ```
    const handleLeftClick = () => {
      clicks.left++
      setClicks(clicks)
    }
    ```
  - as React does not allow us to mutate state directly
  - Changing state always has to be done by setting the state to a new object
  - If properties from the previous state object are not changed, they need to simply be copied, which is done by copying those properties into a new object, and setting that as the new state
  - Storing all the state for the entire application is also a bad idea as we will be recopying many state properties that will not change for a specific state change (such as needing to recopy the right values when we click the left button)

- Handling arrays

  - Let's add a piece of state to our application containing an array `allClicks` that remembers every click that has occurred in the application

    ```
    const App = () => {
      const [left, setLeft] = useState(0)
      const [right, setRight] = useState(0)
      const [allClicks, setAll] = useState([])

      const handleLeftClick = () => {
        setAll(allClicks.concat('L'))
        setLeft(left + 1)
      }
      const handleRightClick = () => {
        setAll(allClicks.concat('R'))
        setRight(right + 1)
      }

      return (
        <div>
          {left}
          <button onClick={handleLeftClick}>left</button>
          <button onClick={handleRightClick}>right</button>
          {right}
          <p>{allClicks.join(' ')}</p>
        </div>
      )
    }
    ```

  - Every click is stored into a separate piece of state called allClicks that is initialized as an empty array
  - When the left button is clicked, an `L` char is appended to the array, and when the right button is clicked an 'R' char is appended
  - In JS, we can add items to an array with the .push() method
  - However, we should not do this as modifying state directly is still not optimal

- Conditional Rendering

  - Let's modify our application so that the rendering of the clicking history is handled by a new History component

    ```
    const History = (props) => {
      if (props.allClicks.length === 0) {
        return (
          <div>
            the app is used by pressing the buttons
          </div>
        )
      }
      return (
        <div>
          button press history: {props.allClicks.join(' ')}
        </div>
      )
    }
    const App = () => {
      // ...

      return (
        <div>
          {left}
          <button onClick={handleLeftClick}>left</button>
          <button onClick={handleRightClick}>right</button>
          {right}
          <History allClicks={allClicks} />    </div>
      )
    }
    ```

  - Now the behavior of the component depends on whether or not any buttons have been clicked
  - If not, meaning the allClicks array is empty, the component renders a div element with some instructions instead (the app is used by pressing the buttons)
  - In all other cases, the component renders the clicking history (props.allClicks.join(' '))
  - This History React component renders two different elements depending on the state of the application
  - This is called conditional rendering
  - Let's refactor the Button component

    ```
    const History = (props) => {
      if (props.allClicks.length === 0) {
        return (
          <div>
            the app is used by pressing the buttons
          </div>
        )
      }

      return (
        <div>
          button press history: {props.allClicks.join(' ')}
        </div>
      )
    }

    const Button = ({ handleClick, text }) => (
      <button onClick={handleClick}>
        {text}
      </button>)

    const App = () => {
      const [left, setLeft] = useState(0)
      const [right, setRight] = useState(0)
      const [allClicks, setAll] = useState([])

      const handleLeftClick = () => {
        setAll(allClicks.concat('L'))
        setLeft(left + 1)
      }

      const handleRightClick = () => {
        setAll(allClicks.concat('R'))
        setRight(right + 1)
      }

      return (
        <div>
          {left}
          <Button handleClick={handleLeftClick} text='left' />
          <Button handleClick={handleRightClick} text='right' />
          {right}
          <History allClicks={allClicks} />
        </div>
      )
    }
    ```

- Old React
  - In this course we use the state hook to add state to our React components
  - Before the addition of Hooks there was no way to add state to functional components
  - Components that required state needed to be class components, but that is obviously no longer the case
- Debugging React applications

  - Reminder of the first rule of web development:
    - Keep the browser's console open at all times
  - Keep both your code (VS Code) and the web page + console open together at the same time all the time
  - Whenever an error occurs in the console or your application, don't write more code but fix the code immediately
  - If a component is not working as intended, it is smart to print the component's variables to console to see if those are working correctly
  - When printing an object to console in React, do not combine things like in Java
  - Do not do this:
    ```
    console.log('props value is ' + props);
    ```
  - But instead do this:

    ```
    console.log('props valu is', props);
    ```

  - Combine multiple elements in the console with a comma rather than a plus sign
  - If not React will simply console log `props value is [Object object]` which is not useful
  - Can also debug using the debugger by writing the command `debugger` anywhere in your code
  - Once the `debugger` command is executed, the debugger in Chrome/Firefox will pause execution at that line
  - Once you are paused, you can go to the console and inspect the current state of variables
  - The debugger also allows us to execute our code line by line by adding breakpoints in the Sources tab
  - Inspecting values of a component's variables is done in the Scope section
  - Using developer tools also adds a new Components tab to the console which allows us to see more info about our components

- Rules of Hooks

  - useState (and useEffect) cannot be called from inside a loop, conditional expression, or any place that is not a function defining a component
  - This must be done to ensure hooks are always called in the same order

- Event handling revisited

  - Let's assume we're developing a simple application with the following component App:

    ```
    const App = () => {
      const [value, setValue] = useState(10)

      return (
        <div>
          {value}
          <button>reset to zero</button>
        </div>
      )
    }
    ```

  - We want the clicking of the button to reset the state stored in the `value` variable
  - In order to make the button react to a click event, we need to add an event handler to it
  - Event handlers must always be a function or a reference to a function
  - For example, if we did `<button onClick="crap...">button</button>` this would result in an error as our onClick function is not a function but just a string
  - Essentially, whenever you have a button that you want to add an event handler to, you should just create a new function with all the logic for what you want to do and just call that function
  - So change the above example to `<button onClick={ handleButtonClick }>button</button>` where handleButtonClick is a function that does something (console logs or changes state or something)
  - Can also define the event handler function right in the same line of code like so: `<button onClick={() => console.log('The button was clicked!')}>button</button>`
  - Looking at the above code (App) we can make the button reset value by doing the following: `<button onClick={() => setValue(0)}>button</button>`
  - The event handler is now the function `() => setValue(0)` which is valid for an event handler
  - However, defining event handlers directly in the button like this is probably not ideal (imagine we need to add more lines to the function but can't since defining it in the button means the function can only be 1 line)

    ```
    const App = () => {
      const [value, setValue] = useState(10)

      const handleClick = () => {
        console.log('clicked the button')
        setValue(0)
      }

      return (
        <div>
          {value}
          <button onClick={handleClick}>button</button>
        </div>
      )
    }
    ```

  - Defining the event handler with a separate function, like this, is your best bet

- Function that returns a function

  - Another way to define an event handler is to use a function that returns a function
  - Doing this allows us to do some complex things with props, such as the following:

    ```
    const App = () => {
      const [value, setValue] = useState(10)

      const hello = (who) => {
        const handler = () => {
          console.log('hello', who)
        }
      return handler
      }

      return (
        <div>
          {value}
          <button onClick={hello('world')}>button</button>
          <button onClick={hello('react')}>button</button>
          <button onClick={hello('function')}>button</button>
        </div>
      )
    }
    ```

  - Doing event handlers in this way allows for customized event handlers depending on the parameter passed in
  - This can then be further simplified into the following code:
    ```
    const hello = (who) => () => {
      console.log('hello', who)
    }
    ```
  - However, doing this is not necessary and the following is just as valid

    ```
    const App = () => {
      const [value, setValue] = useState(10)

      const setToValue = (newValue) => {
        setValue(newValue)
      }

      return (
        <div>
          {value}
          <button onClick={() => setToValue(1000)}>
            thousand
          </button>
          <button onClick={() => setToValue(0)}>
            reset
          </button>
          <button onClick={() => setToValue(value + 1)}>
            increment
          </button>
        </div>
      )
    }
    ```

- Passing Event Handlers to Child Components
  - Let's extract the button into its own component
    ```
    const Button = (props) => (
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    )
    ```
  - The event handler gets the event handler function from the `handleClick` prop, and the text of the button from the `text` prop
- Do Not Define Components Within Components

  - Let's start displaying the value of the application into its own Display component
  - Let's do this by defining the Display component within the App component

    ```
    // This is the right place to define a component
    const Button = (props) => (
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    )

    const App = () => {
      const [value, setValue] = useState(10)

      const setToValue = newValue => {
        setValue(newValue)
      }

      // Do not define components inside another component
      const Display = props => <div>{props.value}</div>
      return (
        <div>
          <Display value={value} />
          <Button handleClick={() => setToValue(1000)} text="thousand" />
          <Button handleClick={() => setToValue(0)} text="reset" />
          <Button handleClick={() => setToValue(value + 1)} text="increment" />
        </div>
      )
    }
    ```

  - The application appears to work but DO NOT IMPLEMENT COMPONENTS LIKE THIS
  - This does not provide any benefits and leads to many other problems
  - React treats a component defined inside another component as a new component in every render which makes it impossible for React to optimize the component

## Part 2

- Rendering a collection, modules

  - Experienced programmers use console.log way more than inexperienced programmers
  - When something goes wrong, don't try to guess what is wrong. Use console.log to try and find the problem
  - When using console.log use commas instead of + signs which allows the actual objects to be printed instead of [Object object]
  - VS Code has a snippet for console.log by typing log

  - From here we will be using functional programming methods of the JS array, such as find, filter, and map - all the time
  - For event handlers, we want to pass in the event handler function to the child component to then be called in the component
  - When using the .map function with list items (`<li>`), we need each element in the array to have a unique key

- Map function
  - The map function creates a new array based on manipulating a current array
    ```
    const result = notes.map(note => note.id)
    console.log(result)
    ```
  - [1, 2, 3] will be printed to console after this .map call
  - map creates a new array, elements of which have been created from elements of the original array by mapping:
    using the function given as a parameter to the map method
  - The function is note=>note.id
  - This is just an arrow function written in compact form
    ```
    (note) => {
      return note.id
    }
    ```
  - The function get a note object as a parameter, and returns the value of its id field
  - Changing the command to:
    ```
    const result = notes.map(note => note.content)
    ```
  - results in the array containing the contents of the notes
- Anti-pattern: Array indexes as keys

  - We could make the console error message of each key in an li needing a unique id by using the array indexes as keys
  - Such as using `notes.map((note, i) => ...) `
  - However, DO NOT DO THIS
  - This is because elements can move in the array, making the array index not a permanent id for an array element
  - Can use nanoid to create unique id's as needed

    ```
    import { nanoid } from 'nanoid';

    const createNewTodo = (text) => ({
      completed: false,
      id: nanoid(),
      text
    }
    ```

  - The only time you should use an index as a key is when the following three conditions are met:
    1. the list and items are static - they are not computed and do not change
    2. the items in the list have no ids already
    3. the list is never reordered or filtered

- Refactoring Modules

  - A whole React application could be written in a single file, but we don't usually do this
  - React components usually have their own folder, called components folder, inside the src folder
  - The file is named after the React component for which the file is used
  - When importing components, these components will usually not be in the same folder as the App component
  - So `./components/Note`, the period in the beginning refers to the current directory, so the module's location is
    a file called Note.js in the components sub-directory of the current directory
  - The .js file extension can be omitted

- When the application breaks

  - When a "React explosion" occurs (a bunch of errors on the console and web page) your best bet is to console.log and try
    to figure out what is broken
  - Quite often the problem is the props are expected to be of a different type or called with a different name
  - This causes destructuring to fail, causing a bunch of errors
  - To potentially solve this, console logging the props before using them could be useful
  - If this does not work, then continuing to bug hunt with console.log is your best bet

- Forms

  - We want to allow the user to add new notes to our application
  - In order to get our page to update when new notes are added, it's best to store the notes in the App component's state
  - If we want to start with an empty list of notes, we would set the intial state in the useState like so: `const [notes, setNotes] = useState([])`
  - We can use an HTML form component that will be used to add new notes
  - The event parameter is the event that triggers the call to the event handler function
  - `event.preventDefault()` prevents the default action of submitting a form which would include reloading the page, which we don't want
  - The target of the event is stored in `event.target`
  - We want to get the info contained in the `event.input` element

- Controlled components

  - There are many ways to accomplish adding a new note
  - First method to add a new note is through a controlled component
  - If we add a value to an input HTML element, we also need to add an event handler to make sure the input is not read only (if there is no
    event handler the input HTML element will be read only)
  - For an input HTML element, the event handler is called every time a change occurs in the input
  - So typing a single letter in the input calls the event handler
  - The `target` propertry of the event object corresponds to the controlled `input` element
  - The `event.target.value` is the actual input value in the element (so the text for the note we will be adding)
  - We do not need to call `event.preventDefault()` like we did in onSubmit because there is no default action on an input change, unlike a default on
    a form submit
  - We can use setState to add a new note through the `.concat()` method, which works because this method creates a new array with the new element added
  - This is the reason we do not need to create a new copy of the notes array, add to that copy, then set the copy as the new state

- Filtering Display Elements

  - `const notesToShow = showAll ? notes : notes.filter(note => note.important === true)` uses the conditional operator
  - `const result = condition ? val1 : val2`
  - The `result` variable will be set to the value of `val1` if `condition` is true
  - If `condition` is false, the `result` variable will be set to the value of `val2`
  - Essentially, this is an if statement with the first option executing if the condition is true, and the second option executing if the condition is false
  - If the value of `showAll` is true, then `notesToShow` is set to `notes`
  - If the value of `showAll` is false, then `notesToShow` is set to `notes.filter(note => notes.important === true)` which is all notes with important property = true
  - In Javascript, you should always use === rather than == in comparisons
  - .map() is used for doing an action on every element in an array, while .filter() is used to select certain elements in an array
  - When comparing Javascript objects, === checks to see if the objects occupy the same space in memory aka the exact same object, not if they are equal
  - One easy solution to this is to use JSON.stringify for comparison
  - `JSON.stringify(a) === JSON.stringify(b)`

- Getting data from the server

  - We will be using a tool called JSON Server to act as our server
  - From now on we will be saving new notes to the server rather than temporarily in the browser
  - The React code will fetch the notes from the server and render them in the browser
  - When a new note is added it is sent to the server to make the new note persist in "memory"
  - In part0 we fetched data from the server using XMLHttpRequests, aka HTTP requests using an XHR object
  - The use of XHR is no longer recommended, and browsers already widely support the fetch method
  - The fetch method is based on promises, instead of the event-driven model used by XHR
  - In part0, data was fetched using XHR in the following:

    ```
    const xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText)
        // handle the response that is saved in variable data
      }
    }

    xhttp.open('GET', '/data.json', true)
    xhttp.send()
    ```

  - Right at the beginning we register an event handler to the xhttp object representing the HTTP request, which will
    be called by the Javascript runtime whenever the state of the xhttp object changes
  - If the change in state means that the response to the request has arrived, then the data is handled accordingly
  - It is worth noting that the code in the event handler is defined before the request is sent to the server
  - Despite this, the code within the event handler will be executed at a later point in time
  - Therefore, the code does not execute synchronously "from top to bottom" but does so asynchronously
  - Javascript calls the event handler that was registered for the request at some point in time
  - A synchronous way of making requests common in Java would be the following (not actual Java code):

    ```
    HTTPRequest request = new HTTPRequest();

    String url = "https://fullstack-exampleapp.herokuapp.com/data.json";
    List<Note> notes = request.get(url);

    notes.forEach(m => {
      System.out.println(m.content);
    });
    ```

  - In Java the code executes line by line and stops to wait for the HTTP request, which means waiting for the command `request.get(...)` to finish
  - The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in a desired manner
  - On the other hand, Javascript engines, or runtime environments, follow the asynchronous model
  - This requires all IO-operations to be executed as non-blocking
  - This means that the code execution continues immediately after calling an IO function, wiuthout waiting for it to return
  - When an asynchronous operation is completed, or more specifically at some point after its completion, the JS engine calls the event handlers
    registered to the operation
  - Javascript engines are single-threaded, so they cannot execute code in parallel
  - As a result, it is a requirement in practice to use a non-blocking model for executing IO operations
  - Otherwise the browser would freeze during the fetching of data from a server (fetching data is an IO operation)
  - This also means that some JS code execution takes up a lot of time in which the browser will get stuck for the duration of the execution
  - If we added the following code to the top of our application, everything would work fine for 5 seconds but then we would be stuck during the
    duration of the execution of the function
    ```
    setTimeout(() => {
      console.log('loop..')
      let i = 0
      while (i < 50000000000) {
        i++
      }
      console.log('end')
    }, 5000)
    ```
  - Even the browser tab cannot be closed while this function is executing
  - For the browser to remain responsive, i.e. to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that
    no single computation can take too long
  - In today's browsers it is possible to run parallelized code with the help of web workers
  - However, the event loop is still single-threaded

- npm

  - We will be using axios rather than fetch to get the data from the server
  - axios is similar to fetch but it is more pleasant to use
  - Nowadays nearly all Javascript projects are defined using the node package manager, aka npm
  - The projects created using npm create-react-app also follow the npm format
  - A clear indicator a project uses npm is the package.json file located at the root of the project
  - The dependencies part of this file is the most important to us as it defines what dependencies, aka erxternal libraries, a project has
  - npm commands should always be run in the project root directory, which is where the package.json file is

- Axios and promises

  - Note when index.js changes you need to refresh the page as well
  - Axios' method `get` returns a promise
  - A promise is an object representing the eventual completeion or failure of an asynchronous operation
  - In other words, a promise is an object that represents an asynchronous operation
  - A promise can have three distinct states:
    1. The promise is pending: It means that the final value (one of the following two) is not yet available
    2. The promise is fulfilled: It means that the operation has completed and the final value is available, which is generally
       a successful operation. This state is sometimes also called resolved
    3. The promise is rejected: It means that an error prevented the final value from being determined, which generally represents a failed operations
  - The first promise in our example application was fulfilled, representing a successful `axios.get('http://localhost:3001/notes')`
  - The second one, however, was rejected. The console tells us the reason it was rejected is because we were trying to make an HTTP GET request
    to a non-existent address
  - If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise
  - This is achieved using the method `then`

    ```
    const promise = axios.get('http://localhost:3001/notes')

    promise.then(response => {
      console.log(response)
    })
    ```

  - The Javascript runtime environment calls the callback function registered by the `then` method providing it with a `response` object as a parameter
  - The `response` object contains all the essential data related to the response of an HTTP GET request, which would include data, status code, and headers
  - Storing the promise object in a variable is generally unnecessary and it's instead common to chain the `then` method call to the axios method call, so that it
    follows directly
    ```
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        const notes = response.data
        console.log(notes)
      })
    ```
  - The callback function now takes the data contained within the response, stores it in a variable, and prints the notes to the console
  - The data returned by the server is plain text, basically just one long string
  - The axios library is still able to parse the data into a Javascript array, since the server has specified that the data format is
    application/json;charset=utf-8 using the content-type header
  - We can finally begin using the data fetched from the server
  - Let's try to request the notes from our local server and render them in the App component
  - We can do this promise in index.js, but it would probbly be better to do so in App.js

- Effect hooks

  - We've already used state hooks which provide state to React components defined as functions, so called functional components
  - As per docs, the Effect Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually
    changing the DOM in React components are all examples of side effects
  - As such, effect hooks are precisely the right tool to use when fetching data from a server
  - First the body of the function defining the component is executed and the component is rendered for the first time
  - At this point, 0 notes are printed, meaning the data hasn't been fetched from the server yet
  - The useEffect function in the App component is executed immediately after the first rendering of the App component
  - The execution of the function results in effect being printed to the console, and the command axios.get initiates the fetching of data
    from the server as well as registers the following function as an event handler for the operation:
    ```
    response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
    ```
  - When the data arrives from the server, the JS runtime calls the function registered as the event handler, which prints promise fulfilled to the console
    and stores the notes received from the server into the state using the function setNotes(response.data)
  - As always, a call to a state-updating function triggers the re-rendering of the component
  - The useEffect hook can be rewritten:

    ```
    useEffect(() => {
      console.log('effect')
      axios
        .get('http://localhost:3001/notes').then(response => {
          console.log('promise fulfilled')
          setNotes(response.data)
        })
    }, [])

    is equivalent to...

    const hook = () => {
      console.log('effect')
      axios
        .get('http://localhost:3001/notes')
        .then(response => {
          console.log('promise fulfilled')
          setNotes(response.data)
        })
    }

    useEffect(hook, [])
    ```

  - Now we can clearly see that the function useEffect takes two parameters
  - The first parameter is a function, the effect itself
  - By default, effects run after every rerender of the component, but you can choose to only have it fire when certain values change
  - So by default the effect is always run after the component has been rendered
  - In our case, we only want to execute the effect along with the first render
  - The second parameter in useEffect is sused to specify how often the effect is run
  - If the second parameter is an empty array [] then the effect is only run along the first render of the component
  - Essentially, the second parameter is the values that the effect depends on
  - Whenever the value of the second parameter changes, useEffect is called

## Altering data in a server

- REST

  - When creating notes in our application, we naturally want to store them in some backend server for persistent storage
  - The json-server package claims to be a REST or RESTful API
  - The json-server does not exactly match the book description of a REST API but neither do most APIs claiming to be RESTful
  - In REST terminology, we refer to individual data objects, such as the notes in our application, as resources
  - Every resource has a unique address associated with it - its URL
  - According to a general convention used by json-server, we would be able to locate an individual note at the resource URL notes/3, where 3 is the id of the resource
  - The notes url would point to a re source collection containing all notes
  - Resources are fetched from the server using HTTP GET requests
  - For instance, an HTTP GET request to the URL notes/3 will return the note that has the id number 3
  - An HTTP GET request to the notes URL will return a list of all notes
  - Creating a new resource for storing a note is done by making an HTTP POST request to the notes URL according to the REST convention the json-server adheres to
  - The data for the new note resource is sent in the body of the request
  - json-server requires all data to be in json format
  - This means the data must be a correctly formatted string, and that the request must contain the Content-Type request header with the value application/json

- Sending data to the server

  ```
  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
  ```

  - The above code sends a new note object to be added to the server
  - We created a new object for this note but omitted the id property, as we can let the server take care of that for us
  - The object is sent to the server using the axios POST method
  - The newly created note resource is stored in the value of the data property of the response object
  - The new note is not automatically rendered to the browser, as we still need to update the state to make sure the component renders again to show our changes

- Changing the imporatance of Notes
  - Let's add a button to every note that can be used for toggling its importance
  - Individual note stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL:
    1. We can replace the entire note with an HTTP PUT request
    2. We can change only some parts of the note with an HTTP PATCH request
  - We can use the array.find() method to find the note in the notes array that we want to modify
  - We then create a new note object that is the same as the previous note object, except for the property we wanted to update (in this case the important property)
  - { ...note } create a new note object with copies of all the properties of that note object
  - { ...note, important: !note.important } creates an exact copy of the previous `note` object, except with the note.important property changed
  - We created a copy of the note we are modifying rather than directly modifying the note itself because we are not supposed to directly change elements in the component's state
  - Since all notes are stored in our application's state, we should not directly modify these but rather create copies, then update the notes array with those copies
  - Copying an object in this way is called a shallow copy, meaning that the values of the new object are the same as the values of the old object
  - If the values of the old object were objects themselves, then the copied values in the new object would reference the same objects that were in the old object
  - We can set the component's notes state to a new array that contains all the items from the previous notes array, except for the one old note replaced by the updated version
    returned by the server with the following:
    ```
    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(note => note.id !== id ? note : response.data))
    })
    ```
  - This is accomplished with the .map() method
    `notes.map(note => note.id !- id ? note: response.data)`
  - The map method creates a new array by mapping every item from the old array into an item in the new array
  - In our example, the new array is created conditionally so that if `note.id !== id` is true, we simply copy the item from the old array into the new array
  - If the condition is false, then the note object returned by the server is added to the array instead
- Extracting communication with the backend into a separate module
  - The App component has become somewhat bloated after adding the code for communicating with the backend server
  - In spirit of the single responsibility principle, we deem it wise to extract this communication into its own module
  - We create the `src/services` directory then add `notes.js` to this directory
  - The module returns an object that has three functions (getAll, create, update) as its properties that deal with notes
  - The functions directly return the promises returned by the axios methods
  - The App component uses `import` to get access to the module
- Cleaner syntax for defining object literals

  - The module defining note related services currently exports an object with the properties getAll, create, and update that are assigned to functions for handling notes
  - It returns the following object:
    ```
    {
      getAll: getAll,
      create: create,
      update: update
    }
    ```
  - If the keys and values have the same name in an object, we can write the object definition in a more compact syntax
    ```
    {
      getAll,
      create,
      update,
    }
    ```
  - We can define JS objects in a more compact way now

    ```
    const name = 'Leevi'
    const age = 0

    const person = {
      name: name,
      age: age
    }

    const person = { name, age }
    ```

  - Both objects are equivalent

- Promises and errors
  - If we were to request a note that does not exist on the server, we need to have a way to gracefully deal with an HTTP 404 not found error
  - We previously talked about how a promise can have three states: pending, fulfilled, and rejected
  - We can deal with rejected promises by chaining our .then() method with a second callback function which is called when the promise is rejected
  - It is more common to use a .catch() method to catch the error rather than another .then() chaining
    ```
    axios.get('http://example.com/probably_will_fail').then(response => {
      console.log('success!')
    })
    .catch(error => {
      console.log('fail')
    })
    ```
  - We can filter out the note we do not want to include in the notes array with the following:
    ```
    setNotes(notes.filter(n => n.id !== id))
    ```
- ## Adding styles to React app
  - CSS rules comprise of selectors and declarations
  - The selector defines which elements the rule should be applied to
    ```
    h1 {
      color: green;
    }
    ```
  - The selector in the above code is h1, meaning this rule will apply to all h1 elements
  - The declaration sets the color property to the value green
  - We can apply CSS styles to individual elements by assigning the className tag to those elements, then making a style targeting .className
  - Inline CSS styling is actually good practice in React due to the overarching goal of reusable components, meaning putting the CSS in a separate file
    goes against this concept
