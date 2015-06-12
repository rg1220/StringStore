var expect = require("chai").expect;
var StringStore = require('../StringStore.js');

describe('StringStore', function () {
	
	before(function(done) {
		stringStore = new StringStore('mongodb://localhost/test', function(err) {
			if (err)
				throw err;
			done();
		});
	});
	
	describe('pushMany(name, values)', function () {
		it('should push many values to the array for the name', function (done) {
			var count = 2;
			stringStore.pushMany('some name', ['some value000', 'some value000', 'some value000', 'some value000'], function(err) {
				if (err)
					throw err;
					
				count--;
				if (count == 0)
					done();
			});
			stringStore.pushMany('other name', ['other value000', 'other value000', 'other value000', 'other value000'], function(err) {
				if (err)
					throw err;
					
				count--;
				if (count == 0)
					done();
			});
		});
	});
	
	describe('peekMany(name)', function () {
		it('should get all the values pushed', function (done) {
			var count = 2;
			
			stringStore.peekMany('some name', function(err, values) {
				if (err)
					throw err;
				
				expect(values).to.be.instanceof(Array);
				
				for (var i = 0; i < 4; i++) {
					expect(values[i].value).to.equal('some value000');
					expect(values[i].created).to.be.instanceof(Date);
				}
				
				count--;
				if (count == 0)
					done();
			});
			
			stringStore.peekMany('other name', function(err, values) {
				if (err)
					throw err;
				
				expect(values).to.be.instanceof(Array);
				
				for (var i = 0; i < 4; i++) {
					expect(values[i].value).to.equal('other value000');
					expect(values[i].created).to.be.instanceof(Date);
				}
				
				count--;
				if (count == 0)
					done();
			});
		});
	});
	
	describe('push(name, value)', function () {
		it('should push one value for the name', function (done) {
			var count = 2;
			
			stringStore.push('some name', 'some value', function (err) {
				if (err)
					throw err;
					
				count--;
				if (count == 0)
					done();
			});
			
			stringStore.push('other name', 'other value', function (err) {
				if (err)
					throw err;
				
				count--;
				if (count == 0)
					done();
			});
		});
	});
	
	describe('peek(name)', function () {
		it('should get one value for the name', function (done) {
			var count = 2;
			
			stringStore.peek('some name', function(err, value) {
				if (err)
					throw err;
					
				expect(value.value).to.equal('some value');
				expect(value.created).to.be.instanceof(Date);
				
				count--;
				if (count == 0)
					done();
			});
			
			stringStore.peek('other name', function(err, value) {
				if (err)
					throw err;
					
				expect(value.value).to.equal('other value');
				expect(value.created).to.be.instanceof(Date);
				
				count--;
				if (count == 0)
					done();
			});
		});
	});
	
	after(function() {
		stringStore.close();
	});
	
});