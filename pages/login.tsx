import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button } from '@mantine/core'
import { useEffect, useState } from 'react'
import {IconLogin} from "@tabler/icons";

const LoginPage = () => {
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const [data, setData] = useState<any>()

    async function signInWithSpotify() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: 'playlist-read-private user-read-private user-top-read'
            }
        })
    }

    useEffect(() => {
        async function loadData() {
            const { data } = await supabaseClient.from('test').select('*')
            setData(data)
        }
        // Only run query once user is logged in.
        if (user) loadData()
    }, [user])

    if (!user)
        return (
            <>
                <Button
                    onClick={() => signInWithSpotify()}
                    leftIcon={<IconLogin/>}
                >
                    Sign In
                </Button>

            </>
        )

    return (
        <>
            <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
            <p>user:</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <p>client-side data fetching with RLS</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    )
}

export default LoginPage