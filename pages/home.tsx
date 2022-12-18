import React from 'react';
import { Group, Paper, Button, Stack, Text, Title } from "@mantine/core";
import {IconCirclesRelation, IconEye, IconEyeOff, IconInfoCircle} from "@tabler/icons";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import EulerChart from "../components/EulerChart";
import ArtistCard from "../components/ArtistCard";
import {useHover} from "@mantine/hooks";
import {HomeLinks} from "../components/_HomeLinks";

function Home() {
    const supabaseClient = useSupabaseClient();
    const user = useUser();

    return (
        <>
            <Stack m={'md'}>
                <Text weight={700} size={'xl'}>{user ? user.user_metadata.name : ""}</Text>
                <Group style={{marginTop: "-30px"}}>
                    <Title order={1}> Home </Title>
                </Group>
            </Stack>
            <Paper p={'md'} my={'md'} sx={(theme) => ({
                backgroundColor: "transparent"
            })}>
                <HomeLinks/>
            </Paper>
        </>
    );
}

export default Home;