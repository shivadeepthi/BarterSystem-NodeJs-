var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    http = require("http"),
	ejs = require("ejs");    
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");
var cache = require('./cache');
var offer = require("./offerDetails");  //kinjal
var title = 'EJS template with Node.JS';
var data = 'Data from node';
var categories_freeDoor;
var categories_freeDoor_count;
var http = require('http');

var seaport = require('seaport');
var ports = seaport.connect('localhost', 4242);

app.configure(function () {
	app.use(express.logger());
	//app.use(express.errorHandler());
	app.use(express.bodyParser());
	//app.use(express.json());
	app.use(express.methodOverride());
	
	app.use(express.static(path.join(application_root, "")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.cookieParser());
	app.use(express.session({secret: "LP1988"}));
	app.use(app.router);
});

function getHome(req, res, session, category_id)
{
	mysql.getCategory(function(err,results){
		if(err){
			throw err;
		}else{
			categories_freeDoor = results;
			categories_freeDoor_count = results.length;
		
			mysql.getProducts(function(err,results){
					if(err){
						throw err;
					}else{
						//cache.put(category_id, results);
						ejs.renderFile('home.ejs',
								{session : session, products : results, categories_freeDoor:categories_freeDoor,categories_freeDoor_count:categories_freeDoor_count},
								function(err, result) {
							// render on success
							if (!err) {
								res.end(result);
							}
							// render or error
							else {
								res.end('An error occurred');
								console.log(err);
							}
						});
					}
				},category_id);
		}
	});
}
function getProduct(req,res,session,product_Id){
	mysql.getCategory(function(err,results){
		if(err){
			throw err;
		}else{
			categories_freeDoor = results;
			categories_freeDoor_count = results.length;
		
			mysql.getProductDetails(function(err,results){
					if(err){
						throw err;
					}else{
						//cache.put(category_id, results);
						ejs.renderFile('productDetails.ejs',
								{session:session,products : results, categories_freeDoor:categories_freeDoor,categories_freeDoor_count:categories_freeDoor_count},
								function(err, result) {
							// render on success
							if (!err) {
								res.end(result);
							}
							// render or error
							else {
								res.end('An error occurred');
								console.log(err);
							}
						});
					}
				},product_Id);
		}
	});
}

app.get('/category', function (req, res) {
	if(req.session.name === undefined)
	{
		req.session.name = "";
	}
	if(req.session.userid === undefined)
	{
		req.session.userid = -1;
	}
	if(req.session.last_time === undefined)
	{
		req.session.last_time = new Date();
	}
	getHome(req, res, req.session, req.param('categoryId'));
	
});
app.get('/product', function (req, res) {
	if(req.session.name == undefined)
	{
		req.session.name = "";
	}
	if(req.session.userid == undefined)
	{
		req.session.userid = -1;
	}
	if(req.session.last_time == undefined)
	{
		req.session.last_time = new Date();
	}
	getProduct(req,res,req.session,req.param('productId'))
});

app.get('/', function (req, res) {
	if(req.session.name == undefined)
	{
		req.session.name = "";
	}
	if(req.session.userid == undefined)
	{
		req.session.userid = -1;
	}
	if(req.session.last_time == undefined)
	{
		req.session.last_time = new Date();
	}
	getHome(req, res, req.session, 1);
});
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
function formatDate(d) {
 var dd = d.getDate();
 if ( dd < 10 )
	 dd = '0' + dd;
var mm = d.getMonth()+1;
 if ( mm < 10 )
	 mm = '0' + mm;
var yyyy = d.getFullYear();
var hh = d.getHours();
if ( hh < 10 )
	 hh = '0' + hh;
var MM = d.getMinutes();
if ( MM < 10 )
	MM = '0' + MM;
var ss = d.getSeconds();
if ( ss < 10 )
	ss = '0' + ss;
	  return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + MM + ":" +ss;

	}

//app.listen(4242);
app.listen(ports.register('freedoor-server'));