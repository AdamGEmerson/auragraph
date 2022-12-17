import getConfig from "next/config"
import {
    Title, Text, Center, Group, SimpleGrid, Paper, Badge,
    Divider, useMantineTheme, ActionIcon, HoverCard, Stack, ThemeIcon
} from "@mantine/core"
import React, { useEffect, useState } from "react";
import { Overpass } from "@next/font/google";
import {IconCirclesRelation, IconEye, IconEyeOff, IconInfoCircle, IconQuestionMark} from "@tabler/icons";
import { User } from '@supabase/supabase-js'
import SingleArtistResponse = SpotifyApi.SingleArtistResponse;
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import ArtistCard from "../components/ArtistCard";
import EulerChart from "../components/EulerChart";
import topographyBackground from "../public/topography.svg";

type Data = {
    artist?: SingleArtistResponse;
    error?: Error;
}

const overpass = Overpass({
    weight: '500',
    subsets: ['latin']
})

type ArtistImage = {
    height: number,
    width: number,
    url: string
}

type Artist = {
    name: string,
    id: string,
    images: ArtistImage[],
    popularity: number,
    genres: string[],
}

export const getServerSideProps: GetServerSideProps<{ user: User | null }> = async (context) => {
    const { serverRuntimeConfig } = getConfig();
    const supabase = createServerSupabaseClient(context);

    async function fetchAndBuildTopArtists(spotifyApi: SpotifyWebApi) {
        const response = await spotifyApi.getMyTopArtists();
        const payload = JSON.parse(JSON.stringify(response.body));
        const artists: Artist[] = payload.items;
        let dataSet = await buildGenreSetsVennJS(artists)
        dataSet = dataSet.sort((a, b) => b.size - a.size)
        const genres: { genre: string; enabled: boolean }[] = [];
        let count = 0;
        dataSet.forEach(item => {
            if (item.sets.length == 1) {
                genres.push({genre: item.sets[0], enabled: true })
                count ++;
            }
        })
        return {response, dataSet, genres}
    }

    async function buildGenreSetsVennJS(artists: Artist[]) {
        let genres: Set<string> = new Set();
        let newDataSet: { size: number, sets: string[] }[] = [];

        // Create a set of unique genres
        artists.forEach(artist => {
            artist.genres.forEach(genre => {
                // Stringify to avoid duplicates
                genres.add(JSON.stringify([genre]));
                artist.genres.forEach(g2 => {
                    if (g2 != genre)
                        genres.add(JSON.stringify([genre, g2]))
                    //artist.genres.forEach(g3 => genres.add(JSON.stringify([genre, g2, g3])))
                })
            })
        })
        // Rebuild into proper array with parse
        let genreArray: string[][] = [];
        genres.forEach(genre => {
            genreArray.push(JSON.parse(genre))
        })

        // Add unique genres to dataset with their correct counts
        genreArray.forEach(genre => {
            newDataSet.push({
                size: artists.filter(artist => genre.every(val => artist.genres.includes(val))).length * 100,
                sets: genre
            })
        })

        newDataSet = newDataSet.filter(item => (item.sets.length > 0 && item.size > 100));
        console.log(newDataSet);
        return newDataSet;
    }

    // Check if we have a session
    const {
        data: {session},
    } = await supabase.auth.getSession()

    if (session) {
        console.log("Session Found")
        const {provider_token, provider_refresh_token, user} = session

        if (provider_token && provider_refresh_token) {

            console.log("Access token found, attempting to fetch Top Artists...")

            let spotifyApi = new SpotifyWebApi({
                clientId: serverRuntimeConfig.clientId,
                clientSecret: serverRuntimeConfig.clientSecret,
            });

            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);

            console.log(`The access token is: ${spotifyApi.getAccessToken()}`)

            try {
                // Get top artists data from spotify API and parse it into the desired formats
                const {response, dataSet, genres} = await fetchAndBuildTopArtists(spotifyApi);
                return {props: {user, response, dataSet, genres}}
            } catch (e) {
                // Attempt to refresh and save the access token.
                await spotifyApi.refreshAccessToken();
                session.provider_token = spotifyApi.getAccessToken();
                session.provider_refresh_token = spotifyApi.getRefreshToken();
                await supabase.auth.setSession(session);

                // Try getting top artists again
                const {response, dataSet, genres} = await fetchAndBuildTopArtists(spotifyApi);
                return {props: {user, response, dataSet, genres}}
            }
        } else {
            console.log("No provider token")
            return {
                redirect: { destination: '/', permanent: false},
            }
        }
    }
    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    }
}

