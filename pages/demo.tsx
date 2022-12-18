import getConfig from "next/config"
import {
    Title, Text, Center, Group, SimpleGrid, Paper, Badge,
    Divider, useMantineTheme, ActionIcon, HoverCard, Stack, ThemeIcon, Button
} from "@mantine/core"
import React, { useEffect, useState } from "react";
import { Overpass } from "@next/font/google";
import {
    IconBrandSpotify,
    IconCirclesRelation,
    IconEye,
    IconEyeOff,
    IconInfoCircle,
    IconQuestionMark
} from "@tabler/icons";
import {createClient, User} from '@supabase/supabase-js'
import SingleArtistResponse = SpotifyApi.SingleArtistResponse;
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import ArtistCard from "../components/ArtistCard";
import EulerChart from "../components/EulerChart";
import topographyBackground from "../../public/topography.svg";
import {Database, Json} from "../types/supabase";
import {useMediaQuery} from "@mantine/hooks";

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
    external_urls: { spotify: string }
}

export const getServerSideProps = async ( context : GetServerSidePropsContext ) => {
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
    const supabaseClient = createServerSupabaseClient(context);
    const supabase = createClient<Database>(
        publicRuntimeConfig.databaseApiUrl,
        publicRuntimeConfig.databasePublicAnon
    );

    const userData = await supabase.from('Auragraph').select().eq('id', '7cf9e37d-39c6-4d3c-9c23-36876c144c04');
    if (userData.error || userData.data.length === 0) {
        return {
            props: {
                preload: false,
                auraData: null,
                artists: null,
                userID: null,
            }
        }
    } else {
        console.log("Preload time!")
        return {
            props: {
                preload: true,
                auraData: userData.data[0].aura_data,
                artists: userData.data[0].top_artists,
                userID: '7cf9e37d-39c6-4d3c-9c23-36876c144c04'
            }
        }
    }

    // if (session) {
    //     const {provider_token, provider_refresh_token, user} = session
    //
    //     if (provider_token && provider_refresh_token && user) {
    //
    //         console.log("Access token found, attempting to fetch Top Artists...")
    //
    //         let spotifyApi = new SpotifyWebApi({
    //             clientId: serverRuntimeConfig.clientId,
    //             clientSecret: serverRuntimeConfig.clientSecret,
    //         });
    //
    //         await spotifyApi.setAccessToken(provider_token);
    //         await spotifyApi.setRefreshToken(provider_refresh_token);
    //
    //         console.log(`The access token is: ${spotifyApi.getAccessToken()}`)
    //
    //         try {
    //             // Get top artists data from spotify API and parse it into the desired formats
    //             const {response, dataSet, genres} = await fetchAndBuildTopArtists(spotifyApi);
    //             return {props: {user, response, dataSet, genres}}
    //         } catch (e) {
    //             // Attempt to refresh and save the access token.
    //             await spotifyApi.refreshAccessToken();
    //             session.provider_token = spotifyApi.getAccessToken();
    //             session.provider_refresh_token = spotifyApi.getRefreshToken();
    //             await supabaseClient.auth.setSession(session);
    //
    //             // Try getting top artists again
    //             const {response, dataSet, genres} = await fetchAndBuildTopArtists(spotifyApi);
    //             return {props: {user, response, dataSet, genres}}
    //         }
    //     }
    // } else {
    //     return { props: {} }
    // }
}

