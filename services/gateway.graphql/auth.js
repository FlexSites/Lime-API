const AuthenticationClient = require('auth0').AuthenticationClient
const ManagementClient = require('auth0').ManagementClient
const get = require('lodash.get')

const manage = new ManagementClient({
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT,
  domain: process.env.AUTH0_DOMAIN,
  clientSecret: process.env.AUTH0_MANAGEMENT_SECRET
})

const auth = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_AUTHENTICATION_CLIENT
})

const UNAUTHENTICATED_USER = {
  groups: [],
  roles: ['everyone'],
  permissions: ['read:event', 'read:venue']
}

module.exports = async (token) => {
  try {
    if (!token) throw new Error('No token provided.')
    token = token.replace(/^Bearer\s/i, '')
    const results = await auth.getProfile(token)
    if (typeof results !== 'object' || !results.sub) {
      throw new Error('Bad token.')
    }
    const viewers = await manage.getUser(results.sub)
    return get(viewers, ['0', 'app_metadata', 'authorization'], UNAUTHENTICATED_USER)
  } catch (ex) {
    return UNAUTHENTICATED_USER
  }
}
