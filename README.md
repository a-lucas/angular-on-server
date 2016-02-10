
This is inspired by the original angular-on-server

It seems like the latest jsdom version includes a nice XmlHttprequest

All the client code is written iin ES6 


How to use : 


    npm install -g gulp


open 3 consoles: 

    gulp watch-client 
 
    node server/angularonserver.js server 
    
(So far it doesn't synchonously resolve any promises on bootstrap.) 

    node server/angularonserver.js client 