// export default function AuragraphDemo( { preload, auraData, artists, userID }:{
//     preload: boolean
//     userID: string;
//     artists: {items: Artist[]} | null;
//     auraData: { size:number, sets:string[] }[] | null;
//     dataSet: { size:number, sets:string[] }[]; })
// {
//
//     // Values either null or populated based on preload
//     const [topArtists, setTopArtists] = useState<{ items: Artist[] } | null>(artists);
//     const [rawData, setRawData] = useState< {size: number, sets: string[]}[] | null >(auraData);
//
//     // Need to construct genres, will begin as null;
//     const [genres, setGenres] = useState<{genre: string, enabled: boolean}[]>([]);
//     const [currentDataSet, setCurrentDataset] = useState<{size: number, sets: string[]}[]>();
//     const theme = useMantineTheme();
//     let artistArray: Artist[];
//
//     // Start by fetching the top artists from spotify
//     useEffect(() => {
//         if (!preload) {
//             console.log('kicking off effect chain')
//             // Get top artists
//             fetch(`/api/get/topArtists`, {method: 'GET'}).then((res) => {
//                 if (res.ok) {
//                     res.json().then(data => {
//                         setTopArtists(data)
//                     })
//                 } else {
//                     console.log("Request failed")
//                 }
//             })
//         }
//     }, []);
//
//     // When top artists are loaded, build our dataset
//     useEffect(() => {
//         if (!preload) {
//             console.log('artists set, building rawData')
//             buildDataset();
//         }
//     }, [topArtists]);
//
//     // Set current data and build genres after rawData loads
//     useEffect(() => {
//         console.log('rawData set, building genres')
//         buildGenres()
//         updateDataSet()
//     }, [rawData]);
//
//     // Finally, let's save the built data to the db for next time.
//     useEffect(() => {
//         if (!preload) {
//             fetch(`/api/postAura`, {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     aura: rawData,
//                     id: userID,
//                     topArtists: topArtists,
//                     genres: genres,
//                 })
//             }).then((res) => {
//                 if ( res.ok ) {
//                     res.json().then(data => {
//                         console.log(data)
//                     })
//                 } else {
//                     console.log("Request failed")
//                 }
//             })
//         }
//     }, [genres]);
//
//     async function buildDataset() {
//         if (topArtists && topArtists.items) {
//             const artists: Artist[] = topArtists?.items;
//             let dataSet = await buildGenreSets(artists)
//             dataSet = dataSet.sort((a, b) => b.size - a.size)
//             setRawData(dataSet);
//         }
//     }
//
//     async function buildGenres() {
//         const genres: { genre: string; enabled: boolean }[] = [];
//         let count = 0;
//         rawData?.forEach(item => {
//             if (item.sets.length == 1) {
//                 genres.push({genre: item.sets[0], enabled: true})
//                 count++;
//             }
//         })
//         setGenres(genres)
//     }
//
//     async function buildGenreSets(artists: Artist[]) {
//         let genres: Set<string> = new Set();
//         let newDataSet: { size: number, sets: string[] }[] = [];
//
//         // Create a set of unique genres
//         artists.forEach(artist => {
//             artist.genres.forEach(genre => {
//                 // Stringify to avoid duplicates
//                 genres.add(JSON.stringify([genre]));
//                 artist.genres.forEach(g2 => {
//                     if (g2 != genre)
//                         genres.add(JSON.stringify([genre, g2]))
//                     //artist.genres.forEach(g3 => genres.add(JSON.stringify([genre, g2, g3])))
//                 })
//             })
//         })
//         // Rebuild into proper array with parse
//         let genreArray: string[][] = [];
//         genres.forEach(genre => {
//             genreArray.push(JSON.parse(genre))
//         })
//
//         // Add unique genres to dataset with their correct counts
//         genreArray.forEach(genre => {
//             newDataSet.push({
//                 size: artists.filter(artist => genre.every(val => artist.genres.includes(val))).length * 100,
//                 sets: genre
//             })
//         })
//
//         newDataSet = newDataSet.filter(item => (item.sets.length > 0 && item.size > 100));
//         return newDataSet;
//     }
//
//     function toggleGenre(genre: string) {
//         console.log(`Toggling: ${genre}`)
//         const tempGenres = genres;
//         const i = tempGenres.findIndex(item => item.genre == genre);
//         tempGenres[i].enabled = !tempGenres[i].enabled;
//         setGenres(tempGenres);
//         updateDataSet();
//     }
//
//     function getCurrentDataSet() {
//         return currentDataSet
//     }
//
//     function saveData() {
//         fetch(`/api/postAura`, { method: 'POST', body: JSON.stringify({aura: currentDataSet, id: userID, topArtists: topArtists})}).then((res) => {
//             if ( res.ok ) {
//                 res.json().then(data => {
//                     console.log(data)
//                 })
//             } else {
//                 console.log("Request failed")
//             }
//         })
//     }
//
//     function updateDataSet() {
//         const disabledGenres = genres.filter(genre => (!genre.enabled));
//         console.log(JSON.stringify(disabledGenres, null, 2))
//         // Filter out items with a disabled genre
//         const updatedDataSet = rawData?.filter(isGenreEnabled)
//         setCurrentDataset(updatedDataSet)
//     }
//
//     function isGenreEnabled(item: {size: number, sets: string[]}) {
//         const disabledGenres = genres.filter(genre => (!genre.enabled));
//         let genreEnabled = true;
//         disabledGenres.forEach(genre => {
//             if (item.sets.includes(genre.genre)) {
//                 console.log(`Found a hit on ${genre} and set ${item.sets}`)
//                 genreEnabled = false;
//             }
//         })
//         return genreEnabled;
//     }
//
//     if (topArtists) {
//         console.log(topArtists)
//         artists = JSON.parse(JSON.stringify(topArtists)).items;
//         return (
//             <>
//                 <Group>
//                     <ThemeIcon size={64} variant={'light'} radius={'xl'} color='teal'><IconCirclesRelation
//                         size={48}/></ThemeIcon>
//                     <Title order={1} variant={'gradient'}>Your Auragraph</Title>
//                     <HoverCard width={360} shadow="md">
//                         <HoverCard.Target>
//                             <ActionIcon size={'lg'} color={'green'} variant={"subtle"} radius={'xl'}
//                                         sx={{'&:hover': {cursor: 'default'}}}>
//                                 <IconInfoCircle/>
//                             </ActionIcon>
//                         </HoverCard.Target>
//                         <HoverCard.Dropdown>
//                             <Title order={4}>About Auragraphs</Title>
//                             <Text size="sm" mt={'xs'}>
//                                 Auragraphs are an attempt to visualize the relationship between your favorite artists
//                                 and their music.
//                             </Text>
//                             <Text size="sm" mt={'xs'}>
//                                 Your auragraph is a mapping of your top 20 artists and their genres (according to
//                                 spotify).
//                             </Text>
//
//                             <Text size="sm" mt={'xs'}>
//                                 Click the genre buttons above the graph to explore!
//                             </Text>
//                         </HoverCard.Dropdown>
//                     </HoverCard>
//                 </Group>
//                 <Text weight={700} size={'xl'} mx={"md"} mb={"md"} color={'dimmed'}>Powered by Spotify <IconBrandSpotify/></Text>
//                 <Text weight={700} size={'xl'} mx={"md"}>Demo User</Text>
//                 <Paper p={'md'} my={'md'} sx={(theme) => ({
//                     backgroundColor: "transparent",
//                 })}>
//                     <Text sx={{fontFamily: overpass.style.fontFamily}} color={'dimmed'} mb={'xs'}> Toggle your genres to
//                         explore the chart </Text>
//                     <Group spacing={"xs"} sx={{width: "80%"}} mb={'md'}>
//                         {genres ? genres.map(genre => (
//                                 <Badge key={genre.genre}
//                                        leftSection={<Center>{genre.enabled ? <IconEye size={18}/> :
//                                            <IconEyeOff size={18}/>}</Center>}
//                                        color={genre.enabled ? 'green' : 'dark'}
//                                        radius={'xl'}
//                                        size={'lg'}
//                                        sx={(theme) => ({
//                                            cursor: "pointer",
//                                            '&:hover': {
//                                                backgroundColor: theme.colors.green[2],
//                                                color: theme.colors.dark[3]
//                                            }
//                                        })}
//                                        onClick={() => toggleGenre(genre.genre)}>{genre.genre}</Badge>
//                             ))
//                             : ''}
//                     </Group>
//                     {currentDataSet ? <EulerChart data={currentDataSet}/> : ''}
//                 </Paper>
//                 <Divider my={"md"}></Divider>
//                 <Title sx={{fontFamily: overpass.style.fontFamily}} color={'teal'} order={2}>Your Artists</Title>
//                 <Text sx={{fontFamily: overpass.style.fontFamily}} color={'dimmed'} mb={'md'}>The artists that makeup
//                     your auragraph</Text>
//                 <SimpleGrid cols={3} breakpoints={[
//                     {maxWidth: 2000, cols: 2, spacing: 'sm'},
//                     {maxWidth: 1500, cols: 1, spacing: 'sm'},
//                 ]}>
//                     {topArtists ? topArtists.items.map(artist => (
//                         <ArtistCard key={artist.id} artist={artist} genres={genres}/>
//                     )) : <></> }
//                 </SimpleGrid>
//             </>
//         );
//     }
// }

