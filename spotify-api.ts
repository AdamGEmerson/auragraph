import getConfig from "next/config"
import SpotifyWebApi from 'spotify-web-api-node';
import {PrismaClient} from '@prisma/client'
// NOTE: Fix for server functions not being correctly defined in the library.
// @ts-ignore
import clientCredentialsGrant from 'spotify-web-api-node/src/server-methods';

const prisma = new PrismaClient();

(SpotifyWebApi as unknown as { _addMethods: (functions: unknown) => void })._addMethods(
    clientCredentialsGrant
);

const { serverRuntimeConfig, clientRuntimeConfig} = getConfig();

async function findExistingAccessToken() {
    // Check if there is a valid access token in the DB...
    return await prisma.authentication.findFirst({
        where: {
            expiration_date: {
                gt: new Date().toISOString()
            },
        },
    });
}

async function getNewAccessToken( api:SpotifyWebApi ) {
// Retrieve an access token.
//     api.clientCredentialsGrant().then(
//         function (data) {
//              writeNewAccessToken(data.body).then(() => {
//                      // Save the access token so that it's used in future calls
//                      api.setAccessToken(data.body['access_token']);
//              });
//         },
//         function (err) {
//             console.log('Something went wrong when retrieving an access token', err);
//         }
//     );
    let state = 'spotigraph-grant-permission'
    let scopes = ['']
    let authorizeURL = api.createAuthorizeURL(scopes, state);

}

// @ts-ignore
async function writeNewAccessToken(data:ClientCredentialGrantResponse) {
    // Set our expiration as a Date object.
    let expiration_date: Date = new Date();
    expiration_date.setSeconds(expiration_date.getSeconds() + data['expires_in'])

    // Write authentication response into the database.
    const authentication = await prisma.authentication.create({
        data: {
            access_token: data['access_token'],
            expiration_date: expiration_date,
            token_type: data['token_type'],
        },
    })
}

// Set the client ID
async function getSpotifyApiConnection():Promise<SpotifyWebApi> {

    let spotifyApi = new SpotifyWebApi({
        clientId: serverRuntimeConfig.clientId,
        clientSecret: serverRuntimeConfig.clientSecret,
    });

    // Check for an existing valid token and return it.
    let authObject = await findExistingAccessToken();
    if (authObject != null) {
        console.log("Existing valid token found.")
        spotifyApi.setAccessToken(authObject.access_token)
        return spotifyApi;
    }

    // Get a new token, store it in the db, and return it.
    await getNewAccessToken(spotifyApi);
    return spotifyApi;

}

export default getSpotifyApiConnection();