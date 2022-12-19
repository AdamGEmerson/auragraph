import { useRouter } from 'next/router'
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {User} from "@supabase/supabase-js";
import getConfig from "next/config";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import {
    ActionIcon, Avatar, Badge, Button, Center, Container, Divider,
    Group, HoverCard, Paper, SimpleGrid,
    Stack,
    Text,
    Title,
    Tooltip, useMantineTheme
} from "@mantine/core";
import {IconBrandSpotify, IconEye, IconEyeOff, IconInfoCircle} from "@tabler/icons";
import React, {useEffect, useState} from "react";
import {useMediaQuery} from "@mantine/hooks";
import EulerChart from "../../components/EulerChart";
import ArtistCard from "../../components/ArtistCard";

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
    external_urls: {spotify: string}
}

export const getServerSideProps = async (context : GetServerSidePropsContext ) => {
    const { serverRuntimeConfig } = getConfig();
    const supabase = createServerSupabaseClient(context);
    const artistID = context.params?.artistID;

    // Check if we have a session
    // const {
    //     data: {session},
    // } = await supabase.auth.getSession()
    //
    // if (session) {
    //     console.log("Session Found")
    //     const {provider_token, provider_refresh_token, user} = session
    //
    //     let spotifyApi = new SpotifyWebApi({
    //         clientId: serverRuntimeConfig.clientId,
    //         clientSecret: serverRuntimeConfig.clientSecret,
    //     });
    //
    //     if (provider_token && provider_refresh_token && artistID) {
    //         await spotifyApi.setAccessToken(provider_token);
    //         await spotifyApi.setRefreshToken(provider_refresh_token);
    //         if (typeof artistID === "string") {
    //             const artistData = await spotifyApi.getArtist(artistID);
    //             const artistTopSongs = await spotifyApi.getArtistTopTracks(artistID, "US");
    //             return { props: { artistData, artistTopSongs } }
    //         }
    //     }
    // }

    let spotifyApi = new SpotifyWebApi({
        clientId: serverRuntimeConfig.clientId,
        clientSecret: serverRuntimeConfig.clientSecret,
    });

    const auth = await spotifyApi.clientCredentialsGrant();
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(auth.body['access_token']);

    if (typeof artistID === "string") {
        try {
            const artistData = await spotifyApi.getArtist(artistID);
            const artistTopSongs = await spotifyApi.getArtistTopTracks(artistID, "US");
            const relatedArtists = await spotifyApi.getArtistRelatedArtists(artistID);
            console.log(relatedArtists)
            return { props: { relatedArtists, artistData, artistTopSongs } }
        } catch (e) {
            // Attempt to refresh and save the access token.
            return { props: { relatedArtists: null, artistData: null, artistTopSongs: null } }
        }
    }

    // return { props: { artistData: null, artistTopSongs: null } }
}


