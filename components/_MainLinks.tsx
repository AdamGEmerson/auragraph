import {
    IconCirclesRelation,
    IconCompass,
    IconHome,
    IconLogin,
    IconQuestionMark,
    IconTestPipe,
    IconUser
} from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import React from "react";
import Link from 'next/link';

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    page: string;
    setOpenBurger: any;
}

function MainLink({ icon, color, label, page, setOpenBurger}: MainLinkProps) {

    function loadPage( page:string ) {
        setTimeout(() => {
            setOpenBurger(false)
        }, 200)

    }
    if (typeof window != "undefined") {
        return (
            <Link href={`${window.location.origin}/${page}`} style={{textDecoration: 'none'}}>
                <UnstyledButton
                    onClick={() => loadPage(page)}
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
    } else {
        return <></>
    }
}

const data = [
    { icon: <IconHome size={18} />, color: 'green', label: 'Home', page: 'home' },
    { icon: <IconCirclesRelation size={18} />, color: 'green', label: 'Your Auragraph', page: 'authenticated/auragraph' },
    { icon: <IconCompass size={18} />, color: 'green', label: 'Explore', page: 'explore' },
    { icon: <IconQuestionMark size={18} />, color: 'green', label: 'About', page: 'about' },
    { icon: <IconTestPipe size={18} />, color: 'green', label: 'Demo', page: 'demo' }
];

export function MainLinks( { setOpenBurger }: { setOpenBurger: any} ) {
    const links = data.map((link) => <MainLink {...link} setOpenBurger={setOpenBurger} key={link.label} />);
    return <div>{links}</div>;
}