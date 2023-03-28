import React from "react";

import {useSearchNotes} from "../../../hooks";
import {VirtualList, VirtualListProps} from "../../VirtualList";
import {NoteListItem, NoteListItemData} from "../NoteListItem";

const VirtualListTyped: React.ComponentType<
    VirtualListProps<
        NoteListItemData,
        {selected: boolean; setSelectedNote: (id: string) => void}
    >
> = VirtualList;

export interface SearchResultListProps {
    selectedNote: string | undefined;
    setSelectedNote: (id: string) => void;
    searchTerm: string;
}

export const SearchResultList = ({
    selectedNote,
    setSelectedNote,
    searchTerm,
}: SearchResultListProps) => {
    const {data: searchData} = useSearchNotes(searchTerm);
    const itemData = searchData!.hits;
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
        />
    );
};
