import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer2,
    SimpleChange,
    ViewChild,
    AfterViewInit,
} from '@angular/core';
import * as _ from 'lodash';

@Component({
    'selector': 'app-tree-view',
    'templateUrl': './tree-view.component.html'
})

export class TreeViewComponent implements OnInit, OnChanges, AfterViewInit {

    @Input()
    public tree: object[];
    // @Input()
    // public idField: string;
    // @Input()
    // public parentField: string;
    // @Input()
    // public folderLookup: object[];
    @Input()
    public hiddenCurrencySymbol?: boolean = false;
    @Input()
    public checkBoxesRequired?: boolean = false;
    @Input()
    public actualRecords: object[];
    @Input()
    public selectAllParentAndChild?: boolean = true;
    @Input()
    public showAddButton?: boolean = false;
    @Input()
    public elementsToBeRemoved: object[] = [];
    @Input()
    public restrictSelectToLeafNode?: boolean = false;
    @Input()
    public restrictSelectToSingleNode: boolean;
    @Input()
    public disableSelectedNodes?: boolean = false;
    @Input()
    public removeSelectedNodes?: boolean = false;
    @Input()
    public contextMenu?: object = null;
    @Input()
    public toolTipObject?: object = {};
    @Input()
    public nodesDragged: object[] = [];
    @Input()
    public applyDefaultSelection?: boolean = false;
    @Input()
    public defaultSelectedNode?: object = null;
    @Input()
    public selectAllNodes?: boolean = null;
    @Input()
    public disableSelect?: boolean = false;
    @Input()
    public customSelect?: boolean = false;
    @Input()
    public defaultSelectedItems?: object[] = [];
    @Output()
    treeElementSelected: EventEmitter<any> = new EventEmitter();
    @Output()
    menuItemSelected: EventEmitter<any> = new EventEmitter();
    @Output()
    drag: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    defaultElementSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('childMenu') childMenu;
    @ViewChild('parentMenu') parentMenu;

    public localTree: object[];
    public selectedItems: object[] = [];
    private elementToBeRemoved: object = {};
    public treeNodeForMenu: object = {};
    public draggedElementToBeSelected: object = {};
    public selectWithCtrlEnabled = false;
    public nodesSelectedUsingCtrl: object[] = [];
    public nodesSelectedUsingShift: object[] = [];
    public initialShiftIndex: number = -1;
    public lastShiftIndex: number = -1;
    public firstSelectedElementId: number = null;
    public secondSelectedElementId: number = null;
    public initialIndex: number = null;
    public lastIndex: number = null;

    constructor(private cd: ChangeDetectorRef, private renderer: Renderer2) {

    }
    ngOnInit() {

    }
    ngAfterViewInit(){
        
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (const propName in changes) {
            if (propName === 'tree') {
                this.localTree = _.cloneDeep(this.tree);
                console.log(this.localTree);
                this.cd.detach();
                this.cd.detectChanges();
                this.cd.reattach();
            }
            if (propName === 'elementsToBeRemoved') {
                if (changes['elementsToBeRemoved']['currentValue'] && changes['elementsToBeRemoved']['currentValue'].length > 0) {
                    this.handleRemove();
                }
            }
            if (propName === 'nodesDragged') {
                if (changes['nodesDragged']['currentValue'] && changes['nodesDragged']['currentValue'].length > 0) {
                    for (let e = 0; e < this.nodesDragged.length; e++) {
                        this.draggedElementToBeSelected = this.nodesDragged[e];
                    }
                    this.selectDraggedelementsFromTree();
                }
                this.nodesDragged = [];
                this.cd.detach();
                this.cd.detectChanges();
                this.cd.reattach();
            }
            if (propName === 'applyDefaultSelection') {
                console.log('Apply Default flag value: ', this.applyDefaultSelection);
                if (this.applyDefaultSelection) {
                    this.elementsToBeRemoved = _.cloneDeep(this.selectedItems);
                    this.handleRemove();
                    if (this.defaultSelectedNode && this.defaultSelectedNode !== null) {
                        this.selectElementFromTree(this.defaultSelectedNode);
                    }
                    // this.selectedItems = [];
                    // this.selectedItems.push(_.cloneDeep(this.defaultSelectedNode));
                    // this.applyDefaultSelection = false;
                    this.defaultSelectedNode = null;
                    this.defaultElementSelected.emit();
                }
                // this.treeElementSelected.emit(this.selectedItems);
            }
            if (propName === 'selectAllNodes') {
                if (this.selectAllNodes && this.customSelect) {
                    this.selectAllNodesRecursively(this.selectAllNodes, this.localTree);
                    this.selectedItems = _.uniqBy(this.selectedItems, 'Id');
                    this.treeElementSelected.emit(this.selectedItems);
                } else if (!this.selectAllNodes && !this.customSelect) {
                    this.selectAllNodesRecursively(this.selectAllNodes, this.localTree);
                    this.selectedItems = [];
                    this.treeElementSelected.emit(this.selectedItems);
                } else if (this.selectAllNodes && !this.customSelect) {
                    this.selectAllNodesRecursively(this.selectAllNodes, this.localTree);
                    this.selectedItems = _.uniqBy(this.selectedItems, 'Id');
                    this.treeElementSelected.emit(this.selectedItems);
                } else if (!this.selectAllNodes && this.customSelect) {
                    this.selectedItems = _.cloneDeep(this.defaultSelectedItems);
                    this.selectedItems = _.uniqBy(this.selectedItems, 'Id');
                    this.treeElementSelected.emit(this.selectedItems);
                }
            }

        }
    }

