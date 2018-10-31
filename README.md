# ngx-tree-view

ngx tree-view is a tree-view component which supports n-level of nesting with many fancy functionalities around the selection of the nodes.

# Supported frameworks
  - Angular 2+ (future release will have Angular6 support)

# Dependencies
- lodash
- line-awesome css

# Features

  - n-levels of nesting supported
  - multiple options available to selection of a node like checkboxes, item click etc.
  - highly configurable as per your need
  - uses no third-party libraries other than lodash

Configurations supported:
  - Configuration for showing checkboxes
  - Configurable option for propogating selection to parent and child nodes
  - Restrict selection to single leaf node only
  - Ability to remove selected nodes
  - Disabling selection of nodes
  - Selection of all nodes
  - Configuration for showing currency symbol
  - Configuration for showing tags for each node
  - Ability to disable selection


### Installation

Treeview requires [Node.js](https://nodejs.org/) v5+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm start
```

For production environments...

```sh
$ npm run build
```

### Input Attributes

Treeview components takes below configuration parameters.

| Attribute | Use | Mandatory | Default |
| ------ | ------ | -------| -----|
| actualRecords | Actual list of flat records | Y | NA
| checkBoxesRequired | To hide/show checkboxes for each node  | N | false
| selectAllParentAndChild | To auto select parent if all the child are selected and vise-versa | N | true
| restrictSelectToLeafNode | To restrict selection to leaf node only | N | false
| elementsToBeRemoved | List of elements to be removed | N | NA
| restrictSelectToSingleNode | To restrict selection to only one node | N | false
| disableSelectedNodes | To disbale selection of nodes | N | false
| removeSelectedNodes | To remove selected nodes from the tree | N | false 
| selectAllNodes | To selct all nodes | N | false
| disableSelect | To disbale selection | N | false
| hiddenCurrencySymbol | To hide label tag | N | false

### Events

| Event | Use | Description
|--- | ---| --- |
| treeElementSelected | List of selected nodes | Every time the selection changes, This event is triggered with the slected nodes


### Future Scope

- Drag and Drop support
- Tooltip support
- Context menu support


### Contributors
1. Rushabh Trivedi - Design and Development
2. Hinal Parikh - UI/ UX Design and Development

