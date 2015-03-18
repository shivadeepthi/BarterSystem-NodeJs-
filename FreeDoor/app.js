var application_root = __dirname,
    express = require("express"),
    path = require("path"),
	ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");
var offer = require("./offerDetails");  //kinjal

var app = exports.app = express();

var title = 'EJS template with Node.JS';
var data = 'Data from node';
var categories_freeDoor;
var categories_freeDoor_count;

//Load Balancing: Define the servers to load balance.
var servers = [

{host: '192.168.10.2', port: 4242},
{host: '192.168.10.3', port: 4242},
{host: '192.168.10.4', port: 4242}
];

var proxies = servers.map(function (target) {
	  return new httpProxy.createProxyServer({
	    target: target
	  });
	});

//Select the next server and send the http request.
var serverCallback = function(req, res) {
  var proxy = proxies.shift();
  console.log(proxy);
  proxy.web(req, res); 
  proxies.push(proxy);
};
var server = http.createServer(serverCallback);
 
server.listen(3000);


app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	
	app.use(express.static(path.join(application_root, "")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.cookieParser());
	app.use(express.session({secret: "LP1988"}));
	app.use(app.router);
});
function getProduct_Details(req,res,product_Id){
		mysql.getProductDetails(function(err,results){
					if(err){
						throw err;
					}else{
						if(results === null){
							res.send({Error : "No products found"});
						}
						else{
						var results_new= JSON.stringify(results);
						console.log("test json"+results_new);
						res.end(results_new);		
						}
					}
				},product_Id);
}
function getCategory_Details(req,res,Category_Id){
	mysql.getCategoryDetails(function(err,results){
				if(err){
					throw err;
					throw err;
				}else{
					if(results === null){
						res.send({Error : "No Catergory found"});
					}
					else{
					var results_new= JSON.stringify(results);
					console.log("test json"+results_new);
					res.end(results_new);	
					}
					
				}
			},Category_Id);
}

function getProducts(req,res,categoryId){
	mysql.getProducts(function(err,results){
				if(err){
					throw err;
				}else{
					if(results === null){
						res.send({Error : "No products find"});
					}
					else{
					var results_new= JSON.stringify(results);
					console.log("test json"+results_new);
					res.end(results_new);	
					}
				}
			},categoryId);
}

function getcategories(req,res){
	mysql.getCategory(function(err,results){
				if(err){
					throw err;
				}else{
					if(results === null){
						res.send({Error : "No Categories find"});
					}
					else{
						var results_new= JSON.stringify(results);
						console.log("test json"+results_new);
						res.end(results_new);	
					}
					
				}
			});
}

/**Minu**/
function getOffer(req,res,session,categoryId,productId){
//	res.setHeader({ 'Content-Type': 'application/json' });
	mysql.getOffers(function(err,results){
		if(err){
			throw err;
		}else{
			offers_freeDoor = results;
			offers_freeDoor_count = results.length;
			res.send(results);
		}
	}, categoryId, productId, function(error)
	{
		res.send("No such Offers!");
	});
}

function createOffer(req,res,session,categoryId,productId){
	var buyerId = req.body.buyerId;
	mysql.checkUser(function(err,result){
		if(err){
			throw err;
		}else{
			var buyerId = result[0].userId;
			var quantity = req.body.buyingQty;
			var offerDet = (req.body.offeredDetails).replace(/(<([^>]+)>)/ig,"");
			var buyerStatus = (req.body.buyerStatus).replace(/(<([^>]+)>)/ig,"");
			var sellerStatus = (req.body.sellerStatus).replace(/(<([^>]+)>)/ig,"");
			var offerExpiry = req.body.offerExpiry;
			var productId = req.body.productId;
			mysql.checkProduct(function(err,result){
				if(err){
					throw err;
				}else{
					var productId=result[0].productId;
					mysql.getPreviousOfferId(function(err, results) {
						if(err){
							throw err;
						}
						else {
							
							var prev_offerId = results;
							console.log("Previous ID : "+prev_offerId);
							mysql.postOfferDetails(function(err,results,data){
								if(err){
									throw err;
								}else{
									offers_freeDoor = results;
									offers_freeDoor_count = results.length;
									res.send(data);
								}
							}, categoryId, prev_offerId, productId, quantity, offerDet, buyerStatus, sellerStatus, offerExpiry, productId, buyerId);
						}
					});
				}
			}, productId);
		}
	}, buyerId);
}

