// require in bookshelf
const bookshelf = require('../bookshelf')

// we can use bookshelf to create models
// bookshelf.model => func, used to create a bookshelf model
// first arg: name of the model (first alphabet uppercase)
// second arg: config object, numerous options
//  - tableName: the name of the table in the database
// - the name of the model should be the singular, upper case
// version of the table name
// - the table name should always be in all lower case
// plural form
const Product = bookshelf.model('Product',{
    tableName:'products',
    category:function(){
        return this.belongsTo('Category')
    }
})

// name of the table = all lower case, plural
// name of model = first alphabet upper case, singular
const Brand = bookshelf.model('Brand',{
    tableName: 'brands'
})

const Category = bookshelf.model('Category',{
    tableName:'categories'
})

module.exports = {
    Product, Brand, Category
}