    public selectUsingCtrlShift(item, event?) {
        if (event['ctrlKey'] && !event['shiftKey']) {
            for (let i = 0; i < this.nodesSelectedUsingShift.length; i++) {
                this.markParentAsUnSelected(this.nodesSelectedUsingShift[i]);
            }
            this.nodesSelectedUsingShift = [];
            if (this.nodesSelectedUsingCtrl.length === 0) {
                item['selected'] = true;
                this.nodesSelectedUsingCtrl.push(item);
            } else {
                const listLength = this.nodesSelectedUsingCtrl.length;
                let indexToBeDeleted = -1;
                for (let i = 0; i < listLength; i++) {
                    if (this.nodesSelectedUsingCtrl[i]['Id'] === item['Id']) {
                        indexToBeDeleted = i;
                        break;
                    }
                }
                if (indexToBeDeleted >= 0) {
                    this.nodesSelectedUsingCtrl.splice(indexToBeDeleted, 1);
                    indexToBeDeleted = -1;
                    item['selected'] = false;
                } else {
                    item['selected'] = true;
                    this.nodesSelectedUsingCtrl.push(item);
                }
            }
        }
        // console.log('current Id: ', item['Id']);
        if (!event['ctrlKey'] && event['shiftKey']) {
            for (let i = 0; i < this.nodesSelectedUsingCtrl.length; i++) {
                this.markParentAsUnSelected(this.nodesSelectedUsingCtrl[i]);
            }
            this.nodesSelectedUsingCtrl = [];
            if (item['Id'] === this.firstSelectedElementId || item['Id'] === this.secondSelectedElementId) {
                for (let i = 0; i < this.nodesSelectedUsingShift.length; i++) {
                    this.markParentAsUnSelected(this.nodesSelectedUsingShift[i]);
                }
                this.nodesSelectedUsingShift = [];
                item['selected'] = true;
                this.nodesSelectedUsingShift.push(item);
                this.initialShiftIndex = _.findIndex(this.localTree, function (o) { return o['Id'] === item['Id']; });
                this.firstSelectedElementId = item['Id'];
                this.lastShiftIndex = -1;
                this.secondSelectedElementId = null;
                return;
            }
            if (!this.firstSelectedElementId) {
                item['selected'] = true;
                this.nodesSelectedUsingShift.push(item);
                this.initialShiftIndex = _.findIndex(this.localTree, function (o) { return o['Id'] === item['Id']; });
                this.firstSelectedElementId = item['Id'];
            } else {
                item['selected'] = true;
                this.nodesSelectedUsingShift.push(item);
                this.lastShiftIndex = _.findIndex(this.localTree, function (o) { return o['Id'] === item['Id']; });
                this.secondSelectedElementId = item['Id'];
            }

            if (this.initialShiftIndex !== -1 && this.lastShiftIndex !== -1) {
                this.initialShiftIndex < this.lastShiftIndex ? this.initialIndex = this.initialShiftIndex : this.initialIndex = this.lastShiftIndex;
                this.lastShiftIndex < this.initialShiftIndex ? this.lastIndex = this.initialShiftIndex : this.lastIndex = this.lastShiftIndex;
                console.log('Initial Index: ', this.initialIndex);
                console.log('Last Index: ', this.lastIndex);
                for (let j = this.initialIndex; j <= this.lastIndex; j++) {
                    this.setSelectedNodesForShift(this.localTree[j]);
                }
                this.selectedItems = _.uniqBy(this.selectedItems, 'Id');
                // this.treeElementSelected.emit(this.selectedItems);
                this.nodesSelectedUsingShift = [];
                this.nodesSelectedUsingShift = _.cloneDeep(this.selectedItems);
                this.selectedItems = [];
                // console.log('Selected Items: ', this.selectedItems);

            }

        }

    }

