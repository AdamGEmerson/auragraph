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
    SimpleGrid, Grid, MediaQuery, HoverCard, ActionIcon
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import {
    IconAlertTriangle,
    IconBrandSpotify,
    IconCheck,
    IconCirclesRelation, IconInfoCircle,
    IconLogin, IconMailFast,
    IconTestPipe
} from "@tabler/icons";
import {useHover, useMediaQuery} from "@mantine/hooks";
import {GridLineOptions} from "chart.js";
import {useForm} from "@mantine/form";
import {showNotification} from "@mantine/notifications";

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
    const [formLoading, setFormLoading] = useState(false);
    const theme = useMantineTheme();
    const hovered = useHover();
    const smallScreen = useMediaQuery(`(min-width: ${theme.breakpoints.lg.toString()}px)`);
    const matches = useMediaQuery('(min-width: 900px)');
    const form = useForm({
        initialValues: { firstName: '', lastName: '', email: ''},

        // functions will be used to validate values at corresponding key
        validate: {
            firstName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            lastName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    async function signInWithSpotify() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: 'playlist-read-private user-read-private user-top-read',
                redirectTo: `${window.location.origin}/home`,
            }
        })
    }

    async function formSubmit( formData: {firstName: string, lastName: string, email: string} ) {
        setFormLoading(true)
        form.clearErrors;
        fetch(`/api/postAccessRequest`, { method: 'POST', body: JSON.stringify(formData)}).then((res) => {
            if ( res.ok ) {
                res.json().then(data => {
                    setFormLoading(false)
                    showNotification({ color:'teal', icon:<ThemeIcon variant={'light'}><IconCheck/></ThemeIcon>, title: 'Success', message: "We've received your access request! Please allow up to 24 hours for approval."})
                })
            } else {
                console.log("Request failed")
                setFormLoading(false)
                showNotification({ color: 'red', icon:<IconAlertTriangle/>, title: 'Error', message: "There was an issue with your request. Please try again in a few minutes."})

            }
        })
    }

    return (
            <Container my={"10%"}>
                <Center>
                    <Card
                        my={'xl'}
                        radius={"xl"}
                        shadow={hovered ? "xl" : "md"}
                        p={"xl"}
                        sx={(theme) => ({
                            backgroundColor: theme.fn.rgba(theme.colors.dark[4], 0.35),
                            boxShadow: `0 8px 32px 0 ${theme.fn.rgba(theme.colors.teal[9], 0.25)}`,
                            backdropFilter: "blur( 2px )",
                            width: "80%",
                            transitionProperty: "transform boxShadow",
                            transitionDuration: ".4s",
                            transitionTimingFunction: "ease-in-out",
                            '&:hover': {

                                cursor: 'pointer',
                                transform: "rotate(.2deg)"
                            }
                        })}
                        withBorder>
                        {/*color={theme.fn.rgba(theme.colors.teal[4], .8)*/}
                        <Center>
                        <Group>
                            <ThemeIcon size={64} variant={'light'} radius={'xl'} color='teal'><IconCirclesRelation
                                size={48}/></ThemeIcon>
                            <Stack spacing={'xs'}>
                                <Group>
                                    <Title order={1} variant={'gradient'}>auragraph</Title>
                                </Group>
                            </Stack>
                        </Group>
                        </Center>
                        <Divider my={'xl'}/>
                        <Center>
                            <Title order={2}>Your music tastes, <Text span variant={'gradient'} inherit>visualized.</Text></Title>
                        </Center>
                    </Card>
                </Center>
            </Container>
    )
}

export default LoginPage