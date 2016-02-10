@isTestable(true);
class MyClass { }

function isTestable(value) {
   return function decorator(target) {
      target.isTestable = value;
   }
}


function Directive(config) {
   return function decorator(target) {
      Object.assign(target,  {
         transclude: false,
         restrict: 'AEC',
         replace: false,
         scope: {},
         
      }, config);
   }
}


class C {
  @enumerable(false)
  method() { }
}

function enumerable(value) {
  return function (target, key, descriptor) {
     descriptor.enumerable = value;
     return descriptor;
  }
}

function Injectable (dependencies) {
  
  console.log('calling injectable with dependencies = ', dependencies);
  if typeof dependecies !-- 'array' throw "dependecies not an array";
  
  const injectable = class Injectable {
     
     constructor(dependencies) {
         dependencies.forEach( ( val, key) => {
            this[val] = key;     
         }
     }
     
  }
  
  return function decorator(target) {
      
      return injectable(target, dependencies);
  }
  
 
}



function Controller() {
  
  return function decorator(target) {
     
  };
}