    public setSelectedNodesForShift(item) {
        if (this.selectedItems.length > 0) {
            const index = _.findIndex(this.selectedItems, function (o) { return o['Id'] === item['Id']; });
            if (index === -1) {
                this.markChildrenAsSelected(item, true);
            } else {
                // this.selectedItems.splice(index, 1);
                this.markChildrenAsSelected(item, false);
            }
        } else {
            this.markChildrenAsSelected(item, true);
        }
        if (this.selectAllParentAndChild) {
            this.markParentAsSelected(item);
        }
    }

    public selectElementFromTree(item, event?) {
        if (event) {
            event.stopPropagation();
            if ((this.disableSelect && event.type === 'click' && event['currentTarget']['id'] !== 'addButton') && (!event['ctrlKey'] && !event['shiftKey'])) {
                return;
            }
            if ((this.disableSelect && event.type === 'click' && event['currentTarget']['id'] !== 'addButton') && (event['ctrlKey'] || event['shiftKey']) && (item['selected'] === true && item['nodesDragged'] === true)) {
                return;
            }
            if ((this.disableSelect && event.type === 'click' && event['currentTarget']['id'] !== 'addButton') && (event['ctrlKey'] || event['shiftKey'])) {
                this.selectWithCtrlEnabled = true;
                this.selectUsingCtrlShift(item, event);
                return;
            }
        }
        if (this.restrictSelectToLeafNode && item['children']) {
            return;
        }
        if (this.restrictSelectToSingleNode && this.selectedItems.length > 0) {
            this.selectedItems[0]['selected'] = false;
            this.selectedItems = [];
        }
        if (this.selectedItems.length > 0) {
            const index = _.findIndex(this.selectedItems, function (o) { return o['Id'] === item['Id']; });
            if (index === -1) {
                this.markChildrenAsSelected(item, true);
            } else {
                // this.selectedItems.splice(index, 1);
                this.markChildrenAsSelected(item, false);
            }
        } else {
            this.markChildrenAsSelected(item, true);
        }
        if (this.selectAllParentAndChild) {
            this.markParentAsSelected(item);
        }
        this.selectedItems = _.uniqBy(this.selectedItems, 'Id');
        this.treeElementSelected.emit(this.selectedItems);
        console.log('Selected Items: ', this.selectedItems);
    }
    public selectDraggedelementsFromTree(childrenList?) {
        if (!childrenList) {
            childrenList = this.localTree;
        }
        for (let i = 0; i < childrenList.length; i++) {
            if (childrenList[i]['Id'] === this.draggedElementToBeSelected['Id']) {
                childrenList[i]['selected'] = true;
                this.selectedItems.push(childrenList[i]);
                if (this.selectAllParentAndChild) {
                    this.markParentAsSelected(childrenList[i]);
                }
            } else {
                if (childrenList[i]['children']) {
                    this.selectDraggedelementsFromTree(childrenList[i]['children']);
                }
            }
        }
    }
    public handleExpandCollapse(event) {
        event.stopPropagation();
        const classList = event['target'].closest('li').classList;
        if (classList['value'].includes('expanded')) {
            event['target'].closest('li').classList.remove('expanded');
        } else {
            event['target'].closest('li').classList.add('expanded');
        }
    }

