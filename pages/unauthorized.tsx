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
    SimpleGrid, Grid, MediaQuery
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import {
    IconAlertTriangle,
    IconBrandSpotify,
    IconCheck,
    IconCirclesRelation,
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
                        <Title order={smallScreen ? 1 : 2} variant={'gradient'} gradient={{from: theme.colors.teal[5], to:theme.colors.yellow[3], deg:60}}>auragraph</Title>
                        <Text sx={smallScreen ? {fontSize: "30px"} : {fontSize: "20px"}} weight={700} color={theme.colors.dark[2]} >[ ˈôrə-ɡraf ] • <em>noun</em> </Text>
                        <Divider my={'sm'}/>
                        <Text sx={smallScreen ? {fontSize: "24px"} : {fontSize: "18px"}} my={"md"} weight={600}>
                            {`A colorful map of an individual's music taste and the relationship between their favorite artists.`}
                        </Text>
                    </Card>
                </Center>
                <Container sx={{width:'80%'}}>
                    <Title order={3} mb={'md'} mx={'md'}>auragraph is currently in early access</Title>
                    <form onSubmit={form.onSubmit((values) => formSubmit(values))}>
                    <Grid px={'md'}>
                        <Grid.Col span={12}>
                            <Title order={2}>Request access to your personal auragraph below, and while you wait, check out <Text component={'a'} href={'/demo'} sx={{'&:hover': {textDecoration: "underline"}}} span c="teal" inherit>our demo.</Text></Title>
                        </Grid.Col>
                        <Grid.Col span={12}><Text>Please be sure to include the email associated with your spotify account.</Text></Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput withAsterisk size={smallScreen ? 'lg' : 'md'} placeholder={'First Name'} radius={'lg'} {...form.getInputProps('firstName')}></TextInput>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput withAsterisk size={smallScreen ? 'lg' : 'md'} placeholder={'Last Name'} radius={'lg'} {...form.getInputProps('lastName')}></TextInput>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <TextInput withAsterisk size={smallScreen ? 'lg' : 'md'} placeholder={'Your Spotify Account Email'} radius={'lg'} {...form.getInputProps('email')}></TextInput>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Button variant={"light"} leftIcon={<IconMailFast/>} size={smallScreen ? 'lg' : 'md'} radius={'lg'} type={'submit'} onClick={() => setFormLoading(true)} loading={formLoading && !form.errors}>Request Access</Button>
                            </Grid.Col>
                    </Grid>
                    </form>
                </Container>
            </Stack>
        </>
    )
}

export default LoginPage