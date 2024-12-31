import {NextApiRequest, NextApiResponse} from "next";
import {Json} from "../../../types/supabase";
import getConfig from "next/config";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import { spotifyApi } from "../../../utils/spotify-api";
import SearchResponse = SpotifyApi.SearchResponse;

export default async function handler( req: NextApiRequest, res: NextApiResponse<SearchResponse | Json> ) {
    const { searchText } = req.query;
    const response = await spotifyApi.search(searchText, ['artist']);
    console.log(response);
    if (response.error) {
        res.status(500).json(response.error);
    }
    res.status(200).json(response);
}