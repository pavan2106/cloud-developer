// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
//const apiId = 'kgquanlrg2'
const apiId = 'apnv2nipa8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
//https://apnv2nipa8.execute-api.us-east-1.amazonaws.com
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'pavan2106.auth0.com',            // Auth0 domain
  clientId: 'USKqBocMSd5kj72tIGvNUv9ibvxWNpkF',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
