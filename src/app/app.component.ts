import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AppService } from './app.service';
import { treeData } from './data.constant';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public recordsList: object[];
    public recordsListCopy: object[];
    public folderLookup: object = {};
    public currencyLookup: object = {};
    public actualRecords: object[] = [];
    public treeElementsToBeRemoved: object[] = [];
    public selectedTreeElements: object[] = [];

    public flatRecords = [
        { 'Id': 1, 'Name': 'test1' },
        { 'Id': 2, 'Name': 'test2', 'ParentId': 1 },
        { 'Id': 3, 'Name': 'test3', 'ParentId': 1 },
        { 'Id': 4, 'Name': 'test4', 'ParentId': 3 },
        { 'Id': 5, 'Name': 'test5', 'ParentId': 3 },
        { 'Id': 6, 'Name': 'test6', 'ParentId': 1 },
        { 'Id': 7, 'Name': 'test7', 'ParentId': 3 },
        { 'Id': 8, 'Name': 'test8', 'ParentId': 3 },
        { 'Id': 19, 'Name': 'test8', 'ParentId': 8 },
        { 'Id': 20, 'Name': 'test8', 'ParentId': 8 },
        { 'Id': 21, 'Name': 'test8', 'ParentId': 8 },
        { 'Id': 9, 'Name': 'test9', 'ParentId': 2 },
        { 'Id': 10, 'Name': 'test10' },
        { 'Id': 11, 'Name': 'test11', 'ParentId': 10 },
        { 'Id': 12, 'Name': 'test12', 'ParentId': 10 },
        { 'Id': 13, 'Name': 'test13', 'ParentId': 11 },
        { 'Id': 14, 'Name': 'test14', 'ParentId': 11 },
        { 'Id': 15, 'Name': 'test15', 'ParentId': 12 },
        { 'Id': 16, 'Name': 'test16', 'ParentId': 4 },
        { 'Id': 17, 'Name': 'test17', 'ParentId': 16 },
        { 'Id': 18, 'Name': 'test18', 'ParentId': 16 },
    ];
    constructor(private appService: AppService) {
        this.populateTree();
    }

    ngOnInit() {
    }

    private populateTree() {
        this.recordsList = treeData['Result'];
        this.actualRecords = _.cloneDeep(this.recordsList);
        this.folderLookup = treeData['FoldersLookup'];
        this.currencyLookup = treeData['CurrencyLookup'];
        this.populateCurrencyLookup(treeData['Result']);

        this.recordsList = this.appService.getNestedChildren(this.recordsList, undefined, undefined, 'ParentId', 'Id');
        this.populateFolderLookUp();
        this.recordsListCopy = _.cloneDeep(this.recordsList);
       
    }

    private populateFolderLookUp() {
        for (let i = 0; i < this.recordsList.length; i++) {
            const currencyId = this.recordsList[i]['CurrencyId'];
            if (currencyId) {
                if (this.currencyLookup[currencyId]) {
                    this['recordsList'][i]['currencySymbol'] = this.currencyLookup[currencyId];
                }
            }
        }
    }
    public populateCurrencyLookup(list) {
        for (let i = 0; i < list.length; i++) {
            const currencyId = list[i]['CurrencyId'];
            if (currencyId) {
                if (this.currencyLookup[currencyId]) {
                    list[i]['currencySymbol'] = this.currencyLookup[currencyId];
                }
            }
            list[i]['selected'] = false;
        }
    }
    public treeElementAdded(list) {
        this.selectedTreeElements = _.cloneDeep(list);
        console.log('Items Selected from Tree: ', list);
    }

    public removeSelectedItem() {
        this.treeElementsToBeRemoved = _.cloneDeep(this.selectedTreeElements);
    }

    public menuItemSelected(event) {
        console.log('Menu clicked: ', event);
    }

}