function createComments(req,res,session,categoryId,productId, offerId){
	var userId = req.body.userId;
	mysql.checkUser(function(err,result){
		if(err){
			throw err;
		}else{
			var userId=result[0].userId;
			var commentDesc = (req.body.commentDesc).replace(/(<([^>]+)>)/ig,"");
			mysql.postComments(function(err,results, data){
				if(err){
					throw err;
				}else{
					comments_freeDoor = results;
					comments_freeDoor_count = results.length;
					res.send(data);
				}
			}, categoryId, productId, offerId, commentDesc, userId);
		}
	}, userId);
	
}

/**Minu**/

app.get('/category', function (req, res) {
	getcategories(req, res);	
});
app.get('/category/:categoryId', function (req, res) {
	var category_id = req.params.categoryId;
	var errMsg = "";
	if(isNaN(category_id)){
		errMsg = "Invalid categoryId";
	}
	if(errMsg===""){
		getCategory_Details(req, res, req.params.categoryId);
	}
	else{
		res.send(errMsg);
	}
		
});

app.get('/category/:categoryId/product/:productId', function (req, res) {
	console.log("id"+req.params.categoryId);
	var category_id = req.params.categoryId;
	var product_id = req.params.productId;
	var errMsg = "";
	if(isNaN(category_id)){
		errMsg = "Invalid categoryId";
	}
	if(isNaN(product_id)){
		errMsg = "Invalid productId";
	}
	if(errMsg===""){
		getProduct_Details(req,res,req.params.productId);
	}
	else{
		res.send(errMsg);
	}
	
});

app.get('/category/:categoryId/product/', function (req, res) {
	console.log("id"+req.params.categoryId);
	var category_id = req.params.categoryId;
	var errMsg = "";
	if(isNaN(category_id)){
		errMsg = "Invalid categoryId";
	}
	if(errMsg===""){
		getProducts(req,res,req.params.categoryId);
	}
	else{
		res.send(errMsg);
	}

});
/*****shiva
 * req.param('categoryName')
 */

app.post('/category', function (req, res) {
	var input=JSON.parse(JSON.stringify(req.body));
			if(input.categoryName!=null){
				var categoryName=(input.categoryName).replace(/(<([^>]+)>)/ig,"");
				console.log(categoryName);
				mysql.checkCategoryName(function(err,result){
					if(err){
						throw err;
					}else if(result[0].count>1){
						res.send("category name already exists");
					}
					else{
						mysql.createNewCategory(function(err,result,data){
							if(err){
								throw err;
							}else{
								res.send(200,data);
							}},categoryName);
					}
				},categoryName);
			}
});

/***{
"productName":"three secrets of life",
"quantity":2,
"userId":2,
"expectedOffer":"three oranges",
"prodDesc":"in a very good condition bought last week",
"prodExpiryDate":"2014-12-06",
"isValid":1,
"categoryId":1
}
****/

app.post('/category/:categoryId/product', function (req, res) {
	var input=JSON.parse(JSON.stringify(req.body));
	if(input.productName!==null&&input.quantity!=null&&input.userId!=null&&input.expectedOffer!=null&&input.prodExpiryDate!=null&&input.isValid!=null&&input.categoryId!=null){
		var productName=(input.productName).replace(/(<([^>]+)>)/ig,"");
		var quantity=(input.quantity);
		var userId=(input.userId);
		mysql.checkUser(function(err,result){
			if(err){
				throw err;
			}else{
				console.log(result[0].userId);
				var userId=result[0].userId;
				var expectedOffer=(input.expectedOffer).replace(/(<([^>]+)>)/ig,"");
		    	var prodDesc=(input.prodDesc).replace(/(<([^>]+)>)/ig,"");
		    	var prodExpiryDate=(input.prodExpiryDate).replace(/(<([^>]+)>)/ig,"");
				var isValid1=(input.isValid);
				var isValid= " b'"+isValid1+"'";
				console.log("isValid"+isValid);
		    	var categoryId=(input.categoryId);
		    	mysql.checkCategory(function(err,result){
					if(err){
						throw err;
					}else{
						console.log(result[0].categoryId);
						var categoryId=result[0].categoryId;
						mysql.createNewProduct(function(err,result,data){
				    		if(err){
				    			throw err;
				    		}else{
				    			res.send(200,data);
				    			console.log("product succesfully created");
				    		}},productName,quantity,userId,expectedOffer,prodDesc,prodExpiryDate,isValid,categoryId);
					}
				},categoryId);
		    	
			}
		},userId);	
    }
});

