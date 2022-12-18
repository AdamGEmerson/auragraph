import type { NextApiRequest, NextApiResponse } from 'next'
import {createClient, PostgrestResponse} from "@supabase/supabase-js";
import getConfig from "next/config";
import {Database, Json,} from "../../../../types/supabase";


export default async function handler( req: NextApiRequest, res: NextApiResponse<Json> ) {
    const { publicRuntimeConfig } = await getConfig();
    const { userID } = req.query;
    console.log(`Request ${userID}`)
    const supabase = await createClient<Database>(
        publicRuntimeConfig.databaseApiUrl,
        publicRuntimeConfig.databasePublicAnon
    );

    let dbResponse = await supabase.from('Auragraph').select('aura_data').eq('id', userID);

    if ( dbResponse.status === 200 && dbResponse.data ) {
        res.status(200).json( dbResponse.data[0].aura_data )
    } else {
        res.status( dbResponse.status ).json( { message: dbResponse.statusText } )
    }
}