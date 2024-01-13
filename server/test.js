function getAllPropertiesFromClass(clazz) {
    let properties = [];
  
    // Get properties from the class
    properties = properties.concat(
      Object.getOwnPropertyNames(clazz)
    );
  
    // Get properties from the class prototype
    const prototype = Object.getPrototypeOf(clazz.prototype);
    if (prototype) {
      properties = properties.concat(
        Object.getOwnPropertyNames(prototype)
      );
    }
  
    // Get properties from an instance of the class
    const instance = new clazz();
    properties = properties.concat(
      Object.getOwnPropertyNames(instance)
    );
  
    // Remove duplicate property names
    return Array.from(new Set(properties));
  }
  
  class ParentClass {
    constructor() {
      this.parentProperty = 'parent';
    }
  
    parentMethod() {}
  }
  
  class ChildClass extends ParentClass {
    constructor() {
      super();
      this.childProperty = 'child';
    }
  
    childMethod() {}
  }
  
  // Get all properties of the ChildClass and its parent class
  const allProperties = getAllPropertiesFromClass(ChildClass);
  
  console.log(allProperties);