    public selectCheckMark(event, item) {
        event.stopPropagation();
        this.selectElementFromTree(item, event);
    }

    public markChildrenAsSelected(item, action?) {
        action ? item['selected'] = true : item['selected'] = false;
        // item['selected'] = !item['selected'];
        // item['selected'] ? this.selectedItems.push(item) : this.selectedItems.splice(this.selectedItems.indexOf(item, 0), 1);
        if (item['selected']) {
            this.selectedItems.push(item);
        } else {
            let ind = -1;
            for (let x = 0; x < this.selectedItems.length; x++) {
                if (this.selectedItems[x]['Id'] === item['Id']) {
                    ind = x;
                    break;
                }
            }
            if (ind >= 0) {
                this.selectedItems.splice(ind, 1);
            }
        }
        if (!item['selected']) {
            this.markParentAsUnSelected(item);
        }
        // this.selectedItems.push(item);
        if (this.selectAllParentAndChild) {
            if (item['children'] && item['children'].length > 0) {
                for (let i = 0; i < item['children'].length; i++) {
                    this.markChildrenAsSelected(item['children'][i], item['selected']);
                }
            }
        }

        this.selectedItems = _.uniqBy(this.selectedItems, 'Id');
    }

    public markParentAsUnSelected(item) {
        item['selected'] = false;
        if (item['ParentId']) {
            const index = _.findIndex(this.selectedItems, function (o) { return o['Id'] === item['ParentId']; });
            if (index >= 0) {
                const parent = this.selectedItems[index];
                this.selectedItems.splice(index, 1);
                this.markParentAsUnSelected(parent);
            }
        }
    }

    public markParentAsSelected(item) {
        if (item['ParentId'] && item['level'] === 0) {
            let childCount = 0;
            for (let i = 0; i < this.localTree.length; i++) {
                if (this.localTree[i]['Id'] === item['ParentId']) {
                    if (this.localTree[i]['children']) {
                        for (let j = 0; j < this.localTree[i]['children'].length; j++) {
                            if (this.localTree[i]['children'][j]['selected']) {
                                childCount++;
                            }
                        }
                        if (childCount === this.localTree[i]['children'].length) {
                            this.localTree[i]['selected'] = true;
                            this.selectedItems.push(this.localTree[i]);
                            this.markParentAsSelected(this.localTree[i]);
                        }
                    }

                }
            }
        } else if (item['ParentId'] && item['level'] && item['level'] > 0 && item['selected']) {
            let currentParent = null;
            let findParentId = item['ParentId'];
            const nestingLevel = item['level'] + 1;
            for (let k = item['level']; k >= 0; k--) {
                if (currentParent && currentParent['ParentId']) {
                    findParentId = currentParent['ParentId'];
                }
                const index = _.findIndex(this.actualRecords, function (o) { return o['Id'] === findParentId; });
                if (index >= 0) {
                    currentParent = this.actualRecords[index];
                }
            }
            console.log('Current parent: ', currentParent);
            const parentIndex = _.findIndex(this.localTree, function (o) { return o['Id'] === currentParent['Id']; });
            const treeParent = this.localTree[parentIndex];
            this.markAllParentAsSelected(treeParent, nestingLevel);
        }

    }
    public findObjectById(obj, Id) {
        if (obj['Id'] === Id) {
            obj['selected'] = true;
        }
        for (const a in obj) {
            if (obj.hasOwnProperty(a)) {
                const foundLabel = this.findObjectById(obj[a], Id);
                if (foundLabel) { obj['selected'] = true; }
            }
        }
        // return null;
    }

    public markAllParentAsSelected(treeParent, nestingLevel?) {
        if (treeParent && treeParent['children']) {
            for (let a = 0; a < treeParent['children'].length; a++) {
                if (treeParent['children'][a]['children'] && !treeParent['children'][a]['selected']) {
                    this.markAllParentAsSelected(treeParent['children'][a]);
                } else {
                    let checkedCount = 0;
                    for (let b = 0; b < treeParent['children'].length; b++) {
                        if (treeParent['children'][b]['selected']) {
                            checkedCount++;
                        }
                    }
                    const arrayIndex = _.findIndex(this.selectedItems, function (o) { return o['Id'] === treeParent['Id']; });
                    if (checkedCount === treeParent['children'].length && arrayIndex === -1) {
                        treeParent['selected'] = true;
                        this.selectedItems.push(treeParent);
                        this.markAllParentAsSelected(treeParent);
                    } else {
                        this.markParentAsSelected(treeParent);
                    }
                }
            }
        }
    }