const ArtistPage = ( { relatedArtists, artistData, artistTopSongs }:{relatedArtists: Response; artistData: Response; artistTopSongs: Response;}) => {
    const router = useRouter()
    const { artistID } = router.query
    const artist = JSON.parse(JSON.stringify(artistData.body));
    const theme = useMantineTheme();
    const preload = false;
    const [topArtists, setTopArtists] = useState<{ artists: Artist[] } | null>(JSON.parse(JSON.stringify(relatedArtists.body)));
    const [rawData, setRawData] = useState< {size: number, sets: string[]}[] | null >();
    // Need to construct genres, will begin as null;
    const [genres, setGenres] = useState<{genre: string, enabled: boolean}[]>([]);
    const [currentDataSet, setCurrentDataset] = useState<{size: number, sets: string[]}[]>();
    const smallScreen = useMediaQuery(`(min-width: ${theme.breakpoints.sm.toString()}px)`);
    const mediumScreen = useMediaQuery(`(min-width: ${theme.breakpoints.md.toString()}px)`);
    let artistArray: Artist[];

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
    // useEffect(() => {
    //     fetch(`/api/postAura`, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             aura: rawData,
    //             id: user.id,
    //             topArtists: topArtists,
    //             genres: genres,
    //         })
    //     }).then((res) => {
    //         if ( res.ok ) {
    //             res.json().then(data => {
    //                 console.log(data)
    //             })
    //         } else {
    //             console.log("Request failed")
    //         }
    //     })
    // }, [genres]);

    async function buildDataset() {
        if (topArtists && topArtists.artists) {
            const artists: Artist[] = topArtists?.artists;
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

    function updateDataSet() {
        const disabledGenres = genres.filter(genre => (!genre.enabled));
        console.log(JSON.stringify(disabledGenres, null, 2))
        // Filter out items with a disabled genre
        const updatedDataSet = rawData?.filter(isGenreEnabled)
        setCurrentDataset(updatedDataSet)
    }

    function toggleAll(genres: { genre: string; enabled: boolean }[]) {
        genres.forEach(genre => toggleGenre(genre.genre));
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

    return (
        <>
        <Group p={'md'}>
            <Avatar
                sx={{minHeight: "200px", minWidth: "200px", borderRadius:"84px"}}
                radius={"xl"}
                src={artist.images[0] ? artist.images[0].url : ''}
            />
            <Stack>
                <Group>
                    <Title order={1}>{artist.name}</Title>
                    <HoverCard width={360} shadow="md">
                        <HoverCard.Target>
                            <ActionIcon size={'lg'} color={'green'} variant={"subtle"} radius={'xl'}
                                        sx={{'&:hover': {cursor: 'default'}}}>
                                <IconInfoCircle/>
                            </ActionIcon>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Title order={4}>About Artist Auragraphs</Title>
                            <Text size="sm" mt={'xs'}>
                                Auragraphs are an attempt to visualize the relationship between your favorite artists
                                and their music.
                            </Text>
                            <Text size="sm" mt={'xs'}>
                                An artist auragraph is a mapping of related artists and their genres (according to
                                spotify).
                            </Text>

                            <Text size="sm" mt={'xs'}>
                                Click the genre buttons above the graph to explore!
                            </Text>
                        </HoverCard.Dropdown>
                    </HoverCard>
                </Group>
                <Group>
                {artist.genres.map((genre: string) => (
                    <Tooltip color={theme.colors.dark[3]} key={genre} label={genre} sx={{textTransform: 'capitalize'}}>
                        <Badge size={'lg'}> {genre} </Badge>
                    </Tooltip>
                ))}
                </Group>
                <Group spacing={'lg'} position={'left'}>
                    <div><Title order={3}>Followers</Title><Text>{artist.followers.total}</Text></div>
                    <div><Title order={3}>Popularity</Title><Text>{artist.popularity}</Text></div>
                    <Button component={'a'} href={artist.external_urls.spotify} color={'teal'} radius={'lg'} leftIcon={<IconBrandSpotify/>}>View on Spotify</Button>
                </Group>
            </Stack>
        </Group>
        <Paper p={'md'} my={'md'} sx={(theme) => ({
                backgroundColor: "transparent",
            })}>
                <Text color={'dimmed'} mb={'xs'}> Toggle genres to
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
                        ))
                        : ''}
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
            <Title order={2}>{`${artist.name}'s related artists`}</Title>
            <Text color={'dimmed'} mb={'md'}>{`The artists that makeup
                ${artist.name}'s auragraph`}</Text>
            <SimpleGrid cols={3} breakpoints={[
                {maxWidth: 2000, cols: 2, spacing: 'sm'},
                {maxWidth: 1000, cols: 1, spacing: 'sm'},
            ]}>
                {topArtists ? topArtists.artists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} genres={genres}/>
                )) : <></> }
            </SimpleGrid>

        </>
    );
}

export default ArtistPage;