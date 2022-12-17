import React from 'react';
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {Group, Text, ThemeIcon, UnstyledButton} from "@mantine/core";
import {IconLogin, IconLogout} from "@tabler/icons";

function SignInOutButton() {
    const supabaseClient = useSupabaseClient();

    function signOut() {
        supabaseClient.auth.signOut();
    }

    async function signIn() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: 'playlist-read-private user-read-private user-top-read',
                redirectTo: '/home'
            }
        })
    }

    return (
        <UnstyledButton
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}
            onClick={useUser() ? () => signOut() : () => signIn()}
        >
            <Group>
                <ThemeIcon color={'green'} variant="light">
                    {useUser() ? <IconLogout/> : <IconLogin/> }
                </ThemeIcon>
                <Text size="sm">{useUser() ? "Log Out" : "Log In"}</Text>
            </Group>
        </UnstyledButton>
    );
}

export default SignInOutButton;