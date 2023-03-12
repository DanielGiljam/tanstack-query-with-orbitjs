import {InfiniteData} from "@tanstack/react-query";

import {Note} from "../orbit";

import {useInfiniteQueryWithMetaFlagAndInterceptor} from "./useInfiniteQueryWithMetaFlagAndInterceptor";

export interface UseNotesOptions {
    onSuccess?: (notes: InfiniteData<Note[]>) => void;
    pageSize?: number;
    suspense?: boolean;
}

export const useNotes = ({
    onSuccess = () => undefined,
    pageSize = 10,
    suspense = true,
}: UseNotesOptions = {}) =>
    useInfiniteQueryWithMetaFlagAndInterceptor<Note[]>({
        queryKey: ["notes"],
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < pageSize ? undefined : allPages.length,
        onSuccess,
        suspense,
        meta: {
            getQueryOrExpressions: (_queryKey, pageParam) => (q) => {
                let term = q.findRecords("note").sort("-updated_at");
                if (pageParam != null) {
                    term = term.page({
                        limit: pageSize,
                        offset: pageParam * pageSize,
                    });
                }
                return term;
            },
            keepAlive: true,
            pageSize,
        },
    });
