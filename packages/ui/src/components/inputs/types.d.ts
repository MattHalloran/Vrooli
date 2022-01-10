import { ChangeEvent } from 'react';

export interface DropzoneProps {
    acceptedFileTypes?: string[];
    dropzoneText?: string;
    onUpload: (files: any[]) => any;
    showThumbs?: boolean;
    maxFiles?: number;
    uploadText?: string;
    cancelText?: string;
    disabled?: boolean;
}

export interface SearchBarProps {
    id?: string;
    placeholder?: string;
    value: string;
    options?: any[];
    getOptionLabel?: (option: any) => string;
    onChange: (updatedText: string) => any;
    onInputChange?: (event: any, newValue: any) => any;
    debounce?: number;
    sx?: any;
}

export interface SelectorProps {
    options: any[];
    selected: any;
    handleChange: (change: any) => any;
    fullWidth?: boolean;
    multiple?: boolean;
    inputAriaLabel?: string;
    noneOption?: boolean;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    color?: string;
    className?: string;
    style?: any;
}