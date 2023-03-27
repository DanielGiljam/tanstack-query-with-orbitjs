import {List} from "@mui/material";
import {useVirtualizer} from "@tanstack/react-virtual";
import React from "react";

export type VirtualListItemProps<
    TItemData,
    TAdditionalItemComponentProps extends Record<string, unknown> = Record<
        string,
        never
    >,
> = {
    data: TItemData;
    index: number;
} & TAdditionalItemComponentProps;

export interface VirtualListProps<
    TItemData,
    TAdditionalItemComponentProps extends Record<string, unknown> = Record<
        string,
        never
    >,
> {
    additionalItemComponentProps?:
        | TAdditionalItemComponentProps
        | ((index: number, data: TItemData) => TAdditionalItemComponentProps);
    estimateSize: number | ((index: number) => number);
    getItemKey?: (index: number, data: TItemData) => number | string;
    ItemComponent: React.ComponentType<
        VirtualListItemProps<TItemData, TAdditionalItemComponentProps>
    >;
    itemData: TItemData[];
    onRenderLastItem?: () => void;
}

export const VirtualList = <
    TItemData,
    TAdditionalItemComponentProps extends Record<string, unknown> = Record<
        string,
        never
    >,
>({
    additionalItemComponentProps,
    estimateSize,
    getItemKey,
    ItemComponent,
    itemData,
    onRenderLastItem,
}: VirtualListProps<TItemData, TAdditionalItemComponentProps>) => {
    const parentRef = React.useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: itemData.length,
        getScrollElement: () => parentRef.current,
        estimateSize:
            typeof estimateSize === "function"
                ? estimateSize
                : () => estimateSize,
        getItemKey:
            getItemKey != null
                ? (index) => getItemKey(index, itemData[index])
                : undefined,
    });
    const virtualItems = virtualizer.getVirtualItems();
    React.useEffect(() => {
        if (
            onRenderLastItem != null &&
            virtualItems.at(-1)?.index === itemData.length - 1
        ) {
            onRenderLastItem();
        }
    }, [itemData, onRenderLastItem, virtualItems]);
    const getAdditionalItemComponentProps =
        typeof additionalItemComponentProps === "function"
            ? additionalItemComponentProps
            : () => additionalItemComponentProps ?? {};
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
                    {virtualItems.map((virtualItem) => (
                        <ItemComponent
                            key={virtualItem.key}
                            ref={virtualizer.measureElement}
                            data={itemData[virtualItem.index]}
                            index={virtualItem.index}
                            {...(getAdditionalItemComponentProps(
                                virtualItem.index,
                                itemData[virtualItem.index],
                            ) as TAdditionalItemComponentProps)}
                        />
                    ))}
                </List>
            </div>
        </div>
    );
};
