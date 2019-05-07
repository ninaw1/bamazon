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

// to validate that input of supplies are all positive 
// function validateInput(value) {
//     var integer = Number.isInteger(parseFloat(value))
//     var sign = Math.sign(value)

//     if (integer && (sign === 1)) {
//         return true
//     } else {
//         return 'Please enter a positive number!'
//     }
// }
// prompt user to enter id of the product user would like to buy
function promptUser() {
    console.log('enter id of item user would like to purchase')
    // prompt user to input id of item they would like to purhcase 
    inquirer.prompt([
        {
            type: 'input', 
            name: 'item_id',
            message: 'Please enter the ID of the item you would like to puchase.',
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to purchase?',
        }
    ])
    .then(function(input) {
        console.log('Customer has selected: \n    item_id = '  + input.item_id + '\n    quantity = ' + input.quantity)

        var item = input.item_id
        var quantity = input.quantity

        // query databse and confirm the ID exists in the desired quantity 
        var queryStr = "SELECT * FROM products WHERE ?"
        connection.query(queryStr, {item_id: item}, function(e, data) {
            if (e) throw e 
            // if user inputs an invalid item ID, the data arry will not produce anything 
            console.log('data = ' + JSON.stringify(data))

            // show error message if entered ID is = 0 
            if(data.length === 0) {
                console.log('Error: Invalid Item ID. Please enter a valid Item ID')
                displayInventory(); 
            } else {
                var productData = data[0]
                console.log('productData =' + JSON.stringify(productData))
                console.log('productData.stock_quantity =' + productData.stock_quantity)

                // if the quantity requested by the user is in stock then we proceed: 
                if (quantity <= productData.stock_quantity) {
                    console.log('Congratulations, the product you have requested is currently in stock. \n Your order has been placed')

                    // update item quantity in the database 
                    var updateQueryStr = "UPDATE products SET stock_quantity =" + (productData.stock_quantity - quantity) + 'WHERE item_id =' + item
                    console.log(`updatedQueryStr =${updateQueryStr}` )

                    // updating inventory: 
                    connection.query(updateQueryStr, function(e, data) {
                        if (e) throw e 
                        console.log('Your total is $' + productData.price * quantity)
                        console.log('Your order has been placed! Thank you for shopping with us!')
                        console.log('-----------------------------------------')

                        // end the database connection to stop terminal running 
                        connection.end()
                    })
                } else {
                    console.log('Sorry, there is currently not enough product in stock, and your order cannot be placed.')
                    console.log('Pleaes modify your order.')
                    console.log('-----------------------------------------')
                    // display the current inventory 
                    displayInventory()
                }
            }
        })
    }) 
}
// displayInventory will retrieve the current stock from the inventory and display it on our terminal 
function displayInventory() {
    // db query string 
    queryStr = 'SELECT * FROM products'
    // create db query 
    connection.query(queryStr, function(e, data) {
        if (e) throw e 
        console.log('Existing Inventory: ')
        console.log('-----------------------------------------')

        var strOut = ''
        // looping through our data 
        for (var i = 0; i < data.length; i ++) {
            strOut = ''
            strOut += 'Item Id: ' + data[i].item_id + ' // '
            strOut += 'Product Name: ' + data[i].product_name + ' // '
            strOut += 'Department: ' + data[i].department_name + ' // '
            strOut += 'Price: $' + data[i].price + ' // '
            strOut += 'Stock Quantity: ' + data[i].stock_quantity + '\n'

            console.log(strOut)
        }
        console.log('-----------------------------------------')

        // how many would the user like to purchase 
        promptUser()
    })
    // connection.end()
}

// running the logic of our application 
function startBamazon() {
    displayInventory()
}

startBamazon()