import { RoutineInput, RoutineInputList, RoutineOutput, RoutineOutputList, Session } from "types";

export interface InputOutputContainerProps {
    handleUpdate: (updatedList: RoutineInputList | RoutineOutputList) => void;
    isEditing: boolean;
    isInput: boolean;
    language: string;
    list: RoutineInputList | RoutineOutputList;
    session: Session;
    zIndex: number;
}

export interface InputOutputListItemProps {
    index: number;
    isEditing: boolean;
    isInput: boolean;
    isOpen: boolean;
    item: RoutineInput | RoutineOutput;
    handleOpen: (index: number) => void;
    handleClose: (index: number) => void;
    handleDelete: (index: number) => void;
    handleUpdate: (index: number, updatedItem: RoutineInput | RoutineOutput) => void;
    language: string;
    session: Session;
    zIndex: number;
}