var MongoClient = require('mongodb').MongoClient;

/**
 * Store an array of name value pairs. Each pair also gets a timestamp and are arranged into an array
 * @param {String} url URL to the MongoDB Database
 * @param {Function(Error)} onConnected Function to call on success/failure
 */
function Database(url, onConnected) {
	var self = this;
	try {
		MongoClient.connect(url, function (err, db) {
			if (err) {
				if (onConnected)
					setImmediate(onConnected, err);
			}
			else {
				self.db = db;
				self.collection = db.collection('StringStore');
				if (onConnected)
					setImmediate(onConnected, null);
			}
		});
	}
	catch (e) {
		console.log(e);
		if (onConnected)
			setImmediate(onConnected, new Error('Failed to connect to database'));
	}
}

/**
 * Closes the database connection if there is one.
 */
Database.prototype.close = function close() {
	try {
		this.db.close();
	}
	catch (e) {
		console.error(e);
	}
};

/**
 * Add a string to the array for the name provided
 * @param {String} name Name of the name-value array
 * @param {String} s A value to push to the name-value array.
 * @param {Function(Error)} callback Function to call on success/failure
 */
Database.prototype.push = function push(name, s, callback) {
	try {
		this.collection.insert({ name: name, created: new Date(), value: s }, function(err, num, status) {
			if (err || num == null) {
				console.error(err);
				if (callback)
					setImmediate(callback, new Error('Failed to push value to database'));
			}
			else if (callback)
				setImmediate(callback, null);
		});
	}
	catch (e) {
		console.log(e);
		if (callback)
			setImmediate(callback, new Error('Failed to insert value to database'));
	}
};

/**
 * Add multiple strings to the array for the name provided
 * @param {String} name Name of the name-value array
 * @param {String} s Array of values to push to the name-value array.
 * @param {Function(Error)} callback Function to call on success/failure
 */
Database.prototype.pushMany = function pushMany(name, arr, callback) {
	try {
		for (var i = arr.length - 1; i > -1; i--) {
			arr[i] = {name: name, created: new Date(), value: arr[i]};
		}
		
		this.collection.insert(arr, function(err, num, status) {
			if (err || num == null) {
				console.error(err);
				if (callback)
					setImmediate(callback, new Error('Failed to push values to database'));
			}
			else if (callback)
				setImmediate(callback, null);
		});
	}
	catch (e) {
		console.log(e);
		if (callback)
			setImmediate(callback, new Error('Failed to insert values to database'));
	}
};

/**
 * Get the most recent string for the name provided
 * @param {String} name Name of the name-value array
 * @param {Function(Error, Value)} callback Function to call on success/failure with value
 */
Database.prototype.peek = function peek(name, callback) {
	try {
		this.collection.find({ name: name }, { _id: false, name: true, created: true, value: true }, { sort: [['created', 'desc']], limit: 1 }, function (err, cursor) {
			if (err) {
				console.error(err);
				if (callback)
					setImmediate(callback, new Error('Failed to peek at one string.'));
			}
			else if (callback) {
				cursor.toArray(function (err, docs) {
					if (err) {
						console.error(err);
						setImmediate(callback, new Error('Failed to convert cursor to array.'), null);
					}
					else if (docs == null || docs.length == 0)
						setImmediate(callback, null, null);
					else
						setImmediate(callback, null, docs[0]);
				});
			}
		});
	}
	catch (e) {
		console.log(e);
		if (callback)
			setImmediate(callback, new Error('Failed to find value in database'));
	}
};

/**
 * Get the most recent strings for the name provided
 * @param {String} name Name of the name-value array
 * @param {Function(Error, Values)} callback Function to call on success/failure with values
 */
Database.prototype.peekMany = function peekMany(name, callback) {
	try {
		this.collection.find({ name: name }, { _id: false, name: true, created: true, value: true }, { sort: [['created', 'desc']] }, function (err, cursor) {
			if (err) {
				console.error(err);
				if (callback)
					setImmediate(callback, new Error('Failed to peek at all strings.'));
			}
			else if (callback) {
				cursor.toArray(function (err, docs) {
					if (err) {
						console.error(err);
						setImmediate(callback, new Error('Failed to convert cursor to array.'), null);
					}
					else if (docs == null || docs.length == 0)
						setImmediate(callback, null, null);
					else
						setImmediate(callback, null, docs);
				});
			}
		});
	}
	catch (e) {
		console.log(e);
		if (callback)
			setImmediate(callback, new Error('Failed to find values in database'));
	}
};

module.exports = Database;