export default function AuragraphDemo( { preload, auraData, artists, user }:{
    preload: boolean
    user: User;
    artists: {items: Artist[]} | null;
    auraData: { size:number, sets:string[] }[] | null;
    dataSet: { size:number, sets:string[] }[]; }) {

    // Values either null or populated based on preload
    const [topArtists, setTopArtists] = useState<{ items: Artist[] } | null>(artists);
    const [rawData, setRawData] = useState< {size: number, sets: string[]}[] | null >(auraData);

    // Need to construct genres, will begin as null;
    const [genres, setGenres] = useState<{genre: string, enabled: boolean}[]>([]);
    const [currentDataSet, setCurrentDataset] = useState<{size: number, sets: string[]}[]>();
    const theme = useMantineTheme();
    const smallScreen = useMediaQuery(`(min-width: ${theme.breakpoints.sm.toString()}px)`);
    const mediumScreen = useMediaQuery(`(min-width: ${theme.breakpoints.md.toString()}px)`);
    let artistArray: Artist[];

    // Start by fetching the top artists from spotify
    useEffect(() => {
        if (!preload) {
            console.log('kicking off effect chain')
            // Get top artists
            fetch(`/api/get/topArtists`, {method: 'GET'}).then((res) => {
                if (res.ok) {
                    res.json().then(data => {
                        setTopArtists(data)
                    })
                } else {
                    console.log("Request failed")
                }
            })
        }
    }, []);

    // When top artists are loaded, build our dataset
    useEffect(() => {
        if (!preload) {
            console.log('artists set, building rawData')
            buildDataset();
        }
    }, [topArtists]);

    // Set current data and build genres after rawData loads
    useEffect(() => {
        console.log('rawData set, building genres')
        buildGenres()
        updateDataSet()
    }, [rawData]);

    // Finally, let's save the built data to the db for next time.
    useEffect(() => {
        fetch(`/api/postAura`, {
            method: 'POST',
            body: JSON.stringify({
                aura: rawData,
                id: user,
                topArtists: topArtists,
                genres: genres,
            })
        }).then((res) => {
            if ( res.ok ) {
                res.json().then(data => {
                    console.log(data)
                })
            } else {
                console.log("Request failed")
            }
        })
    }, [genres]);

    async function buildDataset() {
        if (topArtists && topArtists.items) {
            const artists: Artist[] = topArtists?.items;
            let dataSet = await buildGenreSets(artists)
            dataSet = dataSet.sort((a, b) => b.size - a.size)
            setRawData(dataSet);
        }
    }

    async function buildGenres() {
        const genres: { genre: string; enabled: boolean }[] = [];
        let count = 0;
        rawData?.forEach(item => {
            if (item.sets.length == 1) {
                genres.push({genre: item.sets[0], enabled: true})
                count++;
            }
        })
        setGenres(genres)
    }

    async function buildGenreSets(artists: Artist[]) {
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
        return newDataSet;
    }

    function toggleGenre(genre: string) {
        console.log(`Toggling: ${genre}`)
        const tempGenres = genres;
        const i = tempGenres.findIndex(item => item.genre == genre);
        tempGenres[i].enabled = !tempGenres[i].enabled;
        setGenres(tempGenres);
        updateDataSet();
    }

    function getCurrentDataSet() {
        return currentDataSet
    }

    function saveData() {
        fetch(`/api/postAura`, { method: 'POST', body: JSON.stringify({aura: currentDataSet, id: user.id, topArtists: topArtists})}).then((res) => {
            if ( res.ok ) {
                res.json().then(data => {
                    console.log(data)
                })
            } else {
                console.log("Request failed")
            }
        })
    }

    function updateDataSet() {
        const disabledGenres = genres.filter(genre => (!genre.enabled));
        console.log(JSON.stringify(disabledGenres, null, 2))
        // Filter out items with a disabled genre
        const updatedDataSet = rawData?.filter(isGenreEnabled)
        setCurrentDataset(updatedDataSet)
    }

    function isGenreEnabled(item: {size: number, sets: string[]}) {
        const disabledGenres = genres.filter(genre => (!genre.enabled));
        let genreEnabled = true;
        disabledGenres.forEach(genre => {
            if (item.sets.includes(genre.genre)) {
                console.log(`Found a hit on ${genre} and set ${item.sets}`)
                genreEnabled = false;
            }
        })
        return genreEnabled;
    }

    function toggleAll(genres: { genre: string; enabled: boolean }[]) {
        genres.forEach(genre => toggleGenre(genre.genre));
    }

    if (topArtists) {
        console.log(topArtists)
        artists = JSON.parse(JSON.stringify(topArtists)).items;
        return (
            <>
                <Group>
                    <ThemeIcon size={64} variant={'light'} radius={'xl'} color='teal'><IconCirclesRelation
                        size={48}/></ThemeIcon>
                    <Stack spacing={'xs'}>
                        <Group>
                            <Title order={mediumScreen ? 1 : 2} variant={'gradient'}>Your Auragraph</Title>
                            <HoverCard width={360} shadow="md">
                                <HoverCard.Target>
                                    <ActionIcon size={'lg'} color={'green'} variant={"subtle"} radius={'xl'}
                                                sx={{'&:hover': {cursor: 'default'}}}>
                                        <IconInfoCircle/>
                                    </ActionIcon>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Title order={4}>About Auragraphs</Title>
                                    <Text size="sm" mt={'xs'}>
                                        Auragraphs are an attempt to visualize the relationship between your favorite artists
                                        and their music.
                                    </Text>
                                    <Text size="sm" mt={'xs'}>
                                        Your auragraph is a mapping of your top 20 artists and their genres (according to
                                        spotify).
                                    </Text>

                                    <Text size="sm" mt={'xs'}>
                                        Click the genre buttons above the graph to explore!
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </Group>
                        <Text weight={700} size={'xl'} mx={"md"}>Demo User</Text>
                    </Stack>
                </Group>


                <Paper p={'md'} my={'md'} sx={(theme) => ({
                    backgroundColor: "transparent",
                })}>
                    <Text sx={{fontFamily: overpass.style.fontFamily}} color={'dimmed'} mb={'xs'}> Toggle your genres to
                        explore the chart </Text>
                    <Group spacing={"xs"} sx={{width: "80%"}} mb={'md'}>
                        {genres ? genres.map(genre => (
                                <Badge key={genre.genre}
                                       leftSection={<Center>{genre.enabled ? <IconEye size={18}/> :
                                           <IconEyeOff size={18}/>}</Center>}
                                       color={genre.enabled ? 'green' : 'dark'}
                                       radius={'xl'}
                                       size={mediumScreen ? 'lg' : 'sm'}
                                       sx={(theme) => ({
                                           cursor: "pointer",
                                           '&:hover': {
                                               backgroundColor: theme.colors.green[2],
                                               color: theme.colors.dark[3]
                                           }
                                       })}
                                       onClick={() => toggleGenre(genre.genre)}>{genre.genre}</Badge>
                            ))  : '' }
                            <Badge
                                color='cyan'
                                 radius={'xl'}
                                 size={mediumScreen ? 'lg' : 'sm'}
                                 sx={(theme) => ({
                                     cursor: "pointer",
                                     '&:hover': {
                                         backgroundColor: theme.colors.cyan[2],
                                         color: theme.colors.dark[3]
                                     }
                                 })}
                                     onClick={() => toggleAll(genres)}>Toggle All</Badge>
                    </Group>
                    {currentDataSet ? <EulerChart data={currentDataSet}/> : ''}
                </Paper>
                <Text weight={700} size={'md'} mx={"md"} mb={"md"}>Powered by Spotify</Text>
                <Divider my={"md"}></Divider>
                <Title sx={{fontFamily: overpass.style.fontFamily}} order={2}>Your Artists</Title>
                <Text sx={{fontFamily: overpass.style.fontFamily}} color={'dimmed'} mb={'md'}>The artists that makeup
                    your auragraph</Text>
                <SimpleGrid cols={3} breakpoints={[
                    {maxWidth: 2000, cols: 2, spacing: 'sm'},
                    {maxWidth: 1000, cols: 1, spacing: 'sm'},
                ]}>
                    {topArtists ? topArtists.items.map(artist => (
                        <ArtistCard key={artist.id} artist={artist} genres={genres}/>
                    )) : <></> }
                </SimpleGrid>
            </>
        );
    }
}
