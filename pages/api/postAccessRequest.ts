import type { NextApiRequest, NextApiResponse } from 'next'
import {createClient, PostgrestResponse} from "@supabase/supabase-js";
import getConfig from "next/config";
import {Database, Json,} from "../../types/supabase";

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    const { publicRuntimeConfig } = await getConfig();
    const payload = JSON.parse(req.body)
    const {firstName, lastName, email} = payload;

    const supabase = await createClient<Database>(
        publicRuntimeConfig.databaseApiUrl,
        publicRuntimeConfig.databasePublicAnon
    );

    let dbResponse = await supabase.from('Access Requests').upsert({f_name: firstName, l_name: lastName, email: email});

    console.log(JSON.stringify( dbResponse ));
    if ( dbResponse.error == null ) {
        res.status(200).json({message: JSON.stringify(dbResponse)})
        return;
    }

    res.status(400).json( {message: "Failure to request access"});
    return;
}