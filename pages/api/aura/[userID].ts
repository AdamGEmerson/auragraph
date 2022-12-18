import type { NextApiRequest, NextApiResponse } from 'next'
import {createClient, PostgrestResponse} from "@supabase/supabase-js";
import getConfig from "next/config";
import {Database, } from "../../../types/supabase";


export default async function handler( req: NextApiRequest, res: NextApiResponse<PostgrestResponse<{aura: any}>> ) {
    const { publicRuntimeConfig } = await getConfig();
    const { userID } = req.query;
    console.log(`Request ${userID}`)
    const supabase = await createClient<Database>(
        publicRuntimeConfig.databaseApiUrl,
        publicRuntimeConfig.databasePublicAnon
    );

    let aura = await supabase.from('Auragraph').select('aura_data').eq('id', userID);

    console.log(JSON.stringify( aura ));

    res.status(200).json( aura )
}