export default function Auragraph( { user, response, dataSet, genres }:{
    user: User;
    response: Response;
    dataSet: { size:number, sets:string[] }[];
    genres: { genre: string; enabled: boolean }[]}  ) {
    const [genresEnabled, setGenresEnabled] = useState(genres);
    const [currentDataSet, setCurrentDataset] = useState(dataSet);
    const theme = useMantineTheme();

    useEffect(() => {
        updateDataSet()
    }, []);

    function toggleGenre(genre: string) {
        console.log(`Toggling: ${genre}`)
        const tempGenres = genresEnabled;
        const i = tempGenres.findIndex(item => item.genre == genre);
        tempGenres[i].enabled = !tempGenres[i].enabled;
        setGenresEnabled(tempGenres);
        updateDataSet();
    }

    function getCurrentDataSet() {
        return currentDataSet
    }

    function updateDataSet() {
        const disabledGenres = genresEnabled.filter(genre => (!genre.enabled));
        console.log(JSON.stringify(disabledGenres, null, 2))
        // Filter out items with a disabled genre
        const updatedDataSet = dataSet.filter(isGenreEnabled)
        setCurrentDataset(updatedDataSet)
        console.log(currentDataSet)
    }

    function isGenreEnabled(item: {size: number, sets: string[]}) {
        const disabledGenres = genresEnabled.filter(genre => (!genre.enabled));
        let genreEnabled = true;
        disabledGenres.forEach(genre => {
            if (item.sets.includes(genre.genre)) {
                console.log(`Found a hit on ${genre} and set ${item.sets}`)
                genreEnabled = false;
            }
        })
        return genreEnabled;
    }

    const payload = JSON.parse(JSON.stringify(response.body));
    const artists:Artist[] = payload.items;

    return (
        <>
            <Group>
                <ThemeIcon size={64} variant={'light'} radius={'xl'} color='teal'><IconCirclesRelation size={48}/></ThemeIcon>
                <Title order={1} color={theme.fn.rgba(theme.colors.teal[7], .8)} my={'md'}>Your Auragraph</Title>
            </Group>
            <Text weight={700} size={'xl'} mx={"md"}>{user.user_metadata.name}</Text>
            <Paper p={'md'} my={'md'} sx={(theme) => ({
                    backgroundColor: "transparent",
            })}>
                <Text sx={{fontFamily: overpass.style.fontFamily}} color={'dimmed'} mb={'xs'}> Toggle your genres to explore the chart </Text>
                <Group spacing={"xs"} sx={{width: "80%"}} mb={'md'}>
                {genresEnabled ? genresEnabled.map(genre => (
                        <Badge key={genre.genre}
                               leftSection={<Center>{genre.enabled ? <IconEye size={18}/> : <IconEyeOff size={18}/>}</Center>}
                               color={genre.enabled ? 'green' : 'dark'}
                               radius={'xl'}
                               size={'lg'}
                               sx={(theme) => ({
                                   cursor: "pointer",
                                   '&:hover': {
                                       backgroundColor: theme.colors.green[2],
                                       color: theme.colors.dark[3]
                                   }
                                })}
                               onClick={() => toggleGenre(genre.genre)}>{genre.genre}</Badge>
                    ))
                    : ''}
                </Group>
                { currentDataSet ? <EulerChart data={currentDataSet}/> : ''}
            </Paper>
            <Divider my={"md"}></Divider>
            <Title sx={{fontFamily: overpass.style.fontFamily}} color={'teal'} order={2}>Your Artists</Title>
            <Text sx={{fontFamily: overpass.style.fontFamily}} color={'dimmed'} mb={'md'}>The artists that makeup your auragraph</Text>
            <SimpleGrid cols={3} breakpoints={[
                { maxWidth: 2000, cols: 2, spacing: 'sm' },
                { maxWidth: 1500, cols: 1, spacing: 'sm' },
            ]}>
                {artists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} genres={genres}/>
                ))}
            </SimpleGrid>
        </>
    );
    // return (
    //     <Center style={{height: 600}}>
    //         <Container size={"md"}>
    //             <Group>
    //                 <Image src={musicIllustration} alt={"Music Illustration"} width={300} height={300}/>
    //             </Group>
    //             <Group>
    //                 <Title order={3} color={'dimmed'}>Sign in to spotify to get started...</Title>
    //             </Group>
    //             <Group position={'center'}>
    //                 <Button size={'lg'} radius={'lg'} my={'md'} leftIcon={<IconBrandSpotify />} onClick={() => signInWithSpotify()}>Sign In</Button>
    //             </Group>
    //         </Container>
    //     </Center>
    // )
}
