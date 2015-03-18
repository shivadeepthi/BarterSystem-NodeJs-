'use strict';

var request = require('supertest');
var should = require('should');
var app = require('./app').app;


describe('GET /category/1/product/1', function(){
  it('respond with json', function(done){
    request(app)
      .get('/category/1/product/1')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err){ return done(err);}
        done()
      });
  });
});

describe('GET /category/1/product/90', function(){
  it('respond with json', function(done){
    request(app)
      .get('/category/1/product/90')
      .expect(200)
      .end(function(err, res){
        if (err){ return done(err);}
        done()
      });
  });
});

describe('GET /category', function(){
  it('respond with json', function(done){
    request(app)
      .get('/category')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err){ return done(err);}
        done()
      });
  });
});

describe('GET /category/1', function(){
  it('respond with json', function(done){
    request(app)
      .get('/category/1')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err){ return done(err);}
        done()
      });
  });
});
describe('GET /category/50', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/category/50')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('GET /category/1/product/', function(){
  it('respond with json', function(done){
    request(app)
      .get('/category/1/product/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err){ return done(err);}
        done()
      });
  });
});


/***shiva
 * 
 */
describe('POST /category/1/product', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/category/1/product')
	      .set('Accept', 'application/json')
	      .send({ 
	    	  "productName":"Nani",
	    	  "quantity":2,
	    	  "userId":2,
	    	  "expectedOffer":"three oranges",
	    	  "prodDesc":"in a very good condition bought last week",
	    	  "prodExpiryDate":"2014-12-06",
	    	  "isValid":1,
	    	  "categoryId":1
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('POST /category', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/category')
	      .set('Accept', 'application/json')
	      .send({"categoryName":"food"})
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('PUT /category/1/product/1', function(){
	  it('respond with json', function(done){
	    request(app)
	      .put('/category/1/product/1')
	      .set('Accept', 'application/json')
	      .send({ 
	    	  "productName":"Nani",
	    	  "quantity":2,
	    	  "userId":2,
	    	  "expectedOffer":"three oranges",
	    	  "prodDesc":"in a very good condition bought last week",
	    	  "prodExpiryDate":"2014-12-06",
	    	  "isValid":1,
	    	  "categoryId":1
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('DELETE /category/1/product/1', function(){
	  it('respond with json', function(done){
	    request(app)
	      .del('/category/1/product/1')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});


/***shiva
 * 
 */


/*kinjal*/
describe('GET /category/1/product/1/offer/1', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/category/1/product/1/offer/1')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done();
	      });
	  });
	});

describe('GET /category/1/product/1/offer/91', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/category/1/product/1/offer/91')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done();
	      });
	  });
	});

describe('DELETE /category/1/product/1/offer/2', function(){
	  it('respond with json', function(done){
	    request(app)
	      .del('/category/1/product/1/offer/2')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('DELETE /category/1/product/1/offer/25', function(){
	  it('respond with json', function(done){
	    request(app)
	      .del('/category/1/product/1/offer/25')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('PUT /category/1/product/1/offer/1', function(){
	  it('respond with json', function(done){
	    request(app)
	      .put('/category/1/product/1/offer/1')
	      .set('Accept', 'application/json')
	      .send({ 
	    	  "offerId": 1,
	    	  "buyingQty": 4,
	    	  "offeredDetails": "programming books",
	    	  "buyerStatus": "Requested",
	    	  "sellerStatus": "Requested",
	    	  "offerExpiry": "2014-12-20",
	    	  "productId": 1,
	    	  "buyerId": 1,
	    	  "lastModified": "2014-12-08" 
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('PUT /category/1/product/1/offer/77', function(){
	  it('respond with json', function(done){
	    request(app)
	      .put('/category/1/product/1/offer/77')
	      .set('Accept', 'application/json')
	      .send({ 
	    	  "offerId": 77,
	    	  "buyingQty": 4,
	    	  "offeredDetails": "programming books",
	    	  "buyerStatus": "Requested",
	    	  "sellerStatus": "Requested",
	    	  "offerExpiry": "2014-12-20",
	    	  "productId": 1,
	    	  "buyerId": 1,
	    	  "lastModified": "2014-12-08" 
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

/*kinjal */
/*minu*/
describe('POST /category/:categoryId/product/:productId/offer', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/category/:categoryId/product/:productId/offer')
	      .set('Accept', 'application/json')
	      .send({ 
	    		  "buyingQty" : 1,
	    		  "offeredDetails" : "Ready to give the Scala-Programming Text book",
	    		  "buyerStatus" : "pending",
	    		  "sellerStatus" : "pending",
	    		  "offerExpiry" : "2015-10-10",
	    		  "productId" : 101,
	    		  "buyerId" : 10002,
	    		  "comments": "Please let me know as early as possible."
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('GET /category/:categoryId/product/:productId/offer', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/category/:categoryId/product/:productId/offer')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('POST /category/:categoryId/product/:productId/offer/:offerId/comment', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/category/:categoryId/product/:productId/offer/:offerId/comment')
	      .set('Accept', 'application/json')
	      .send({ 
	    		  "commentDesc" : "This is my first comment",
	    		  "userId" : 10001
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});
/*minu*/
//Laxmi

describe('GET /category/1/product/1/offer/1/history', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/category/1/product/1/offer/1/history')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('GET /category/1/product/1/offer/100/history', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/category/1/product/1/offer/100/history')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('GET /users', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/users')
	      .set('Accept', 'application/json')
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('POST /users', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/users')
	      .set('Accept', 'application/json')
	      .send({ 
	    	  "userId":1,
	    	  "firstName":"Mary",
	    	  "lastName":"Smith",
	    	  "emailId":"mary@test.com",
	    	  "mobile":456378987	    	  
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('POST /users', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/users')
	      .set('Accept', 'application/json')
	      .send({ 
	    	  "userId":1,
	    	  "firstName":"",
	    	  "lastName":"Smith",
	    	  "emailId":"mary@test.com",
	    	  "mobile":456378987	    	  
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});

describe('POST /users', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/users')
	      .set('Accept', 'application/json')
	      .send({ 
	    	  "userId":1,
	    	  "firstName":"Mary",
	    	  "lastName":"Smith",
	    	  "emailId":"mary@test.com",
	    	  "mobile":"abc"	    	  
	    	  })
	      .expect(200)
	      .end(function(err, res){
	        if (err){ return done(err);}
	        done()
	      });
	  });
	});