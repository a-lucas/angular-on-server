
### PROMISES
###########



TODO:  Captute the promise execution stack, and link it to the Contextify process tick - and launch res.end() once the stack is empty.
FOR: 
   C_Context.angular.bootstrap( document, AppName);
   
   
   C_Context.PromiseManager.on('PromiseAdd' , (promise)=> {
     console.log(this);
     console.log(promise);
   });
   
   C_Context.PromiseManager.on('QueueEmpty' , ( timeout )=> {
     
     if (!timeout) timeout=0;
     
     
     setTimeout( () => {
       if ( C_Context.promiseManager.isEmpty ) {
            res.end( HTML );
            C_COntext.dispose();
            window.close();
            return;
       }
    }, timeout);
  });
  
  C_Context.setTimeout( () => {
    
    if ( C_Context.promiseManager || window.isOpen() ) {
        //LOG WARNING
        res.end( HTML );  
        C_Context.promiseManager.destroy();
        C_COntext.dispose();
        window.close();
    }
        
  }, HTTP_TIMEOUT );

Angular Engine is listening to promise's callbacks and shall freeze tehse promises until the callback gets executed.
 
 
 Promise{
    id: uuid,
    
    resolve: function(val) {
        BroadCast('Prommise resolved', id, val);
        yield [this._id, val];
    }
    
    reject(reason) {
       BroadCast('Prommise resolved', id, val);
       yield [this._id, reason];
    }
    
    notify() {
        BroadCast('Prommise resolved', id, val);
        yield [this._id, reason];
    }
 }
 
 PromiseStatus{
    switch (this.status ) {
       pool.next().value
    }
 }
 
 
 promise.resolve() {
          
 };
 
 liten( callback

function * pool(getPoolCB) {
    var pool = getPoolCB();
    pool.length > 0 ? yield pool.length : 0;
}

var sequence = pool( getPool ); 
   while ( pool.next().value === undefined ) {
    
}

### ROUTER
###########
- Extend the ui-router to allow the following : 

  - URL Registration & definition
    - name
    - date-updated
    - caching strategy ( 
        - generate all the time, 
        - partial caching, 
        - periodic caching, 
        - callbacks:  
            - shouldCache(), 
            - willcache(), 
            - afterCache(), 
            - cleanCache() 
 

- <div ng-app="myApp" ng-strict-di>
https://github.com/olov/ng-annotate
