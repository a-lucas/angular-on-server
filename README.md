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

````
###qFactory
     
     var promiseId = 0;
 
     var addPromise = function(id) {
         StackQueue.add({id: id}, 'promise');
     };
 
     var removePromise = function(id) {
         StackQueue.resolve({id: id}, 'promise');
     };
     
     function Deferred() {
        this.promise = new Promise();
        promiseId++;
        this.id = promiseId;
        addPromise(this.id);
     }
     ...
     resolve: function(val) {
     ....
       removePromise(this.id);
               
     }
     ...
     reject: function(reason) {
         if (this.promise.$$state.status) return;
         removePromise(this.id);
         this.$$reject(reason);
     },

````
###httpBackend

````
    addStack = function(obj) {
        StackQueue.add(obj, 'httpBackend');
    };
    resolveStack = function(obj) {
        StackQueue.resolve(obj, 'httpBackend');
    };
       
    var xhr = createXhr(method, url)
    addStack({id: url});
    
    function completeRequest(callback, status, response, headersString, statusText) {
        ...
        resolveStack({id: url});
       ...
    }
````
 
 Every time a promise or a httpBackend is removed from the stackQueue, it checks if all queues are empty - and trigger a `StackQueueEmpty` event on the window.
 
 This event is caught by angular server's jsdom context - and allows it to wait for all the unresolved promises and http requiests to complete before sending rendering the page.
  
 In this example, the server wait for `$http.get('/products')` to complete before outputing the HTML.

## Server side logging
 
 When running on server, the `$log` provider is extended to write inside `debug.log` and `error.log` .
 

 
#more doc: 

/doc/cli.client.md

/doc/cli.server.md
 
 
#todo

/doc/TODO.md
 
