import {List} from "@mui/material";
import {useVirtualizer} from "@tanstack/react-virtual";
import React from "react";

import {useNotes} from "../../hooks";

import {LoadingListItem} from "./LoadingListItem";
import {NoteListItem} from "./NoteListItem";

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
    const notes = React.useMemo(() => data?.pages.flat() ?? [], [data]);
    const parentRef = React.useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: hasNextPage ? notes.length + 1 : notes.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5,
    });
    const virtualItems = virtualizer.getVirtualItems();
    React.useEffect(() => {
        const [lastItem] = [...virtualItems].reverse();
        if (
            lastItem != null &&
            lastItem.index >= notes.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            void fetchNextPage();
        }
    }, [
        hasNextPage,
        fetchNextPage,
        notes.length,
        isFetchingNextPage,
        virtualItems,
    ]);
    return (
        <div
            ref={parentRef}
            style={{contain: "strict", flexGrow: 1, overflowY: "auto"}}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    position: "relative",
                }}
            >
                <List
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        transform: `translateY(${virtualItems[0].start}px)`,
                    }}
                    disablePadding
                >
                    {virtualItems.map((virtualItem) => {
                        if (virtualItem.index > notes.length - 1) {
                            return (
                                <LoadingListItem
                                    key={"loading"}
                                    ref={virtualizer.measureElement}
                                    dataIndex={virtualItem.index}
                                />
                            );
                        }
                        const note = notes[virtualItem.index];
                        return (
                            <NoteListItem
                                key={note?.id ?? virtualItem.index}
                                ref={virtualizer.measureElement}
                                dataIndex={virtualItem.index}
                                note={note}
                                selectedNote={selectedNote}
                                setSelectedNote={setSelectedNote}
                            />
                        );
                    })}
                </List>
            </div>
        </div>
    );
};
