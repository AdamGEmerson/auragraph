import {NextApiRequest, NextApiResponse} from "next";
import {Json} from "../../../../types/supabase";
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

    const { artistID } = req.query;

    const {
        data: {session},
    } = await supabase.auth.getSession()

    console.log("Searching for session");

    if (session) {
        const {provider_token, provider_refresh_token} = session;
        if (provider_token && provider_refresh_token && artistID) {
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);
            if (typeof artistID === "string")
                try {
                    const response = await spotifyApi.getArtist(artistID);
                    res.status(200).json(JSON.parse(JSON.stringify(response.body)));
                    console.log(response.body);
                    return;
                } catch (e) {
                    // Attempt to refresh and save the access token.
                    await spotifyApi.refreshAccessToken();
                    session.provider_token = spotifyApi.getAccessToken();
                    session.provider_refresh_token = spotifyApi.getRefreshToken();
                    await supabase.auth.setSession(session);
                    const response = await spotifyApi.getArtist(artistID);
                    res.status(200).json(JSON.parse(JSON.stringify(response.body)))
                    return;
                }
        }
    }

    res.status(400).json( {error: "Error with Spotify API"} )
    return;
}