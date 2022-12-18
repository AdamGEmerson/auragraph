import type { NextApiRequest, NextApiResponse } from 'next'
import {createClient, PostgrestResponse} from "@supabase/supabase-js";
import getConfig from "next/config";
import {Database, Json,} from "../../../types/supabase";
import SpotifyWebApi from "spotify-web-api-node";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import UsersTopArtistsResponse = SpotifyApi.UsersTopArtistsResponse;


export default async function handler( req: NextApiRequest, res: NextApiResponse<UsersTopArtistsResponse | Json> ) {
    const { serverRuntimeConfig } = await getConfig();
    const supabase = createServerSupabaseClient({req, res});

    let spotifyApi = new SpotifyWebApi({
        clientId: serverRuntimeConfig.clientId,
        clientSecret: serverRuntimeConfig.clientSecret,
    });

    const {
        data: {session},
    } = await supabase.auth.getSession()

    console.log("Searching for session");

    if (session) {
        const {provider_token, provider_refresh_token} = session;
        console.log("Found session")
        if (provider_token && provider_refresh_token) {
            console.log("Found tokens")
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);

            try {
                const response = await spotifyApi.getMyTopArtists();
                res.status(200).json(JSON.parse(JSON.stringify(response.body)));
                return;
            } catch (e) {
                // Attempt to refresh and save the access token.
                await spotifyApi.refreshAccessToken();
                session.provider_token = spotifyApi.getAccessToken();
                session.provider_refresh_token = spotifyApi.getRefreshToken();
                await supabase.auth.setSession(session);
                const response = await spotifyApi.getMyTopArtists();
                res.status(200).json(JSON.parse(JSON.stringify(response.body)))
                return;
            }
        }
    }
    res.status(400).json( {error: "Error with Spotify API"} )
    return;
}
