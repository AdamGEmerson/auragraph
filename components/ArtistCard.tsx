import React from 'react';
import {Badge, Card, Container, Group, Paper, Title} from "@mantine/core";
import Image from "next/image";
import {string} from "prop-types";

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

function ArtistCard( { artist }: { artist: Artist } ) {
    return (
        <Card key={artist.id} style={{height: 160}}>
            <Container>
                <Group position={'left'}>
                    <Paper
                        style={{width: 120, height: 120, position: "relative", overflow: "hidden"}}
                        radius={"xl"}
                        shadow={'sm'}
                    >
                        <Image
                            src={artist.images[0].url}
                            alt={artist.name}
                            fill
                            style={{objectFit: "cover"}}
                        />
                    </Paper>
                    <div>
                        {artist.name.length < 10 ?
                            <Title order={1}>{artist.name}</Title> :
                            <Title order={3}>{artist.name}</Title>
                        }
                        <Badge> {artist.genres[0]} </Badge>
                    </div>
                </Group>
            </Container>
        </Card>
    );
}

export default ArtistCard;