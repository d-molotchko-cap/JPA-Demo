import { Injectable } from "@angular/core";

@Injectable()
export class ObjectFieldAccessor {

    getValue(obj, field): any {
        const fields = field.split(/[-\.]/);
        for (let i = 0;  i < fields.length - 1;  ++i ) {
            obj = obj[fields[i]];
            if (obj == null || obj === undefined) {
                return undefined;
            }
        }
        return obj[fields[fields.length - 1]];
    }

    setValue(obj, field, val): void {
        const fields = field.split(/[-\.]/);
        for (let i = 0;  i < fields.length - 1;  ++i ) {
            if (!obj[fields[i]]) {
                obj[fields[i]] = {};
            }
            obj = obj[fields[i]];
        }
        obj[fields[fields.length - 1]] = val;
    }
}
