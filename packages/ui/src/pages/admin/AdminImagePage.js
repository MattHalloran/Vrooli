import React, { useCallback, useEffect, useState } from 'react';
import {
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { imagesByLabelQuery } from 'graphql/query';
import { addImagesMutation, updateImagesMutation } from 'graphql/mutation';
import { useQuery, useMutation } from '@apollo/client';
import {
    AdminBreadcrumbs,
    Dropzone,
    WrappedImageList
} from 'components';
import { mutationWrapper } from 'graphql/utils/wrappers';
import { useTheme } from '@emotion/react';
import { pageStyles } from '../styles';
import { IMAGE_USE } from '@local/shared';
import { Selector } from 'components';

const useStyles = makeStyles(pageStyles);

const IMAGE_OPTIONS = [
    { label: 'Hero', value: IMAGE_USE.Hero },
    { label: 'Home', value: IMAGE_USE.Home },
    { label: 'Mission', value: IMAGE_USE.Mission },
    { label: 'About', value: IMAGE_USE.About },
]

function AdminImagePage() {
    const classes = useStyles();
    const theme = useTheme();
    const [currImageOption, setCurrImageOption] = useState(IMAGE_OPTIONS[1].value);
    const [imageData, setImageData] = useState([]);
    const { data: currImages, refetch: refetchImages } = useQuery(imagesByLabelQuery, { variables: { label: currImageOption } });
    const [addImages] = useMutation(addImagesMutation);
    const [updateImages] = useMutation(updateImagesMutation);

    const uploadImages = (acceptedFiles) => {
        mutationWrapper({
            mutation: addImages,
            data: { variables: { files: acceptedFiles, labels: [currImageOption] } },
            successMessage: () => `Successfully uploaded ${acceptedFiles.length} image(s).`,
            onSuccess: () => refetchImages(),
        })
    }

    useEffect(() => {
        // Table data must be extensible, and needs position
        setImageData(currImages?.imagesByLabel?.map((d, index) => ({
            ...d,
            pos: index
        })));
    }, [currImages])

    const applyChanges = useCallback((changed) => {
        // Prepare data for request
        const data = changed.map(d => ({
            hash: d.hash,
            alt: d.alt,
            description: d.description
        }));
        // Determine which files to mark as deleting
        const originals = imageData.map(d => d.hash);
        const finals = changed.map(d => d.hash);
        const deleting = originals.filter(s => !finals.includes(s));
        // Perform update
        mutationWrapper({
            mutation: updateImages,
            data: { variables: { data, deleting, label: currImageOption } },
            successMessage: () => 'Successfully updated image(s).',
        })
    }, [imageData, updateImages])

    return (
        <div id='page' className={classes.root}>
            <AdminBreadcrumbs textColor={theme.palette.secondary.dark} />
            <div className={classes.header}>
                <Typography variant="h3" component="h1">Manage Images</Typography>
            </div>
            <Selector
                options={IMAGE_OPTIONS}
                selected={currImageOption}
                handleChange={(e) => { setCurrImageOption(e.target.value); refetchImages(); }}
                inputAriaLabel='size-selector-label'
                label="Size"
            />
            <Dropzone
                dropzoneText={'Drag \'n\' drop new images here or click'}
                onUpload={uploadImages}
                uploadText='Upload Images'
            />
            <h2>Reorder and delete images</h2>
            <WrappedImageList data={imageData} onApply={applyChanges} />
        </div>
    );
}

AdminImagePage.propTypes = {
}

export { AdminImagePage };