app.put('/category/:categoryId/product/:productId', function (req, res) {
	var input=JSON.parse(JSON.stringify(req.body));
	if(req.params.productId!=null&&input.productName!==null&&input.quantity!=null&&input.userId!=null&&input.expectedOffer!=null&&input.prodDesc!=null&&input.prodExpiryDate&&input.isValid!=null&&input.categoryId!=null){
		var productId=(req.params.productId).replace(/(<([^>]+)>)/ig,"");
		mysql.checkProduct(function(err,result){
			if(err){
				throw err;
			}else{
				console.log("productId "+result[0].productId);
				var productId=result[0].productId;
				var productName=(input.productName).replace(/(<([^>]+)>)/ig,"");
				var quantity=(input.quantity);
				var userId=(input.userId);
				mysql.checkUser(function(err,result){
					if(err){
						throw err;
					}else{
						console.log(result[0].userId);
						var userId=result[0].userId;
						var expectedOffer=(input.expectedOffer).replace(/(<([^>]+)>)/ig,"");
				    	var prodDesc=(input.prodDesc).replace(/(<([^>]+)>)/ig,"");
				    	var prodExpiryDate=(input.prodExpiryDate).replace(/(<([^>]+)>)/ig,"");
						var isValid1=(input.isValid);
						var isValid= " b'"+isValid1+"'";
						console.log("isValid"+isValid);
						var categoryId=(input.categoryId);
						mysql.checkCategory(function(err,result){
							if(err){
								throw err;
							}else{
								console.log(result[0].categoryId);
								var categoryId=result[0].categoryId;
								mysql.updateProduct(function(err,result,data){
						    		if(err){
						    			throw err;
						    		}else{
						    			res.send(200,data);
						    			console.log("product succesfully updated");
						    		}},productId,productName,quantity,userId,expectedOffer,prodDesc,prodExpiryDate,isValid,categoryId);
							}
						},categoryId);
						
					}
				},userId);
			}
		},productId);	
    	
    }
	});
	

app.del('/category/:categoryId/product/:productId', function (req, res) {
//	var input=JSON.parse(JSON.stringify(req.body));
    var categoryId=	(req.params.categoryId);
    var productId=(req.params.productId);
	mysql.deleteProduct(function(err,result){
		if(err){
			throw err;
		}else{
			res.send(200,"product deleted");
			console.log("product succesfully deleted");
		}},categoryId,productId);
	});

/******shiva
 * 
 */

/*kinjal-start*/
app.get('/category/:categoryId/product/:productId/offer/:offerId', function(req,res){
	//app.get('/offer', function(req,res){
		 res.setHeader('Content-Type','application/json');
		var offerId = req.params.offerId;
		var categoryId =req.params.categoryId;
		var productId = req.params.productId;

		var errMsg = "";
		if(isNaN(offerId)){
			errMsg = "Invalid Offer Id";
		}
		if(isNaN(categoryId)){
			if(errMsg === "")
				errMsg = "Invalid Category Id";
			else
				errMsg = errMsg + ", Category Id";
		}
		if(isNaN(productId)){
			if(errMsg === "")
				errMsg = "Invalid Product Id";
			else
				errMsg = errMsg + ", Product Id";
		}
		if(errMsg==="")
			offer.getOfferDetailsbyOfferId(req,res,offerId,productId);
		else
			res.send({Error :errMsg});
	});

/*{
    "offerId": 2,
    "buyingQty": 2,
    "offeredDetails": "Ready to give the Java-Programming as well",
    "buyerStatus": "Requested",
    "sellerStatus": "Requested",
    "offerExpiry": "2015-10-10",
    "productId": 2,
    "buyerId": 2,
    "lastModified": "2014-12-09"   
}*/

