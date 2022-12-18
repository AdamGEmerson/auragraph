import type { NextApiRequest, NextApiResponse } from 'next'
import {createClient, PostgrestResponse} from "@supabase/supabase-js";
import getConfig from "next/config";
import {Database, Json,} from "../../types/supabase";


export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    const { publicRuntimeConfig } = await getConfig();
    const payload = JSON.parse(req.body)
    const userID = payload.id;
    console.log(userID)
    const aura:Json = payload.aura;
    console.log(`Request ${userID}`);
    const supabase = await createClient<Database>(
        publicRuntimeConfig.databaseApiUrl,
        publicRuntimeConfig.databasePublicAnon
    );

    let dbResponse = await supabase.from('Auragraph').upsert({id: userID, aura_data: aura, last_updated: new Date().toISOString() });

    console.log(JSON.stringify( dbResponse ));

    res.status(200).json({message: JSON.stringify( dbResponse )} )
}