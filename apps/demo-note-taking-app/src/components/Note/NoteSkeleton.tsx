import {Skeleton} from "@mui/material";

export const NoteSkeleton = () => (
    <>
        <Skeleton height={56} sx={{mb: 2}} variant={"rounded"} width={"100%"} />
        <Skeleton height={493} variant={"rounded"} width={"100%"} />
    </>
);
