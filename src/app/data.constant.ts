export const treeData = {
	'Result': [
		{
			'Id': 1,
			'Name': 'Node 1',
			'CurrencyId': 10,
			'IsFolder': true,
			'AvailabilityType': 1,
			'UserCanEdit': true,
			'IsActive': true,
			'Tag': 'T1',
		},
        { 'Id': 2, 'Name': 'Node 2', 'ParentId': 1, 'CurrencyId': 10, 'IsActive': true},
        { 'Id': 3, 'Name': 'Node 3', 'ParentId': 1, 'CurrencyId': 10 },
        { 'Id': 4, 'Name': 'Node 4', 'ParentId': 3, 'CurrencyId': 10, 'IsActive': true },
        { 'Id': 5, 'Name': 'Node 5', 'ParentId': 3, 'CurrencyId': 10, 'Tag': 'T1', },
        { 'Id': 6, 'Name': 'Node 6', 'ParentId': 1, 'CurrencyId': 10 },
        { 'Id': 7, 'Name': 'Node 7', 'ParentId': 3, 'CurrencyId': 10 },
        { 'Id': 8, 'Name': 'Node 8', 'ParentId': 3, 'CurrencyId': 10 },
        { 'Id': 19, 'Name': 'Node 19', 'ParentId': 8, 'CurrencyId': 10 },
        { 'Id': 20, 'Name': 'Node 20', 'ParentId': 8, 'CurrencyId': 10, 'Tag': 'T1', },
        { 'Id': 21, 'Name': 'Node 21', 'ParentId': 8, 'CurrencyId': 10 },
        { 'Id': 9, 'Name': 'Node 9', 'ParentId': 2, 'CurrencyId': 10, 'IsActive': true },
        { 'Id': 10, 'Name': 'Node 10', 'CurrencyId': 10, 'IsFolder': true },
        { 'Id': 11, 'Name': 'Node 11', 'ParentId': 10, 'CurrencyId': 10, 'Tag': 'T1', },
        { 'Id': 12, 'Name': 'Node 12', 'ParentId': 10, 'CurrencyId': 10 },
        { 'Id': 13, 'Name': 'Node 13', 'ParentId': 11, 'CurrencyId': 10 },
        { 'Id': 14, 'Name': 'Node 14', 'ParentId': 11, 'CurrencyId': 10, 'IsActive': true },
        { 'Id': 15, 'Name': 'Node 15', 'ParentId': 12, 'CurrencyId': 10 },
        { 'Id': 16, 'Name': 'Node 16', 'ParentId': 4, 'CurrencyId': 10 },
        { 'Id': 17, 'Name': 'Node 17', 'ParentId': 16, 'CurrencyId': 10 },
        { 'Id': 18, 'Name': 'Node 18', 'ParentId': 16, 'CurrencyId': 10 },
	],
	'CurrencyLookup': {
		'1': 'AFN',
		'2': 'ARS',
		'3': 'AWG',
		'4': 'AUD',
		'5': 'AZN',
		'6': 'BRL',
		'7': 'COP',
		'8': 'EUR',
		'9': 'USD',
		'10': 'INR'
	},
	'FoldersLookup': {
		'1': {
			'Id': 1,
			'Name': 'Folder1',
			'Order': 1,
			'RateCategoryType': 1
		},
		'2': {
			'Id': 2,
			'Name': 'Folder2',
			'Order': 1,
			'RateCategoryType': 1
		},
		'3': {
			'Id': 3,
			'Name': 'Folder3',
			'Order': 1,
			'RateCategoryType': 1
		},
		'4': {
			'Id': 4,
			'Name': 'Folder4',
			'Order': 1,
			'RateCategoryType': 1
		}
	},
}