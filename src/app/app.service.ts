import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class AppService {
    public getNestedChildren(arr, parent?, level?, parentField?, idField?, sortOrder?) {
        if (!parentField) {
            parentField = 'ParentId';
        }
        if (!idField) {
            idField = 'Id';
        }
        const out = [];
        if (level === null || level === undefined) {
            level = 0;
        } else {
            level++;
        }
        for (const i in arr) {
            if (arr[i][parentField] === parent) {

                const children = this.getNestedChildren(arr, arr[i][idField], level);

                if (children.length) {
                    for (let j = 0; j < children.length; j++) {
                        children[j]['level'] = level;
                        if (!sortOrder || sortOrder === 'default') {
                            children[j]['children'] = _.cloneDeep(_.sortBy(children[j]['children'], 'Id'));
                        } else {
                            children[j]['children'] = _.cloneDeep(_.orderBy(children[j]['children'], 'Id', sortOrder));
                        }
                    }
                    if (arr[i]['children']) {
                        for (let k = 0; k < arr[i]['children'].length; k++) {
                            arr[i]['children'][k]['level'] = level;
                        }
                        if (!sortOrder || sortOrder === 'default') {
                            arr[i]['children'] = _.cloneDeep(_.sortBy(arr[i]['children'], 'Id'));
                        } else {
                            arr[i]['children'] = _.cloneDeep(_.orderBy(arr[i]['children'], 'Id', sortOrder));
                        }
                    }
                    if (arr[i]['children']) {
                        if (!sortOrder || sortOrder === 'default') {
                            arr[i]['children'] = arr[i]['children'].concat(_.sortBy(children, 'Id'));
                        } else {
                            arr[i]['children'] = arr[i]['children'].concat(_.orderBy(children, function (o) { return o.Name.toLowerCase(); }, sortOrder));
                        }
                    } else {
                        if (!sortOrder || sortOrder === 'default') {
                            arr[i]['children'] = _.sortBy(children, 'Name');
                        } else {
                            arr[i]['children'] = _.orderBy(children, function (o) { return o.Name.toLowerCase(); }, sortOrder);
                        }
                    }
                }
                out.push(arr[i]);
            }
        }
        return out.reverse();
    }
}
