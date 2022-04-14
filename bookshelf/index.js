// require('knex') returns a config function
// which we call immedaitely with an object
// as the first argument
const knex = require('knex')({
    client: 'mysql',  // which db tech are we using
    connection:{
        user:'ckx_foobar',
        password:'rotiprata123',
        database:'ckx_organic',
        host:"db4free.net"
    }
})

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;