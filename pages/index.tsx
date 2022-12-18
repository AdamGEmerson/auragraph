import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import {
    Button,
    Center,
    Container,
    Divider,
    Group,
    Title,
    Text,
    useMantineTheme,
    Card,
    ThemeIcon,
    Stack,
    TextInput,
    SimpleGrid, Grid
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import {IconBrandSpotify, IconCirclesRelation, IconLogin, IconTestPipe} from "@tabler/icons";
import {useHover} from "@mantine/hooks";
import {GridLineOptions} from "chart.js";

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
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const [data, setData] = useState<any>();
    const theme = useMantineTheme();
    const hovered = useHover();

    async function signInWithSpotify() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: 'playlist-read-private user-read-private user-top-read',
                redirectTo: `${window.location.origin}/authenticated/home`,
            }
        })
    }

    return (
        <>
            <Stack>
                <Center>
                    <Card
                        my={'xl'}
                        radius={"xl"}
                        shadow={hovered ? "xl" : "md"}
                        p={"xl"}
                        sx={(theme) => ({
                            backgroundColor: theme.fn.rgba(theme.colors.dark[4], 0.35),
                            backdropFilter: "blur( 2px )",
                            width: "80%",
                            transitionProperty: "transform boxShadow",
                            transitionDuration: ".4s",
                            transitionTimingFunction: "ease-in-out",
                            '&:hover': {
                                boxShadow: `0 8px 32px 0 ${theme.fn.rgba(theme.colors.teal[9], 0.25)}`,
                                cursor: 'pointer',
                                transform: "rotate(.2deg)"
                            }
                        })}
                        withBorder>
                        {/*color={theme.fn.rgba(theme.colors.teal[4], .8)*/}
                        <Title order={1} variant={'gradient'} gradient={{from: theme.colors.teal[5], to:theme.colors.yellow[3], deg:60}} sx={{fontSize: "100px"}}>auragraph</Title>
                        <Text sx={{fontSize: "30px"}} weight={700} color={theme.colors.dark[2]} >[ ˈôrə-ɡraf ] • <em>noun</em> </Text>
                        <Divider my={'sm'}/>
                        <Text sx={{fontSize: "24px"}} my={"md"} weight={600}>
                            {`A colorful map of an individual's music taste and the relationship between their favorite artists.`}
                        </Text>
                    </Card>
                </Center>
                <Container sx={{width:'80%'}}>
                    <Title order={2} mb={'md'} mx={'md'}>auragraph is currently in early access</Title>

                    <Grid px={'md'}>
                        <Grid.Col span={12}><Title order={3}>Request access below, and while you wait, check out our demo.</Title></Grid.Col>
                        <Grid.Col span={12}><Text>Please be sure to include the email associated with your spotify account.</Text></Grid.Col>
                        <Grid.Col span={6}><TextInput size={'lg'} placeholder={'First Name'} radius={'lg'}></TextInput></Grid.Col>
                        <Grid.Col span={6}><TextInput size={'lg'} placeholder={'Last Name'} radius={'lg'}></TextInput></Grid.Col>
                        <Grid.Col span={12}><TextInput size={'lg'} placeholder={'Your Spotify Account Email'} radius={'lg'}></TextInput></Grid.Col>
                        <Grid.Col span="auto"><Button color={'teal'} size={'lg'} radius={'lg'}>Request Access</Button></Grid.Col>
                    </Grid>
                </Container>
                <Center>
                    <Button component={'a'} href={"/demo"} leftIcon={<IconTestPipe/>} px='md' radius={'lg'} sx={{height: "100px", width: "200px"}} size={'xl'} my={"xl"}>Try The Demo</Button>
                </Center>

                {/*<Group position={'center'}>*/}
                {/*    <Button size={'lg'} radius={'lg'} my={'md'} variant={"gradient"} leftIcon={<IconBrandSpotify />} onClick={() => signInWithSpotify()}>Sign In</Button>*/}
                {/*</Group>*/}
            </Stack>



        </>
    )
}

export default LoginPage