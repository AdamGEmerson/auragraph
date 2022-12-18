import {NextApiRequest, NextApiResponse} from "next";
import {Json} from "../../../types/supabase";
import getConfig from "next/config";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import SearchResponse = SpotifyApi.SearchResponse;

export default async function handler( req: NextApiRequest, res: NextApiResponse<SearchResponse | Json> ) {
    const { serverRuntimeConfig } = await getConfig();
    const supabase = createServerSupabaseClient({req, res});

    let spotifyApi = new SpotifyWebApi({
        clientId: serverRuntimeConfig.clientId,
        clientSecret: serverRuntimeConfig.clientSecret,
    });

    const { searchText } = req.query;

    const {
        data: {session},
    } = await supabase.auth.getSession()

    console.log("Searching for session");

    // if (session) {
    //     const {provider_token, provider_refresh_token} = session;
    //     if (provider_token && provider_refresh_token && searchText) {
    //         await spotifyApi.setAccessToken(provider_token);
    //         await spotifyApi.setRefreshToken(provider_refresh_token);
    //         if (typeof searchText === "string")
    //             try {
    //                 const response = await spotifyApi.searchArtists(searchText);
    //                 res.status(200).json(JSON.parse(JSON.stringify(response.body)));
    //                 console.log(response.body.artists?.items);
    //                 return;
    //             } catch (e) {
    //                 // Attempt to refresh and save the access token.
    //                 await spotifyApi.refreshAccessToken();
    //                 session.provider_token = spotifyApi.getAccessToken();
    //                 session.provider_refresh_token = spotifyApi.getRefreshToken();
    //                 await supabase.auth.setSession(session);
    //                 const response = await spotifyApi.searchArtists(searchText);
    //                 res.status(200).json(JSON.parse(JSON.stringify(response.body)))
    //                 return;
    //             }
    //     }
    // }
    // res.status(400).json( {error: "Error with Spotify API"} )
    // return;

    const auth = await spotifyApi.clientCredentialsGrant();
    // Save the access token so that it's used in future calls
    console.log(auth)
    spotifyApi.setAccessToken(auth.body['access_token']);

    if (typeof searchText === "string") {
        try {
            const response = await spotifyApi.searchArtists(searchText);
            res.status(200).json(JSON.parse(JSON.stringify(response.body)));
            console.log(response.body.artists?.items);
            return;
        } catch (e) {
            res.status(400).json(JSON.parse(JSON.stringify(e)))
            return;
        }
    }
}