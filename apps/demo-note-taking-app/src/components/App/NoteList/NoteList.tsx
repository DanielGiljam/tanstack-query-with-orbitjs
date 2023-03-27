import React from "react";

import {useNotes} from "../../../hooks";
import {VirtualList, VirtualListProps} from "../../VirtualList";
import {
    NOTE_LIST_ITEM_DATA_LOADING,
    NoteListItem,
    NoteListItemData,
} from "../NoteListItem";

const VirtualListTyped: React.ComponentType<
    VirtualListProps<
        NoteListItemData,
        {selected: boolean; setSelectedNote: (id: string) => void}
    >
> = VirtualList;

export interface NoteListProps {
    selectedNote: string | undefined;
    setSelectedNote: (id: string) => void;
}

export const NoteList = ({selectedNote, setSelectedNote}: NoteListProps) => {
    const {
        data,
        fetchNextPage,
        hasNextPage = true,
        isFetchingNextPage,
    } = useNotes({
        onSuccess: (data) => {
            if (selectedNote == null) {
                setSelectedNote(data.pages[0][0].id);
            }
        },
        suspense: false,
    });
    const itemData = React.useMemo(() => {
        const itemData: NoteListItemData[] = data?.pages.flat() ?? [];
        if (hasNextPage) {
            itemData.push(NOTE_LIST_ITEM_DATA_LOADING);
        }
        return itemData;
    }, [data, hasNextPage]);
    return (
        <VirtualListTyped
            additionalItemComponentProps={(_index, data) => ({
                selected: typeof data === "object" && data.id === selectedNote,
                setSelectedNote,
            })}
            estimateSize={100}
            getItemKey={(index, data) =>
                typeof data === "object" ? data.id : index
            }
            ItemComponent={NoteListItem}
            itemData={itemData}
            onRenderLastItem={() => {
                if (hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            }}
        />
    );
};
