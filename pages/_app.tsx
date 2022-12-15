import { AppProps } from 'next/app';
import Head from 'next/head';
import {ActionIcon, AppShell, Group, Header, MantineProvider, Navbar, Title} from '@mantine/core';
import {MainLinks} from "../components/_MainLinks";
import {IconGauge, IconGraph} from "@tabler/icons";
import React, {useState} from "react";
import { NotificationsProvider } from "@mantine/notifications";
import { Overpass } from '@next/font/google'
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import {createBrowserSupabaseClient} from "@supabase/auth-helpers-nextjs";

// If loading a variable font, you don't need to specify the font weight
const overpass = Overpass({
    weight: ["300","400","500","600","700"],
    style: ["normal", "italic"],
    subsets: ['latin']
})

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
    const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  function NavbarContent() {
    return (
        <Navbar p="xs" width={{ base: 300 }}>
          <Navbar.Section>{/* Header with logo */}</Navbar.Section>
          <Navbar.Section grow mt="md"> <MainLinks /> </Navbar.Section>
          <Navbar.Section>{/* Footer with user */}</Navbar.Section>
        </Navbar>
    );
  }

  function BrandLogo() {
    return (
        <Header height={60} p="xs">
          <Group>
            <ActionIcon color='green' variant='light' size='xl' radius='xl'>
              <IconGraph/>
            </ActionIcon>
            <Title color='teal' sx={{fontFamily: overpass.style.fontFamily}}>Spotigragh</Title>
          </Group>
        </Header>
    );
  }

  return (
      <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}>
        <Head>
          <title>Spotigraph</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <main className={overpass.className}>
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                /** Put your mantine theme override here */
                colorScheme: 'dark',
                fontFamily: overpass.style.fontFamily,
                primaryColor: 'green'
            }}
        >
          <NotificationsProvider>
            <AppShell
                padding="md"
                navbar={NavbarContent()}
                header={BrandLogo()}
                styles={(theme) => ({
                  main: {
                      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                  },
                })}
            >
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
        </MantineProvider>
        </main>
      </SessionContextProvider>
  );
}