app.put('/category/:categoryId/product/:productId/offer/:offerId',function(req,res){
		var offerId = req.params.offerId;
		var data = JSON.parse(JSON.stringify(req.body));
		var buyingQty = data.buyingQty;
		var offeredDetails = data.offeredDetails;
		var buyerStatus = data.buyerStatus;
		var sellerStatus = data.sellerStatus;
		var offerExpiry = data.offerExpiry;
		var productId = data.productId;
		var buyerId = data.buyerId;
		var errMsg = "";
		
		if(isNaN(offerId)){
			errMsg = "Invalid Offer Id";
		}
		if(isNaN(buyingQty)){
			if(errMsg === "")
				errMsg = "Invalid buyingQty";
			else
				errMsg = errMsg + ", Category Id";
		}
		if(isNaN(productId)){
			if(errMsg === "")
				errMsg = "Invalid Product Id";
			else
				errMsg = errMsg + ", Product Id";
		}
		if(buyerStatus != "Requested" && buyerStatus != "Accepted" && buyerStatus != "Rejected"){
			
			if(errMsg === "")
				errMsg = "Invalid Buyer Status";
			else
				errMsg = errMsg + ", Buyer Status";
		}
		if(sellerStatus !== "Requested" && sellerStatus !== "Accepted" && sellerStatus !== "Rejected"){
			if(errMsg === "")
				errMsg = "Invalid seller Status";
			else
				errMsg = errMsg + ", seller Status";
		}	
		if(isNaN(buyerId)){
			if(errMsg === "")
				errMsg = "Invalid Buyer Id";
			else
				errMsg = errMsg + ", Buyer Id";
		}
		if(errMsg==="")
			offer.updateOfferDetails(req,res,offerId,buyingQty, offeredDetails, buyerStatus, sellerStatus, offerExpiry, productId, buyerId);
		else
			res.send({Error : errMsg});
});

app.del('/category/:categoryId/product/:productId/offer/:offerId',function(req,res){
		//res.setHeader('Content-Type','application/json');
		var offerId = req.params.offerId;
		var errMsg = "";
		if(isNaN(offerId)){
			errMsg = "Invalid Offer Id";
		}
		if(errMsg==="")
			offer.deleteOfferId(req,res,offerId);
		else
			res.send(errMsg);
});

/*kinjal-end*/
/*minu*/
app.get('/category/:categoryId/product/:productId/offer', function (req, res) {

	getOffer(req, res, req.session, req.param('categoryId'), req.param('productId'));

});

app.post('/category/:categoryId/product/:productId/offer', function (req, res)
{
	// add post for comments and call it
	createOffer(req, res, req.session, req.param('categoryId'), req.param('productId'));
});


app.post('/category/:categoryId/product/:productId/offer/:offerId/comment', function (req, res)
{
	createComments(req, res, req.session, req.param('categoryId'), req.param('productId'), req.param('offerId'));
});
/*minu*/
/* Laxmi */

function getUsers(req,res){
	mysql.getUsers(function(err,results){
				if(err){
					throw err;
				}else{
					if(results === null){
						res.send({Error : "No users found"});
					}
					else{
						var results_new= JSON.stringify(results);
						console.log("Users"+results_new);
						res.end(results_new);	
					}
					
				}
			});
}
app.get('/category/:categoryId/product/:productId/offer/:offerId/history', function(req,res){
	res.setHeader('Content-Type','application/json');
	var offerId = req.params.offerId;
	
	var errMsg = "";
	if(isNaN(offerId)){
		errMsg = "Invalid Offer Id";
	}
	
	if(errMsg==="")
		offer.getOfferHistory(req,res,offerId);
	else
		res.send(errMsg);
});

app.get('/users', function(req,res){
getUsers(req,res);

});

/***{
"userId":3,
"firstName":"John",
"lastName":"Doe",
"emailId":"john@abc.com",
"mobile":"456378987",
}
****/


app.post('/users', function (req, res) {
var input=JSON.parse(JSON.stringify(req.body));
//var productId=input.productId;
if(input.firstName!=null){
	var firstName=input.firstName;
}
if(input.lastName!=null){
	var lastName=input.lastName;
}
if(input.emailId!=null){
	var emailId=input.emailId;
}
if(input.mobile!=null){
	var mobile=input.mobile;
}

var errMsg = "";
if(firstName == ""){
	errMsg = "Invalid First Name";
}
else if(lastName == ""){
	errMsg = "Invalid Last Name";
}
else if(emailId == ""){
	errMsg = "Invalid Email Id";
}
else if(isNaN(mobile)){
	errMsg = "Invalid Mobile Number";
}

if(errMsg==="")
{     
	mysql.createNewUser(function(err,result,data){
		if(err){
			throw err;
		}else{
			res.send(200,data);				
			console.log("User succesfully created");
		}},firstName,lastName,emailId,mobile);
}
else
{
	res.send(errMsg);
}
});
/*laxmi*/

//app.listen(4242);