import getConfig from "next/config"
import {Box, Button, Title, Text, Center, Group, Container, Card, SimpleGrid, Paper, Badge} from "@mantine/core"
import {createRef, useEffect, useRef, useState} from "react";
import {Overpass} from "@next/font/google";
import {IconBrandSpotify, IconLogin, IconLogout} from "@tabler/icons";
import {SupabaseClient, User, UserResponse} from '@supabase/supabase-js'
import SingleArtistResponse = SpotifyApi.SingleArtistResponse;
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import Image from "next/image";
import musicIllustration from '../public/undraw_music.svg';
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import ArtistCard from "../components/ArtistCard";
import * as venn from "@upsetjs/venn.js";
import * as d3 from 'd3';

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

export const getServerSideProps: GetServerSideProps<{ user: User | null }> = async (context) =>  {
    const {serverRuntimeConfig, clientRuntimeConfig} = getConfig();
    const supabase = createServerSupabaseClient(context);
    const user = null
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        const {provider_token, provider_refresh_token, user} = session

        if ( provider_token && provider_refresh_token ) {

            console.log("Access token found, attempting to fetch Top Artists...")

            let spotifyApi = new SpotifyWebApi({
                clientId: serverRuntimeConfig.clientId,
                clientSecret: serverRuntimeConfig.clientSecret,
            });

            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);

            console.log(`The access token is: ${spotifyApi.getAccessToken()}`)

            try {
                const response = await spotifyApi.getMyTopArtists();
                return { props: { user, response } }
            } catch (e) {
                // Attempt to refresh and save the access token.
                await spotifyApi.refreshAccessToken();
                session.provider_token = spotifyApi.getAccessToken();
                session.provider_refresh_token = spotifyApi.getRefreshToken();
                await supabase.auth.setSession(session);

                // Try getting top artists again
                const response = await spotifyApi.getMyTopArtists();
                return { props: { user, response } }
            }
        }
    }

    return { props: { user } }

}

export default function Home( { user, response }:{ user: User | null; response: Response | null }  ) {
    const supabaseClient = useSupabaseClient()

    async function signInWithSpotify() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: 'playlist-read-private user-read-private user-top-read'
            }
        })
    }

    async function buildGenreSets(artists: Artist[]) {
        let singleGenres:Set<string> = new Set();
        let genres:{ sets:string[], size:number }[] = [];

        artists.forEach(artist => {
            // Push the intersections
            genres.push( {sets: artist.genres, size: 1} );

            // Build our set of genres
            artist.genres.forEach(genre => {
                singleGenres.add(genre);
            })
        })

        singleGenres.forEach(genre => {
            let count = 0;
            artists.forEach(artist => {
                if (artist.genres.includes(genre)) {
                    count ++;
                }
            })
            genres.push( {sets: [genre], size: count} );
        })

        console.log(JSON.stringify(genres, null, 2))
        const chart = venn.VennDiagram();
        // @ts-ignore
        d3.select('#venn').datum(genres).call(chart);
    }

    if ( user && response ) {

        if (response.body) {
            const payload = JSON.parse(JSON.stringify(response.body));
            const artists:Artist[] = payload.items;

            return (
                <>
                    <Title order={2}>Welcome, {user.user_metadata.name}!</Title>
                    <Title order={4} color={"dimmed"} my={'md'}>Your top artists</Title>
                    <SimpleGrid cols={3}>
                        {artists.map(artist => (
                            <ArtistCard key={artist.id} artist={artist} />
                        ))}
                    </SimpleGrid>
                    <Button onClick={() => buildGenreSets(artists)}>Get Chart</Button>
                    <div id="venn"></div>
                </>
            );
        }


    }
    if ( user )
        return (
            <>
                <Text>{`user: ${user.email}`}</Text>
                <Text> Could not fetch top artists.</Text>
            </>
        );

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
                    <Button size={'lg'} radius={'lg'} my={'md'} leftIcon={<IconBrandSpotify />} onClick={() => signInWithSpotify()}>Sign In</Button>
                </Group>
            </Container>
        </Center>
    )
}
