// required connections needed for bamazon to work
const inquirer = require('inquirer')
const { createConnection } = require('mysql2')

// creating our connection to our database
const db = createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'lhncpjma9101',
    database: 'bamazon'
})

async function promptUser () {
    let response = await new Promise((resolve, reject) => {
        db.query('UPDATE products SET stock_quantity =', (e, r) => {
            if (e) {
                reject(e)
            } else {
                resolve(r)
            }
        })
    })
    return response
}

var promptUser = _ => {
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
    .then(input = _ => {
        // our input information
        const item = input.item_id
        const quantity = input.quantity
        var productData = data[0]

        // if the quantity entered is less than the stock quantity console log order placed
        if (quantity <= productData.stock_quantity) {
            console.log('Congratulations, the product you have requested is currently in stock! Your order has been placed!')

        // update the quantity in database
        const updateStock = 'UPDATE products SET stock_quantity =' + (productData.stock_quantity - quantity) + 'WHERE item_id =' + item
        console.log(`updatedStock = ${updateStock}`)

        // calculating total and placing user order
        db.query(updateStock, function(e, data) {
            if (e) throw e
            console.log(`Your current total is $${productData.price * quantity}`)
            console.log('Your order has been placed! Thank you for shopping with us!')
            console.log('-----------------------------------------')

            // end connection
            connection.end()
        })
        } else {
            console.log('Sorry, there is currently not enough product in stock, and your order cannot be placed.')
            console.log('Pleaes modify your order.')
            console.log('-----------------------------------------')
            
            // display the current inventory 
            viewInventory()
            .catch(e => console.log(e))
        }
    })
}

const viewInventory = _ => {
    db.query('SELECT * FROM products', (e, r) => {
        if (e) throw e
        r.forEach(({ item_id, product_name, department_name, price, stock_quantity} ) => 
        console.log(`
        ***************************
        Existing Inventory: 
        Product Id: ${item_id} // Product Name: ${product_name} // Department: ${department_name} // Price: ${price} // Stock Quantity: ${stock_quantity}
        ***************************
        `))
        promptUser()
    })
}

function startBamazon() {
    viewInventory()
}

startBamazon()
