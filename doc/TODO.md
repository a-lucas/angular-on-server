

### ROUTER
###########
Define the routing caching strategy


 - REST Routes
    - local / remote
    - caching strategy : 
        - periodic
        - never
        - custom
            - shouldUseCache: function
        
 - Angular Routes
     - URL Registration & definition
         - name
         - date-updated
         - caching strategy ( 
             - generate all the time, 
             - periodic caching, 
             - callbacks:  
                 - shouldCache(), 
                 - willcache(), 
                 - afterCache(), 
                 - cleanCache() 
      



- Extend the ui-router to allow the following : 

  - URL Registration & definition
    - name
    - date-updated
    - caching strategy ( 
        - generate all the time, 
        - periodic caching, 
        - callbacks:  
            - shouldCache(), 
            - willcache(), 
            - afterCache(), 
            - cleanCache() 
 


- <div ng-app="myApp" ng-strict-di>
https://github.com/olov/ng-annotate
