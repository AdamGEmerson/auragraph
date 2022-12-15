import {IconHome, IconLogin, IconUser} from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import React from "react";
import Link from 'next/link';

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    page: string;
}

function MainLink({ icon, color, label, page}: MainLinkProps) {

    function loadPage( page:string ) {

    }

    return (
        <Link href={`/${page}`} style={{textDecoration: 'none'}}>
            <UnstyledButton
                onClick={ () => loadPage(page) }
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
            >
                <Group>
                    <ThemeIcon color={color} variant="light">
                        {icon}
                    </ThemeIcon>

                    <Text size="sm">{label}</Text>
                </Group>
            </UnstyledButton>
        </Link>
    );
}

const data = [
    { icon: <IconHome size={18} />, color: 'green', label: 'Home', page: '' },
    { icon: <IconUser size={18} />, color: 'green', label: 'Profile', page: 'login' }
];

export function MainLinks() {
    const links = data.map((link) => <MainLink {...link} key={link.label} />);
    return <div>{links}</div>;
}