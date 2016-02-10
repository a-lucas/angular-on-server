- need to declare the views folder on the root /views/ .... 
have to figiure out where to prepend cirrent path 

sudo ln -s views ~/a-lucas/angular-on-server/src/views

- define a better routing definition, with Object registration definition ini the router.

- browser-sync start --server --files "css/*.css"

- <div ng-app="myApp" ng-strict-di>
https://github.com/olov/ng-annotate


- choose wich decorators to enable
https://babeljs.io/docs/plugins/syntax-decorators/
or
http://babeljs.io/docs/plugins/transform-decorators/


some nice decorator : 
http://stackoverflow.com/questions/33076646/es7-decorators-with-babel-unexpected-token


use jsdom (latest)
https://github.com/tmpvar/jsdom/issues/380
