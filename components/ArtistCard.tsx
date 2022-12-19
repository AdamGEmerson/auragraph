import React from 'react';
import {
    Badge,
    Card,
    Container,
    Group,
    Paper,
    Stack,
    Title,
    Button,
    Image,
    Avatar,
    Box,
    BackgroundImage,
    Overlay,
    Tooltip, useMantineTheme, Grid, Center, ActionIcon
} from "@mantine/core";
import {string} from "prop-types";
import {IconBrandSpotify, IconCirclesRelation, IconMicrophone} from "@tabler/icons";
import {useHover, useMediaQuery} from "@mantine/hooks";
import {Router} from "next/router";

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
    external_urls: { spotify: string },
}

function ArtistCard( { artist, genres }: { artist: Artist; genres: {genre: string, enabled: boolean}[] } ) {
    const { hovered, ref } = useHover();
    const theme = useMantineTheme();
    const smallScreen = useMediaQuery(`(min-width: ${theme.breakpoints.sm.toString()}px)`);
    function isGenreEnabled(genre: string) {
        const enabledGenres = genres.filter(genre => genre.enabled);
        let genreEnabled = false;
        genres.forEach(enabledGenre => {
            if (enabledGenre.genre == genre) {
                genreEnabled = true;
                return;
            }
        })
        return genreEnabled;
    }

    if (artist.genres.filter(isGenreEnabled).length == 0) {
        return <></>;
    }

    return (
        <Card key={artist.id}
              radius={"xl"}
              shadow={hovered ? "xl" : "md"}
              p={"lg"}
              component="a"
              href={`${window.location.origin}/artists/${artist.id}`}
              sx={(theme) => ({
                  backgroundColor: theme.fn.rgba(theme.colors.dark[7], 0.65),
                  //backdropFilter: "blur( 2px )",
                  '&:hover': {
                      boxShadow: `0 8px 32px 0 ${theme.fn.rgba(theme.colors.cyan[9], 0.25)}`,
                      cursor: 'pointer'
                  }
              })}
              withBorder>
                <Grid>
                    <Grid.Col span={smallScreen ? 'auto' : 12}>
                        <Stack>
                            <Group>
                                <Avatar
                                    size={'md'}
                                    radius={"xl"}
                                    src={artist.images[0] ? artist.images[0].url : ''}
                                />
                                <Title order={3}>{artist.name}</Title>
                            </Group>
                            <Group position={"left"}>
                                {artist.genres.filter(isGenreEnabled).slice(0,3).map(genre => (
                                    <Tooltip color={theme.colors.dark[3]} key={genre} label={genre} sx={{textTransform: 'capitalize'}}>
                                        <Badge size={smallScreen ? 'md' : 'sm'} > {genre} </Badge>
                                    </Tooltip>
                                ))}
                            </Group>
                            <Group position={'apart'}>
                                <Button component={'a'} href={`${window.location.origin}/artists/${artist.id}`} color={'cyan'} variant={'light'} radius={'lg'} leftIcon={<IconCirclesRelation size={18}/>}>Artist Page</Button>
                                <ActionIcon component={'a'} href={artist.external_urls.spotify} color={'green'} variant={'light'} size={'xl'} radius={'xl'}><IconBrandSpotify/></ActionIcon>
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
            {/*</BackgroundImage>*/}
        </Card>
    );
}

export default ArtistCard;