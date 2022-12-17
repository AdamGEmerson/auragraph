import React from 'react';
import {
    ActionIcon, Avatar,
    Badge,
    Card,
    Center,
    Divider,
    Group,
    HoverCard,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {IconCirclesRelation, IconEye, IconEyeOff, IconInfoCircle} from "@tabler/icons";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import EulerChart from "../components/EulerChart";
import ArtistCard from "../components/ArtistCard";
import {useHover} from "@mantine/hooks";
import {HomeLinks} from "../components/_HomeLinks";

function Home() {
    const supabaseClient = useSupabaseClient();
    const user = useUser();

    if (user) {
        return (
            <>
                <Stack m={'md'}>
                    <Text weight={700} size={'xl'}>{user.user_metadata.name}</Text>
                    <Group style={{marginTop: "-30px"}}>
                        <Title order={1}> Home </Title>
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
                </Stack>
                <Paper p={'md'} my={'md'} sx={(theme) => ({
                    backgroundColor: "transparent"
                })}>
                    <HomeLinks/>
                </Paper>
            </>
        );
}}

export default Home;