    public handleRemove() {
        let ref = this;
        for (let i = 0; i < this['elementsToBeRemoved'].length; i++) {
            // this.markParentAsUnSelected(this['elementsToBeRemoved'][i]);
            // if (this.selectedItems.length > 0) {
            //     const index = _.findIndex(this.selectedItems, function (o) { return o['Id'] === ref['elementsToBeRemoved'][i]['Id']; });
            //     if (index >= 0) {
            //         this.selectedItems.splice(index, 1);
            //     }
            // }
            const index = _.findIndex(this.localTree, function (o) { return o['Id'] === ref['elementsToBeRemoved'][i]['Id']; });
            if (index >= 0) {
                this.localTree[index]['selected'] = false;
                // this.selectedItems
                const index2 = _.findIndex(this.selectedItems, function (o) { return o['Id'] === ref['elementsToBeRemoved'][i]['Id']; });
                if (index2 >= 0) {
                    this.selectedItems.splice(index2, 1);
                }
            } else {
                this.elementToBeRemoved = ref['elementsToBeRemoved'][i];
                this.handleRemoveImpl();
            }
        }
        this['elementsToBeRemoved'] = [];
        this.treeElementSelected.emit(this.selectedItems);
        ref = null;
    }

    public handleRemoveImpl(childrenList?) {
        let markedUnSelected = false;
        if (!childrenList) {
            childrenList = this.localTree;
        }
        for (let i = 0; i < childrenList.length; i++) {
            if (childrenList[i]['Id'] === this.elementToBeRemoved['Id']) {
                childrenList[i]['selected'] = false;
                markedUnSelected = true;
                let ref = this;
                if (this.selectAllParentAndChild) {
                    this.markParentAsUnSelected(childrenList[i]);
                }
                const index2 = _.findIndex(this.selectedItems, function (o) { return o['Id'] === ref['elementToBeRemoved']['Id']; });
                ref = null;
                if (index2 >= 0) {
                    this.selectedItems.splice(index2, 1);
                }
                break;
            } else {
                if (childrenList[i]['children']) {
                    this.handleRemoveImpl(childrenList[i]['children']);
                }
            }
        }

    }

    public menuItemClicked(id) {
        const obj = {
            menuItemId: id,
            selectedTreeElement: this.treeNodeForMenu
        };
        this.menuItemSelected.emit(obj);
    }

    public setNodeForMenuItem(event, selectedObject) {
        // this.renderer.setStyle(this.childMenu.nativeElement, 'top', (event.pageY - 50).toString() + 'px');
        // this.childMenu.nativeElement.style.top = (event.clientY - 50).toString() + 'px';
        this.treeNodeForMenu = selectedObject;
    }

    public dragStart(event, item) {
        event.stopPropagation();
        if (!this.selectWithCtrlEnabled) {
            this.drag.emit({ event: event, obj: item });
        } else {
            if (this.nodesSelectedUsingCtrl.length > 0) {
                this.drag.emit({ event: event, obj: this.nodesSelectedUsingCtrl });
            } else {
                this.drag.emit({ event: event, obj: this.nodesSelectedUsingShift });
            }
            this.selectWithCtrlEnabled = false;
        }
    }

    public selectAllNodesRecursively(select, tree) {
        if (!tree) {
            tree = this.localTree;
        }
        for (let i = 0; i < tree.length; i++) {
            tree[i]['selected'] = select;
            if (select) {
                this.selectedItems.push(tree[i]);
            }
            if (tree[i]['children']) {
                this.selectAllNodesRecursively(select, tree[i]['children']);
            }
        }
    }
    // public dragEnd(event, item) {
    //     event.stopPropagation();
    //     console.log('drag end');
    // }
}
