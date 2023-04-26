import {RecordQueryResult} from "@orbit/records";

import {ensureArray} from "./ensureArray";

export const normalizeRecordQueryResult = (result: RecordQueryResult) =>
    ensureArray(result)
        .flat()
        .filter(
            (record): record is NonNullable<typeof record> => record != null,
        );
