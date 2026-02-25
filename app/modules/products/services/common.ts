export function buildDynamicFieldFilters(query: any, fixedKeys: string[]) {
    const dynamicFilters: any[] = [];

    Object.keys(query).forEach((key) => {
        if (!fixedKeys.includes(key)) {
            dynamicFilters.push({
                fields: {
                    $elemMatch: {
                        key: new RegExp("^" + key + "$", "i"), // match case-insensitive
                        option: query[key]
                    }
                }
            });
        }
    });

    return dynamicFilters.length > 0 ? dynamicFilters : undefined;
}
