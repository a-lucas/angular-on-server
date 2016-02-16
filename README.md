# Wait, what?  :hushed:

This is WIP - big time - I'll submit a PR when It starts looking good.

This is inspired by the original angular-on-server.

All the client code is written in ES6 and supports decorators. 

To generate the client code, run `gulp watch-client`.

For the server: `node server/angularonserver.js server`


#What's done: 

## StackQueue

`angular/StackQueue.js` is a basic queue that currenty stacks promises and httpbackend requests in a basic array.
  
The qFactory and the HttpBackend providers are modified to call this StackQueue. 
 
 Every time a promise or a httpbackend is removed from the stackQueue, it checks if all his queues are empty - and trigger a `StackQueueEmpty` event on the window.
 
 This event is caught by angular server - who wait for all unresolved promises or httpbackend queries to finish before sending the http request.
  
 In this example, the server wait for `$http.get('/products')` to finish before outputing the HTML.

## Server side logging
 
 When running on server, the `$log` provider is extended to write inside `debug.log` and `error.log` .
 
 
#more doc: 
/doc/cli.client.md
/doc/cli.server.md
 
 
#todo

/doc/TODO.md
 
