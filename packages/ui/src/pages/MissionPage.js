import React, { useCallback, useState, useEffect } from 'react';
import { Slide } from 'components';
import { useQuery } from '@apollo/client';
import { imagesByLabelQuery } from 'graphql/query';
import { IMAGE_USE, SERVER_URL } from '@local/shared';
import { getImageSrc, LINKS } from 'utils';
import { makeStyles } from '@material-ui/styles';
import Thinking from 'assets/img/thinking.png';
import Target from 'assets/img/target.png';
import Mission from 'assets/img/mission-2.png';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: 'calc(10vh - 10px)',
    },
    [theme.breakpoints.down(600)]: {
        root: {
            paddingTop: 'calc(14vh - 10px)',
        }
    },
}))

function MissionPage() {
    const classes = useStyles();
    // Load all images on page
    const [imageData, setImageData] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const { data: currImages } = useQuery(imagesByLabelQuery, { variables: { label: IMAGE_USE.Mission } });

    // Auto-updates width. Used to determine what size image to fetch
    useEffect(() => {
        const onResize = window.addEventListener('resize', () => setWidth(window.innerWidth))
        return () => {
            window.removeEventListener('resize', onResize)
        }
    })

    useEffect(() => {
        // Table data must be extensible, and needs position
        setImageData(currImages?.imagesByLabel);
    }, [currImages])

    const getImage = useCallback((pos, size) => {
        return imageData?.length > pos ? `${SERVER_URL}/${getImageSrc(imageData[pos], size ?? width)}` : null;
    }, [imageData])

    // Slides in order
    const slides = [
        {
            id: 'the-problem',
            title: { text: 'The Problem', color: 'white', position: 'center' },
            background: { background: '#06125f' },
            body: [
                {
                    content: [{ title: { text: 'Project Catalyst will empower the masses with governance, but this system is not perfect:', color: 'white', textAlign: 'center' }}],
                },
                {
                    sm: 6,
                    content: [{ list: { variant: 'h5', color: 'white', items: [
                        { text: 'Governance is influenced by money' },
                        { text: 'Best way to make money is through entrepreneurship' },
                        { text: 'Barriers to entrepreneurship are time, money, and knowledge' }
                    ]}}]
                },
                {
                    sm: 6,
                    content: [{ image: { src: Thinking, alt: 'Person thinking - By Vecteezy', maxWidth: '50%' } }]
                },
                {
                    buttons: [{ text: `What's Project Catalyst?`, position: 'center', link: 'https://matthalloran8.medium.com/the-next-generation-of-global-collaboration-a4839766e29e#4f79' }]
                }
            ],
        },
        {
            id: 'our-mission',
            title: { text: 'Our Mission', position: 'center' },
            background: { background: '#d7deef' },
            body: [
                {
                    sm: 6,
                    content: [{ image: { src: Target, alt: 'Large target - By Vecteezy' } }]
                },
                {
                    sm: 6,
                    content: [
                        { title: { text: 'Make entrepreneurship accessible to all by reducing the cost, labor, and knowledge required to implement your ideas', variant: 'h4', textAlign: 'center' } },
                    ]
                },
                {
                    buttons: [{ text: 'Join Waitlist', position: 'center', color: 'secondary', link: LINKS.Waitlist }]
                }
            ]
        },
        {
            id: 'welcome-to-vrooli',
            title: { text: 'Welcome to Vrooli', position: 'center', style: 'pop' },
            background: { image: getImage(0), alt: 'Abstract network image - By Vectoreezy' },
            body: [
                {
                    content: [
                        { title: { text: `We're building a future-friendly, open-source platform for automating entrepreneurship`, color: 'white', textAlign: 'center' } },
                    ]
                },
                {
                    buttons: [
                        { text: `How it Works`, position: 'center', link: 'https://matthalloran8.medium.com/the-next-generation-of-global-collaboration-a4839766e29e#e1eb' },
                        { text: `Benefits of Vrooli`, position: 'center', link: LINKS.Benefits }
                    ]
                }
            ]
        },
        {
            id: 'whats-the-catch',
            background: { background: '#d7deef' },
            title: { text: `What's the Catch?`, position: 'center' },
            body: [
                {
                    content: [
                        { title: { text: 'We at Vrooli believe in free software - free to use, study, and change', textAlign: 'center' } },
                    ]
                },
                {
                    content: [
                        { title: { text: 'Vrooli will (hopefully) be funded through Project Catalyst and donations. We aim to handle compute and maintenance costs by connecting routines to smart contracts on the Cardano blockchain', textAlign: 'center' } },
                    ]
                },
                {
                    content: [
                        { title: { text: `We encourage users to promote and contribute to the project and its mission. If we're successful, we may just save the world🌍`, textAlign: 'center' } },
                    ]
                }
            ],
        },
        {
            id: 'roadmap',
            title: { text: 'Roadmap', position: 'center', style: 'pop' },
            background: { image: Mission, fixed: true, alt: 'Rocket image - By Vectoreezy' },
            body: [
                {
                    content: [
                        { title: { text: 'Q1 2022', textAlign: 'center', color: 'white', variant: 'h3' } },
                        { list: { variant: 'h4', color: 'white', paddingBottom: '25vh', margin: '0', items: [
                            { text: 'Website launch🎉' },
                            { text: 'Create, comment, and vote on routines' },
                        ]}},
                        { title: { text: 'Q2 2022', textAlign: 'center', color: 'white', variant: 'h3' } },
                        { list: { variant: 'h4', color: 'white', paddingBottom: '25vh', margin: '0', items: [
                            { text: 'Improved routine visualizer' },
                            { text: 'Fork and copy public routines' },
                            { text: `"Request a Routine" feature` },
                        ]}},
                        { title: { text: 'Q3 2022', textAlign: 'center', color: 'white', variant: 'h3' } },
                        { list: { variant: 'h4', color: 'white', paddingBottom: '25vh', margin: '0', items: [
                            { text: 'First formal spec for API with data storage and automation' },
                            { text: `"Routine Runner" functional for basic subroutine types` },
                            { text: `Reputation system, powered by Atala PRISM (if ready)` },
                        ]}},
                        { title: { text: 'Q4 2022', textAlign: 'center', color: 'white', variant: 'h3' } },
                        { list: { variant: 'h4', color: 'white', paddingBottom: '25vh', margin: '0', items: [
                            { text: 'Read/write data to IPFS/IPNS' },
                            { text: 'Trigger smart contracts' },
                            { text: `"Routine Runner" functional for more subroutine types` },
                        ]}},
                        { title: { text: '2023 and Beyond', textAlign: 'center', color: 'white', variant: 'h3' } },
                        { list: { variant: 'h4', color: 'white', margin: '0', items: [
                            { text: 'UX improvements' },
                            { text: `"Routine Runner" functional for user-defined interfaces` },
                            { text: 'Community governance' },
                            { text: 'Decentralize all the things!' },
                        ]}},
                    ]
                },
                {
                    buttons: [
                        { text: 'Join Waitlist', position: 'center', color: 'secondary', link: LINKS.Waitlist },
                        { text: 'View Proposal', position: 'center', color: 'secondary', link: 'https://cardano.ideascale.com/a/dtd/Community-Made-Interactive-Guides/367058-48088' },
                        { text: 'About the Team', position: 'center', color: 'secondary', link: LINKS.About },
                    ]
                }
            ]
        },
    ]

    return (
        <div className={classes.root}>
            {slides.map((data, index) => <Slide key={`slide-${index}`} width={width} data={data} />)}
        </div >
    );
}

MissionPage.propTypes = {
    
}

export { MissionPage };