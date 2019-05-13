// required connections needed for bamazon to work
var inquirer = require('inquirer');
var mysql2 = require('mysql2');

// creating our connection to our database
var connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'lhncpjma9101',
    database: 'bamazon'
})

// promptManager will show the menu options available to the manger 
function promptManager() {
    // prompt to select an option 
    inquirer.prompt([
        {
            type: 'list',
            name: 'option', 
            message: 'Please select an option:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add a New Product'],
            // creating something like a switch case to filter through the options 
            filter: function (val) {
                if (val === 'View Products for Sale') {
                    return 'sale'
                } else if (val === 'View Low Inventory') {
                    return 'lowInventory'
                } else if (val === 'Add to Inventory') {
                    return 'addInventory'
                } else if (val === 'Add a New Product') {
                    return 'newProduct'
                } else {
                    console.log('Error: please select an existing operation')
                    exit(1)
                }
            }
        }
    ])
    .then(function(input) {
        // based on what the manager chooses as their action 
        if (input.option === 'sale') {
            displayInventory()
        } else if (input.action === 'lowInventory') {
            displayLowInventory()
        } else if (input.action === 'addInvetory') {
            addInventory()
        } else if (input.action === 'newProduct') {
            createNewProduct()
        } else {
            console.log('Error: please select an existing operation')
            exit(1)
        }
    })
}

function displayInventory() {
    // query db string
    queryStr = 'SELECT * FROM products'

    // db query 
    connection.query(queryStr, function(e, data) {
        if (e) throw e 

        console.log('Existing Invetory: ')
        console.log('-----------------------------\n')

        var strOut = ''
        for (var i = 0; i < data.length; i++) {
            strOut = ''
            strOut += 'Item ID: ' + data[i].item_id + '  //  '
			strOut += 'Product Name: ' + data[i].product_name + '  //  '
			strOut += 'Department: ' + data[i].department_name + '  //  '
			strOut += 'Price: $' + data[i].price + '  //  '
            strOut += 'Quantity: ' + data[i].stock_quantity + '\n'
            
            console.log(strOut)
        }

        console.log('-----------------------------\n')
        
        // then we end our database connection
        connection.end()
    })
}

// low invetory function to display list of products with quantity under a certain amount 
function displayLowInventory() {
    queryStr = 'SELECT * FROM products WHERE stock_quantity < 20'
    
    //db query
    connection.query(queryStr, function(e, data) {
        if (e) throw e 
        console.log('Low Inventory Items (below 20): ')
        console.log('-----------------------------\n')

        var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  '
			strOut += 'Product Name: ' + data[i].product_name + '  //  '
			strOut += 'Department: ' + data[i].department_name + '  //  '
			strOut += 'Price: $' + data[i].price + '  //  '
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n'

            console.log(strOut)
        }
        console.log('-----------------------------\n')

        // then we end our database connection
        connection.end()
    })
}

// addInventory function will add additional quantity to existing item 
function addInventory() {
    inquirer.promp ([ 
        {
            type: 'imput', 
            name: 'item_id', 
            mesage: 'Please enter the item ID for a stock_count update',
        },
        {
            type: 'imput', 
            name: 'quantity',
            message: 'How much of this product would you like to restock?'
        }
    ])
    .then(function(input) {
        var item = input.item_id
        var addQuantity = input.quantity 

        // querying our database to see the item ID and current stock count 
        var queryStr = 'SELECT * FROM products WHERE ?'

        connection.query(queryStr, {item_id: item}, function(e, data) {
            if (e) throw e 

            connection.query(queryStr, {item_id: item}, function(e, data) {
                if (e) throw e 

                if (data.length === 0) {
                    console.log('Error: invalid item ID, please enter in a valid item ID.')
                    // prompt addInventory function
                    addInventory()
                } else {
                    var productData = data[0]
                    console.log('Updating Inventory')

                    // updating query string 
                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (product.stock_quantity + addQuatity) + 'WHERE item_id = ' + item

                    // updating our inventory 
                    connection.query(updateQueryStr, function(e, data) {
                        if (e) throw e
                        
                        console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.')
                        console.log('-----------------------------\n')

                        // then we end our database connection 
                        connection.end()
                    })
                }
            })
        })
    })
}

// createNewProduct will guide the user in adding a new product to the inventory
function createNewProduct() {
    
	// Prompt the user to enter information about the new product
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
			validate: validateInteger
		}
	]).then(function(input) {

		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			// End the database connection
			connection.end();
		});
	})
}

// runBamazon will execute the main application logic
function runBamazon() {

	// Prompt manager for input
	promptManagerAction();
}

// Run the application logic
runBamazon();