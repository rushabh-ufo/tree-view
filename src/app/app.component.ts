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
    public contextMenu = {
        folderLevelMenu: [
            {
                id: 'f1',
                menuItem: 'Create New Rate'
            },
            {
                id: 'f2',
                menuItem: 'Edit'
            },
            {
                id: 'f3',
                menuItem: 'Delete'
            },
        ],
        childLevelMenu: [
            {
                id: 'c1',
                menuItem: 'Create Derived Rate'
            },
            {
                id: 'c2',
                menuItem: 'Edit'
            },
            {
                id: 'c3',
                menuItem: 'Delete'
            },
            {
                id: 'c4',
                menuItem: 'Deactivate Rate'
            },
            {
                id: 'c5',
                menuItem: 'Change History'
            },
        ]
    };
    public treeToolTip = {
        addParentToolTip: 'Add All Folder Rates',
        addChildToolTip: 'Add Rate'
    };

    public dropableElement: any; // for drag and drop functionality
    public droppedElements: object[] = []; // for drag and drop functionality
    public nodesAdded: object[] = []; // for drag and drop functionality

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

        // this.recordsList = _.cloneDeep(this.flatRecords);
        this.recordsList = this.appService.getNestedChildren(this.recordsList, undefined, undefined, 'ParentId', 'Id');
        this.populateFolderLookUp();
        this.recordsListCopy = _.cloneDeep(this.recordsList);
       
    }

    private populateFolderLookUp() {
        // console.log('folder lookup: ', this.folderLookup);
        for (let i = 0; i < this.recordsList.length; i++) {
            // const folderId = this.recordsList[i]['FolderId'];
            const currencyId = this.recordsList[i]['CurrencyId'];
            // if (folderId) {
            //     if (this.folderLookup[folderId]) {
            //         this['recordsList'][i]['folderObj'] = this.folderLookup[folderId];
            //     }
            // }
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

    /* put below methods in the parent where actual drop is happening */

    public drag(event) {
        // console.log(event);
        if (event['obj']) {
            this.droppedElements.push(event['obj']);
        }
    }

    public drop() {
        this.nodesAdded = _.cloneDeep(this.droppedElements);
    }

    public makeDroppable(event) {
        this.dropableElement = document.querySelector('.droppable');
        if (event.type === 'dragover') {
            event.preventDefault();
            event.stopPropagation();
            this.dropableElement.classList.add('dragover');
        }

        if (event.type === 'dragleave') {
            event.preventDefault();
            event.stopPropagation();
            this.dropableElement.classList.remove('dragover');
        }

        if (event.type === 'drop') {
            event.preventDefault();
            event.stopPropagation();
            this.dropableElement.classList.remove('dragover');
            console.log('drop called');
            this.drop();
        }

    }
}
