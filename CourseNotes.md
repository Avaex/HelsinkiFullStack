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
