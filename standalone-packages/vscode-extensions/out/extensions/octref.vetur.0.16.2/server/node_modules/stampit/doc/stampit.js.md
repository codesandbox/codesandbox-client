# Stampit API #

**Source: stampit.js**

### stampit ###

Return a factory function that will produce new objects using the
prototypes that are passed in or composed.

* @param {Object} methods A map of method names and bodies for delegation.
* @param {Object} state A map of property names and values to clone for each new object.
* @param {Function} enclose A closure (function) used to create private data and privileged methods.
* @return {Function} factory A factory to produce objects using the given prototypes.
* @return {Function} factory.create Just like calling the factory function.
* @return {Object} factory.fixed An object map containing the fixed prototypes.
* @return {Function} factory.methods Add methods to the methods prototype. Chainable.
* @return {Function} factory.state Add properties to the state prototype. Chainable.
* @return {Function} factory.enclose Add or replace the closure prototype. Not chainable.
* @return {Function} factory.static Add properties to the factory object. Chainable.

### compose ###

Take two or more factories produced from stampit() and
combine them to produce a new factory. Combining overrides
properties with last-in priority.

* @param {...Function} factory A factory produced by stampit().
* @return {Function} A new stampit factory composed from arguments.
