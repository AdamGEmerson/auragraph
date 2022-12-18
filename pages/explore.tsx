import getConfig from "next/config"
import {
    Title, Text, Center, Group, SimpleGrid, Paper, Badge,
    Divider, useMantineTheme, ActionIcon, HoverCard, TextInput, Button, Loader, ThemeIcon
} from "@mantine/core"
import React, { useEffect, useState } from "react";
import { Overpass } from "@next/font/google";
import {IconCompass, IconEye, IconEyeOff, IconInfoCircle, IconSearch} from "@tabler/icons";
import { User } from '@supabase/supabase-js'
import SingleArtistResponse = SpotifyApi.SingleArtistResponse;
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import ArtistCard from "../components/ArtistCard";
import EulerChart from "../components/EulerChart";
import topographyBackground from "../public/topography.svg";
import {useInputState} from "@mantine/hooks";

type Data = {
    artist?: SingleArtistResponse;
    error?: Error;
}

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

export default function Explore( ) {
    const theme = useMantineTheme();
    const [searchText, setSearchText] = useInputState('');
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [firstInput, setFirstInput] = useState(false);
    const [typingTimer, setTypingTimer] = useState<any>();
    let timer = 800;

    useEffect(() => {
        if (firstInput) {
            clearTimeout(typingTimer);
            setTypingTimer(setTimeout(autoSearch, timer));
        }
    }, [searchText]);

    function autoSearch() {
        console.log("Searching!");
        setLoading(true);
        // Get top artists
        fetch(`/api/find/${searchText}`, {method: 'GET'}).then((res) => {
            if (res.ok) {
                res.json().then(data => {
                    setArtists(data.artists.items);
                    setLoading(false);
                })
            } else {
                console.log("Request failed")
            }
        })
    }

    function updateSearchText(text: string) {
        if (!firstInput) {
            setFirstInput(true);
        }
        setSearchText(text);
    }

    return (
        <>
            <Group>
                <ThemeIcon size={64} variant={'light'} radius={'xl'} color={'cyan'}><IconCompass size={48}/></ThemeIcon>
                <Title order={1} variant={'gradient'} gradient={{from: theme.colors.cyan[5], to:theme.colors.yellow[3], deg:10}} my={"md"}>Explore</Title>
            </Group>
            <Paper p={'md'} my={'md'} sx={(theme) => ({
                backgroundColor: "transparent"
            })}>
                <Group mb={'md'}>
                    <Title order={2}> Search For An Artist </Title>
                </Group>
                <Text color={'dimmed'} mb={'xs'}> View your favorite artists auragraph </Text>
                <TextInput
                    autoFocus={true}
                    size={'xl'}
                    color={'cyan'}
                    radius={'lg'}
                    placeholder={"Magdalena Bay"}
                    value={searchText}
                    onChange={(e) => updateSearchText(e.target.value)}
                    icon={loading ? <Loader size={"xs"}/> : <IconSearch size={24}/>}/>
            <SimpleGrid cols={3} my={'md'} breakpoints={[
                { maxWidth: 2000, cols: 2, spacing: 'sm' },
                { maxWidth: 1500, cols: 1, spacing: 'sm' },
            ]}>
                {artists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} genres={artist.genres.map(genre => ({genre: genre, enabled: true}))}/>
                ))}
            </SimpleGrid>
            </Paper>
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