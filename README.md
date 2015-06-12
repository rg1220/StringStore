# StringStore
Store name-value pairs in an array-like fashion.

This library lets you store name-value pairs in a MongoDB database.

---------------
# Use

Require `StringStore`:

    var StringStore = require('stringstore');
  
Connect to a database:

    var db = new StringStore('mongodb://localhost/test', function(err) {
    });

---------------
##### Peek
Get most recent value for name:

    db.peek('name', function(err, value) {
        //value = {created: Date, value: String}
    });
    
---------------
##### Peek Many
Get all values for name:

    db.peekMany('name', function(err, values) {
        //values = [{created: Date, value: String}, {created: Date, value: String}]
    });

---------------
##### Push
Push value for name:

    db.push('name', 'value', function(err) {
    });

---------------
##### Push Many    
Push values for name:

    db.push('name', ['value0', 'value1', 'value2'], function(err) {
    });
