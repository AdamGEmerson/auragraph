import getConfig from "next/config"
import {
    Title, Text, Center, Group, SimpleGrid, Paper, Badge,
    Divider, useMantineTheme, ActionIcon, HoverCard, TextInput, Button, Loader, ThemeIcon
} from "@mantine/core"
import React, { useEffect, useState } from "react";
import { Overpass } from "@next/font/google";
import {IconCompass, IconEye, IconEyeOff, IconInfoCircle, IconQuestionMark, IconSearch} from "@tabler/icons";
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
}

export default function Explore( ) {
    const theme = useMantineTheme();
    const [searchText, setSearchText] = useInputState('');
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [firstInput, setFirstInput] = useState(false);
    const [typingTimer, setTypingTimer] = useState<any>();
    let timer = 1000;

    useEffect(() => {
        if (firstInput) {
            clearTimeout(typingTimer);
            setTypingTimer(setTimeout(autoSearch, timer));
        }
    }, [searchText]);

    function autoSearch() {
        console.log("Searching!");
        setLoading(true);
        // TODO: Call spotify api search endpoint and get results, then set loading to false.
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
                <ThemeIcon size={64} variant={'light'} radius={'xl'} color='yellow'><IconQuestionMark size={48}/></ThemeIcon>
                <Title order={1} color={theme.fn.rgba(theme.colors.yellow[7], .8)} my={"md"}>About</Title>
            </Group>
            <Paper p={'md'} my={'md'} sx={(theme) => ({
                backgroundColor: "transparent",
            })}>
                <Title order={2}>What is Auragraph?</Title>
                <Text size={'lg'}>
                    Auragraph is a web application for Spotify users designed by a music enthusiast, for music enthusiasts. We aim to help users visualize the relationships between their favorite artists by generating colorful, interactive euler diagrams that we call, you guessed it, auragraphs.
                    <br/> <br/>
                    Spotify recognizes <em><strong>over 5000</strong></em> unique genres of music. That's a lot to wade through! <br/><br/>
                    We hope that auragraph will enable people to better understand musical taxonomy while enabling the exploration and discovery of new sounds.
                </Text>
                <Divider my={'md'}/>
                <Title order={2}>How Does It Work?</Title>
                <Text size={'lg'}>
                Once you have logged in with your Spotify account (thanks Supabase!), your favorite artists are retrieved via the Spotify API. With your favorite artists in hand, we can get to work on generating your very own auragraph.
                <br/><br/>
                Spotify assigns each artist any number of genres, but for our purposes we only care about the genres where your favorite artists overlap. If we didn't cull the dataset your graph would be full of disjoint outliers. Lame!
                <br/><br/>
                After we have removed any outlying genres, the euler diagram is generated with D3 and venn.js.
                <br/><br/>
                Depending on how diverse your listening habits are, your auragraph might be quite dense and difficult to parse, but you can explore the chart by toggling genres with the button above your graph.
                </Text>
                <Divider my={'md'}/>
                <Title order={2}>Observations On The Graph</Title>
                <Text size={"lg"}>
                <ul>
                    <li>The genres most represented amongst your top artists will be the drawn largest.</li>
                    <li>Toggle genres off and on to find new relationships in your graph.</li>
                    <li>Most graphs will have one or two central genres, like "Pop", or "Rap".</li>
                    <li>If you turn the central genres off, your graph will become disjoint!.</li>
                    <li>Some genres will be represented as complete subsets of others. "Art Pop" and "Hyper Pop" for example.</li>
                </ul>
                </Text>


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