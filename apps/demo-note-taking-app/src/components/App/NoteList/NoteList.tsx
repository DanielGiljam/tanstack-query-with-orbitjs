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
        suspense: false,
    });
    React.useEffect(() => {
        if (selectedNote == null) {
            const firstNote = data?.pages[0][0];
            if (firstNote != null) {
                setSelectedNote(firstNote.id);
            }
        }
    }, [selectedNote, setSelectedNote, data]);
    const itemData = React.useMemo(() => {
        const itemData: NoteListItemData[] = data?.pages.flat() ?? [];
        if (hasNextPage) {
            itemData.push(NOTE_LIST_ITEM_DATA_LOADING);
        }
        return itemData;
    }, [data, hasNextPage]);
    if (itemData.length === 0) {
        return null;
    }
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
