import {IconCirclesRelation, IconCompass, IconHome, IconLogin, IconQuestionMark, IconUser} from '@tabler/icons';
import {
    ThemeIcon,
    UnstyledButton,
    Group,
    Text,
    Title,
    Card,
    SimpleGrid,
    Stack,
    DefaultMantineColor, useMantineTheme, MantineTheme
} from '@mantine/core';
import React from "react";
import Link from 'next/link';
import {useHover} from "@mantine/hooks";

interface HomeLinkProps {
    icon: React.ReactNode;
    label: string;
    page: string;
    description: string;
    color: DefaultMantineColor;
}

function HomeLink({ icon, label, color, description, page}: HomeLinkProps) {
    const { hovered, ref } = useHover();
    const theme = useMantineTheme();
    function loadPage( page:string ) {

    }

    return (
        <Link href={`/${page}`} style={{textDecoration: 'none'}}>
            <Card radius={"xl"}
                  shadow={hovered ? "xl" : "md"}
                  p={"lg"}
                  sx={(theme) => ({
                      minHeight: "280px",
                      backgroundColor: theme.fn.rgba(theme.colors.dark[4], 0.35),
                      backdropFilter: "blur( 2px )",
                      '&:hover': {
                          color:  theme.fn.rgba(color, .7),
                          boxShadow: `0 8px 32px 0 ${theme.fn.rgba(color, 0.25)}`,
                          cursor: 'pointer'
                      }
                  })}
                  withBorder>
                <Stack>
                    {icon}
                    <Title order={2}>{label}</Title>
                    <Text sx={{fontSize: "18px"}} color={theme.colors.dark[0]} my={"md"}>{description}</Text>
                </Stack>
            </Card>
        </Link>
    );
}

const data = (theme: MantineTheme) => {
    return [
        { icon: <ThemeIcon size={64} variant={'light'} radius={'xl'} color={'green'}><IconCirclesRelation size={48}/></ThemeIcon>, color: theme.colors.teal[5] ,label: 'Your Auragraph', description: "Visualize your music tastes and share your auragraph with friends.", page: 'authenticated/auragraph' },
        { icon: <ThemeIcon size={64} variant={'light'} radius={'xl'} color={'cyan'}><IconCompass size={48}/></ThemeIcon>, label: 'Explore', color: theme.colors.cyan[5], description: "Explore Spotify and find your favorite artists' auragraphs.", page: 'explore' },
        { icon: <ThemeIcon size={64} variant={'light'} radius={'xl'} color={'yellow'}><IconQuestionMark size={48}/></ThemeIcon>, label: 'About', color: theme.colors.yellow[5], description: "Learn more about what an auragraph is and how it works.", page: 'about' },
    ]
};

export function HomeLinks() {
    const links = data(useMantineTheme()).map((link) => <HomeLink {...link} key={link.label} />);
    return (
        <SimpleGrid cols={3} spacing={'lg'}  breakpoints={[
            { maxWidth: 1600, cols: 2, spacing: 'lg' },
            { maxWidth: 1000, cols: 1, spacing: 'lg' },]}
        >
            {links}
        </SimpleGrid>
    );
}