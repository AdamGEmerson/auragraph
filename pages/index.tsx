import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import {Button, Center, Container, Group, Title} from '@mantine/core'
import { useEffect, useState } from 'react'
import {IconBrandSpotify, IconLogin} from "@tabler/icons";
import Image from "next/image";
import musicIllustration from "../public/undraw_music.svg";
import {GetServerSideProps, GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData} from "next";
import {User} from "@supabase/supabase-js";
import getConfig from "next/config";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import {ParsedUrlQuery} from 'querystring';

// export const getServerSideProps = async (context: any ) =>  {
//     const supabase = createServerSupabaseClient(context);
//     const {
//         data: { session },
//     } = await supabase.auth.getSession()
//
//     if (session) {
//         console.log(session)
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             }, props: {},
//         }
//     } else {
//         return { props: {} };
//     }
// }

const LoginPage = () => {
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const [data, setData] = useState<any>()


    async function signInWithSpotify() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: 'playlist-read-private user-read-private user-top-read',
                redirectTo: `${window.location.origin}/home`,
            }
        })
    }

    return (
        <Center style={{height: 600}}>
            <Container size={"md"}>
                <Group>
                    <Image src={musicIllustration} alt={"Music Illustration"} width={300} height={300}/>
                </Group>
                <Group>
                    <Title order={3} color={'dimmed'}>Sign in to spotify to get started...</Title>
                </Group>
                <Group position={'center'}>
                    <Button size={'lg'} radius={'lg'} my={'md'} variant={"gradient"} leftIcon={<IconBrandSpotify />} onClick={() => signInWithSpotify()}>Sign In</Button>
                </Group>
            </Container>
        </Center>
    )
}

export default LoginPage