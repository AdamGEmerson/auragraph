import React from 'react';
import {Badge, Card, Container, Group, Paper, Stack, Title, Button, Image, Avatar, Box, BackgroundImage, Overlay} from "@mantine/core";
import {string} from "prop-types";
import {IconMicrophone} from "@tabler/icons";
import {useHover} from "@mantine/hooks";
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
}

function ArtistCard( { artist, genres }: { artist: Artist; genres: {genre: string, enabled: boolean}[] } ) {
    const { hovered, ref } = useHover();

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
              href={`artists/${artist.id}`}
              sx={(theme) => ({
                  height: "120px",
                  backgroundColor: theme.fn.rgba(theme.colors.dark[4], 0.35),
                  backdropFilter: "blur( 2px )",
                  '&:hover': {
                      color: theme.colors.teal[6],
                      boxShadow: `0 8px 32px 0 ${theme.fn.rgba(theme.colors.teal[9], 0.25)}`,
                      cursor: 'pointer'
                  }
              })}
              withBorder>
            <Group>
                <Avatar
                    size={"xl"}
                    radius={"xl"}
                    src={artist.images[0].url}
                />
                <Stack>
                    <Title order={3}>{artist.name}</Title>
                    <Group position={"left"}>
                        {artist.genres.filter(isGenreEnabled).slice(0,3).map(genre => (
                            <Badge key={genre} size={'lg'}> {genre} </Badge>
                        ))}
                    </Group>
                </Stack>
            </Group>
            {/*</BackgroundImage>*/}
        </Card>
    );
}

export default ArtistCard;