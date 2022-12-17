import { useRouter } from 'next/router'
import {GetServerSideProps} from "next";
import {User} from "@supabase/supabase-js";
import getConfig from "next/config";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";

// export const getServerSideProps: GetServerSideProps{ GetServer } = async (context) => {
//     const { serverRuntimeConfig } = getConfig();
//     const supabase = createServerSupabaseClient(context);
//
//     const artistID = context.params?.artistID;
//
//     // Check if we have a session
//     const {
//         data: {session},
//     } = await supabase.auth.getSession()
//
//     if (session) {
//         console.log("Session Found")
//         const {provider_token, provider_refresh_token, user} = session
//
//         let spotifyApi = new SpotifyWebApi({
//             clientId: serverRuntimeConfig.clientId,
//             clientSecret: serverRuntimeConfig.clientSecret,
//         });
//
//         if (provider_token && provider_refresh_token && artistID) {
//             await spotifyApi.setAccessToken(provider_token);
//             await spotifyApi.setRefreshToken(provider_refresh_token);
//             if (typeof artistID === "string") {
//                 const artistData = await spotifyApi.getArtist(artistID);
//                 const artistTopSongs = await spotifyApi.getArtistTopTracks(artistID, "US");
//                 return { props: { artistData, artistTopSongs } }
//             }
//         }
//     }
// }


const ArtistPage = ( { artistData, artistTopSongs }:{artistData: Response; artistTopSongs: Response;}) => {
    const router = useRouter()
    const { artistID } = router.query

    return (
        <p>Artist: {JSON.stringify(artistTopSongs)}</p>
    );
}

export default ArtistPage;