import { useRouter } from 'next/router'
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {User} from "@supabase/supabase-js";
import getConfig from "next/config";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import SpotifyWebApi from "spotify-web-api-node";
import {
    ActionIcon, Avatar, Badge, Button, Center,
    Group, HoverCard, Paper,
    Stack,
    Text,
    Title,
    Tooltip, useMantineTheme
} from "@mantine/core";
import {IconBrandSpotify, IconInfoCircle} from "@tabler/icons";
import React from "react";

export const getServerSideProps = async (context : GetServerSidePropsContext ) => {
    const { serverRuntimeConfig } = getConfig();
    const supabase = createServerSupabaseClient(context);
    const artistID = context.params?.artistID;

    // Check if we have a session
    const {
        data: {session},
    } = await supabase.auth.getSession()

    if (session) {
        console.log("Session Found")
        const {provider_token, provider_refresh_token, user} = session

        let spotifyApi = new SpotifyWebApi({
            clientId: serverRuntimeConfig.clientId,
            clientSecret: serverRuntimeConfig.clientSecret,
        });

        if (provider_token && provider_refresh_token && artistID) {
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);
            if (typeof artistID === "string") {
                const artistData = await spotifyApi.getArtist(artistID);
                const artistTopSongs = await spotifyApi.getArtistTopTracks(artistID, "US");
                return { props: { artistData, artistTopSongs } }
            }
        }
    }
    return { props: { artistData: null, artistTopSongs: null } }
}


const ArtistPage = ( { artistData, artistTopSongs }:{artistData: Response; artistTopSongs: Response;}) => {
    const router = useRouter()
    const { artistID } = router.query
    const artist = JSON.parse(JSON.stringify(artistData.body));
    const theme = useMantineTheme();

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
        <Paper
            id={"venn"}
            radius={"xl"}
            withBorder
            sx={(theme) => ({
                height: 600,
                marginTop: "12px",
                backgroundColor: theme.fn.rgba(theme.colors.dark[4], 0.35),
                backdropFilter: "blur( 2px )",
            })}
        >
            <Center>
                <Title order={3}>Artist Auragraphs coming soon</Title>
            </Center>
        </Paper>
    </>
    );
}

export default ArtistPage;