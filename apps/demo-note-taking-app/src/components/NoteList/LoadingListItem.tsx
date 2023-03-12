import {CircularProgress, ListItem} from "@mui/material";
import React from "react";

export interface LoadingListItemProps {
    dataIndex: number;
}

// eslint-disable-next-line react/display-name
export const LoadingListItem = React.forwardRef<
    HTMLLIElement,
    LoadingListItemProps
>(({dataIndex}, ref) => (
    <ListItem ref={ref} data-index={dataIndex} sx={{justifyContent: "center"}}>
        <CircularProgress />
    </ListItem>
));
