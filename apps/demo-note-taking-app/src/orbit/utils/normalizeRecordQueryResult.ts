import {RecordQueryResult} from "@orbit/records";

import {ensureArray} from "../../utils";

export const normalizeRecordQueryResult = (result: RecordQueryResult) =>
    ensureArray(result)
        .flat()
        .filter(
            (record): record is NonNullable<typeof record> => record != null,
        );
