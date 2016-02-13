###########
# SERVER
###########

# Generate the server side HtML
 
## http://localhost:3002. 
 
1. Each request generate the HTML and prints it to the console
2. the HTML code is generated on the server sid
3. then re-evaluated on the browser after 5000 ms: 
  
  ```
  // in src/app.js
  
      setTimeout(() => {
          var html = angular.element(document.getElementById('myApp'));
          angular.bootstrap(html, ['myApp']);
      }, 5000);

  ```

 try 

 http://localhost:3002/Main

 &

 http://localhost:3002/Todo