/*
* These functions are used to create and access a namespace for each request
* Once the namespace is created, up to 3 things will be added to it:
* companyId, userId and userIsAdmin boolean
* At any moment in the future, during a request, the namespace can be queried for that data
*/

import { createNamespace } from 'continuation-local-storage'

const namespaceName = 'request'
const ns = createNamespace(namespaceName)

/* 
* Creates a namespace for every req and res
* Receives the regular express req, res, next
* Returns nothing, it calls next() to continue forward
*/
exports.bindCurrentNamespace = (req, res, next) => {
  ns.bindEmitter(req)
  ns.bindEmitter(res)

  ns.run(() => {
    next()
  })
}

/*
* Setter functions to add context to req
* Receive each what their name say
* Return a setter function with the data added to the req object
*/

exports.setCurrentUserId = userId => {
  return ns.set('userId', userId)
}

exports.setCurrentUserIsAdmin = isAdmin => {
  return ns.set('userIsAdmin', isAdmin)
}

/*
* Getter functions to get context from req
* Receive nothing
* Return the data their name implies from the req object
*/

exports.getCurrentUserId = () => {
  return ns.get('userId')
}

exports.getCurrentUserIsAdmin = () => {
  return ns.get('userIsAdmin')
}