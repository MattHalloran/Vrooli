import { DialogProps } from '@mui/material';
import { HelpButtonProps } from "components/buttons/types";
import { SvgIconComponent } from '@mui/icons-material';

export interface AlertDialogProps extends DialogProps {};

export interface ComponentWrapperDialogProps extends DialogProps {};

export interface ListDialogItemData {
    label: string;
    value: string;
    Icon?: SvgIconComponent;
    helpData?: HelpButtonProps;
}
export interface ListDialogProps extends DialogProps {
    open?: boolean;
    onSelect: (value: string) => void;
    onClose: () => void;
    title?: string;
    data?: ListDialogItemData[];
}

export interface NewProjectDialogProps extends DialogProps {
    open?: boolean;
    onClose: () => any;
};