/**
 * New node file
 */

var mysql = require('mysql');
/*var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'kinjal',
  port: '3306',
  database: 'Project2'
});*/
var pool = mysql.createPool({

	host     : 'us-cdbr-iron-east-01.cleardb.net',

	user     : 'b011d72efb1a3c',

	password : '147cb3e2',

	port: '3306',

	database: 'ad_79d0bebd6e7b512'

});
/**deepthi**/
function getCategory(callback){

	var sql = "SELECT * FROM Category";
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err, rows){
			if(err)	{
				throw err;
			}else{
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
				}
				else{
					callback(err, null);
				}
			}
		});		  
		connection.release();
	});
}
function getProducts(callback, category){
	console.log("Category: " + category);
	var sql = "SELECT p.productName,p.quantity,p.userId,p.expectedOffer,p.productDesc,p.productExpiryDate,p.isValid,p.categoryId FROM Product p,Category c where c.categoryId = p.categoryId and c.categoryId = " + category;
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err, rows){
			if(err)	{
				throw err;
			}else{
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
				}
				else{
					callback(err, null);
				}
			}
		});		  
		connection.release();
	});
}

function getProductDetails(callback, product_id){
	console.log("product_id: " + product_id);
	var sql = "SELECT *  FROM Product p where p.productId =" + product_id;
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err, rows){
			if(err)	{
				throw err;
			}else{
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
				}
				else{
					callback(err, null);
				}
			}
		});		  
		connection.release();
	});
}

function getCategoryDetails(callback, Category_Id){
	console.log("category_id: " + Category_Id);
	var sql = "SELECT *  FROM Category where categoryId =" + Category_Id;
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err, rows){
			if(err)	{
				throw err;
			}else{
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
				}
				else{
					callback(err, null);
				}
			}
		});		  
		connection.release();
	});
}
/**deepthi**/

/****shiva ***/


function createNewProduct(callback,productName,quantity,userId,expectedOffer,prodDesc,prodExpiryDate,isValid,categoryId){
	console.log("inside new product");
	var sqlproductId="select max(productId) as maxno from product";
	pool.getConnection(function(err,connection){
		connection.query(sqlproductId,function(err,row){
			var productId=row[0].maxno;
			console.log("prod"+productId);
			if(row[0].maxno===null){
				console.log("i am here in if");
				productId=1;
				var sql="Insert into product values("+productId+","+"\""+productName+"\","+quantity+","+userId+","+"\""+expectedOffer+"\","+"\""+prodDesc+"\","+"\'"+prodExpiryDate+"\',"+isValid+","+categoryId+")";
				var links=[];
				links.push("GET: /category/"+categoryId+"/product/"+productId);
				links.push("PUT: /category/"+categoryId+"/product/"+productId);
				links.push("DELETE: /category/"+categoryId+"/product/"+productId);
				links.push("GET: /category/"+categoryId+"/product/");
				var data={"productId":productId,"produtName":produtName,"quantity":quantity,"userId":userId,"expectedOffer":expectedOffer,"prodDesc":prodDesc,"prodExpiryDate":prodExpiryDate,"isValid":isValid,"categoryId":categoryId,"links":links};
				connection.query(sql,function(err,result){
					if(err){
						throw err;
					}else{
						if(result){
							console.log("category created succesfully");
							callback(err,result,JSON.stringify(data));
						}
					}
				});

			}else{
				console.log("i am here result.maxno"+row[0].maxno);
				var ProductId=(row[0].maxno)+1;
				console.log("ProductId"+ProductId);
				var sql="Insert into product values("+ProductId+","+"\""+productName+"\","+quantity+","+userId+","+"\""+expectedOffer+"\","+"\""+prodDesc+"\","+"\'"+prodExpiryDate+"\',"+isValid+","+categoryId+")";
				var links=[];
				links.push("GET: /category/"+categoryId+"/product/"+ProductId);
				links.push("PUT: /category/"+categoryId+"/product/"+ProductId);
				links.push("DELETE: /category/"+categoryId+"/product/"+ProductId);
				links.push("GET: /category/"+categoryId+"/product/");
				var data={"productId":ProductId,"productName":productName,"quantity":quantity,"userId":userId,"expectedOffer":expectedOffer,"prodDesc":prodDesc,"prodExpiryDate":prodExpiryDate,"isValid":isValid,"categoryId":categoryId,"links":links};
				connection.query(sql,function(err,result){
					if(err){
						throw err;
					}else{
						if(result){
							console.log("category created succesfully");
							console.log("data"+JSON.stringify(data));
							callback(err,result,JSON.stringify(data));
						}
					}
				});
			}

		});

		connection.release();
	});
}

function updateProduct(callback,productId,productName,quantity,userId,expectedOffer,prodDesc,prodExpiryDate,isValid,categoryId){
	console.log("inside update product");
	var sql="update product set productName ="+"\""+productName+"\"  ,"+"quantity ="+quantity+", "+"userId ="+userId+","+"expectedOffer ="+"\""+expectedOffer+"\"  ,"+"productDesc ="+"\""+prodDesc+"\"  ,"+"productExpiryDate ="+"\'"+prodExpiryDate+"\' ,"+"isValid ="+isValid+","+"categoryId ="+categoryId+" "+"where productId="+productId;
	var links=[];
	links.push("GET: /category/"+categoryId+"/product/"+productId);
	links.push("POST:/category"+categoryId+"/product");
	links.push("DELETE: /category/"+categoryId+"/product/"+productId);
	links.push("GET: /category/"+categoryId+"/product/");
	var data={"productId":productId,"productName":productName,"quantity":quantity,"userId":userId,"expectedOffer":expectedOffer,"productDesc":prodDesc,"prodExpiryDate":prodExpiryDate,"isValid":isValid,"categoryId":categoryId,"links":links};
	console.log(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,function(err,result){
			if(err){
				throw err;
			}else{
				if(result){
					console.log("product updated succesfully");
					callback(err,result,JSON.stringify(data));
				}
			}
		});
		connection.release();
	});
}

/***
 * 
 * @param callback
 * @param categoryName
 */
function createNewCategory(callback,categoryName){
	console.log("inside new category");
	var sqlcategoryId="select max(categoryId) as maxno from category";
	pool.getConnection(function(err,connection){
		connection.query(sqlcategoryId,function(err,row){
			var categoryId=row[0].maxno;
			console.log("cat"+categoryId);
			if(row[0].maxno===null){
				console.log("i am here in if");
				categoryId=1;
				var links=[];
				links.push("GET: /category/");
				var data={"categoryId":categoryId,"categoryName":categoryName,"links":links};
				connection.query(sql,function(err,result){
					if(err){
						throw err;
					}else{
						if(result){
							console.log("category created succesfully");
							callback(err,result,JSON.stringify(data));
						}
					}
				});

			}else{
				console.log("i am here result.maxno"+row[0].maxno);
				var categoryId=categoryId+1;
				console.log("categoryId"+categoryId);
				var sql="Insert into category values("+categoryId+","+"\""+categoryName+"\""+")";
				var links=[];
				links.push("GET: /category/");
				links.push("GET: /category/"+categoryId);
				var data={"categoryId":categoryId,"categoryName":categoryName,"links":links};
				connection.query(sql,function(err,result){
					if(err){
						throw err;
					}else{
						if(result){
							console.log("category created succesfully");
							console.log("data"+JSON.stringify(data));
							callback(err,result,JSON.stringify(data));
						}
					}
				});
			}

		});

		connection.release();
	});
}	

function deleteProduct(callback,categoryId,productId){
	console.log("inside delete product");
	var sql="delete from product where productId ="+productId +" "+"and"+" "+"categoryId ="+categoryId;
	var links=[];
	links.push("POST:/category"+categoryId+"/product");
	links.push("GET: /category/"+categoryId+"/product/");
	var data={"links":links};
	console.log(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,function(err,result){
			if(err){
				throw err;
			}else{
				if(result){
					console.log("product deleted succesfully");
					callback(err,result);
				}
			}
		});
		connection.release();
	});
}
/***shiva
 * 
 */
/*Minu*/
function getOffers(callback, categoryId, productId){
	console.log("categoryId: " + categoryId);
	console.log("product_id: " + productId);
	var sql = "SELECT *  FROM Offer where productId =" + productId;
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err, rows){
			if(err)	{
				throw err;
			}else{
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
				}
			}
		});		  
		connection.release();
	});
}

function getPreviousOfferId(callback)
{
	var sql_offerId = "SELECT MAX(offerId) as prev_id from Offer";
	pool.getConnection(function(err, connection){
		connection.query( sql_offerId,  function(err, rows){
			if(err)	{
				throw err;
			}
			else {
				if(rows[0].prev_id===null){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, 1);
				}
				else {
					console.log("DATA : "+JSON.stringify(rows));
					var val = rows[0].prev_id+1;
					callback(err, val);
				}
			}
		});
		connection.release();
	});
}

function postOfferDetails(callback, categoryId, offerId, productId, quantity, offerDet, buyerStatus, sellerStatus, offerExpiry, productId1, buyerId)
{
	console.log("categoryId: " + categoryId);
	console.log("product_id: " + productId);
	console.log("offerId: " + offerId);
	var lastModified = formatDate(new Date());
	//check if already exists in the DB with the same SellerID and ProductID
	var sql = "SELECT productId, buyerId FROM Offer where productId ="+productId +" and buyerId ="+buyerId;
	pool.getConnection(function(err, connection1){
		connection1.query( sql,  function(err1, rows1){
			if(err1) {
				throw err1;
			}
			else {
				if(rows1.length!=0)
				{
					// do no insert the existing row to the DB since its already existing for Offer
					var resp = "The record is already inserted!";
					callback(err1, resp);
				}
				else
				{
					var postSql = "INSERT INTO Offer (offerId, buyingQty, offeredDetails, buyerStatus, sellerStatus, offerExpiry, productId, buyerId, lastModified) " +
					"VALUES("+offerId + ", " + quantity + ", '" + offerDet + "', '" + buyerStatus + "', '" + sellerStatus + "', '" + offerExpiry + "', " + productId + ", " + buyerId + ", '" + lastModified + "')";
					console.log(postSql);
					var data = {"offerId":offerId,"quantity":quantity,"offerDet":offerDet,"buyerStatus":buyerStatus,"sellerStatus":sellerStatus,"offerExpiry":offerExpiry,"productId":productId,"buyerId":buyerId,"lastModified":lastModified};
					pool.getConnection(function(err, connection){
						connection.query( postSql,  function(err, rows){
							if(err)	{
								throw err;
							}
							else {
								if(rows.length!==0) {
									console.log("DATA : "+JSON.stringify(rows));
									callback(err, rows,JSON.stringify(data));
								}
							}
						});
						connection.release();
					});
				}
			}
		});
		connection1.release();
	});
}

function postComments(callback, categoryId, productId, offerId, commentDesc, userId) {
	console.log("offer id: " + offerId);
	console.log("productId id: " + productId);
	console.log("commentDesc: " + commentDesc);
	console.log("userId id: " + userId);
	var userSqlOffer = "SELECT buyerId from Offer where buyerId ="+userId;
	var userSqlProduct = "SELECT userId from Product where userId ="+userId;
	pool.getConnection(function(err, connection){
		connection.query(userSqlOffer, function(err1, rows) {
			if(err1)
			{
				throw err1;
			}
			else
			{
				console.log(rows);
				console.log(rows.length);
				if(rows.length===0)
				{
					connection.query(userSqlProduct, function(err, rows) {
						if(err)
							throw err;
						else
						{
							console.log(rows);
							console.log(rows.length);
							if(rows.length===0)
							{
								console.log("Not a valid userId");
								callback(err, "ERROR: ", "Not a valid userId")
							}
							// comment from seller
							else
							{
								var maxCommentId = "SELECT MAX(commentId) as comm_id from Comment";
								pool.getConnection(function(err, connection){
									connection.query(maxCommentId, function(err1, rows) {
										var commentId=rows[0].comm_id;
										var lastUpdated = formatDate(new Date());
										if(rows[0].comm_id===null){
											commentId=1;
											console.log("The first Comment" + commentId);
										}
										else{
											console.log("i am here result.maxno"+rows[0].maxno);
											var commentId=commentId+1;
											console.log("categoryId : "+commentId);
										}

										var sql="Insert into Comment (commentId, commentDesc, lastUpdated, offerId, userId) values("+commentId+","+"\""+commentDesc+"\""+","+"\""+lastUpdated+"\""+","+offerId+","+userId+")";
										console.log(sql);
										var data={"commentId":commentId,"commentDesc":commentDesc,"offerId":offerId,"userId":userId};
										connection.query(sql,function(err,result){
											if(err){
												throw err;
											}else{
												if(result){
													console.log("Offer created succesfully");
													callback(err,result,JSON.stringify(data));
												}
											}
										});
									})
								});
							}
						}
					});
				}
				// comment from buyer
				else 
				{
					var maxCommentId = "SELECT MAX(commentId) as comm_id from Comment";
					pool.getConnection(function(err, connection){
						connection.query(maxCommentId, function(err1, rows) {
							var commentId=rows[0].comm_id;
							var lastUpdated = formatDate(new Date());
							if(rows[0].comm_id===null){
								commentId=1;
								console.log("The first Comment" + commentId);
							}
							else{
								console.log("i am here result.maxno"+rows[0].maxno);
								var commentId=commentId+1;
								console.log("categoryId : "+commentId);
							}

							var sql="Insert into Comment (commentId, commentDesc, lastUpdated, offerId, userId) values("+commentId+","+"\""+commentDesc+"\""+","+"\""+lastUpdated+"\""+","+offerId+","+userId+")";
							console.log(sql);
							var data={"commentId":commentId,"commentDesc":commentDesc,"offerId":offerId,"userId":userId};
							connection.query(sql,function(err,result){
								if(err){
									throw err;
								}else{
									if(result){
										console.log("Offer created succesfully");
										callback(err,result,JSON.stringify(data));
									}
								}
							});
						})
					});
				}
			}

		});
	});
}
/*minu*/
/*kinjal*/
function getOfferDetails(callback, offerId, productId){
	console.log("offer id: " + offerId);
	var sql = "SELECT *  FROM offer o where o.offerId =" + offerId + " and o.productId = " + productId + " and o.sellerStatus not in ('Accepted')" ;
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err1, rows){
			if(err1)	{
				throw err1;
			}else{
				if(rows.length!==0){
					console.log("OFFER DATA : "+JSON.stringify(rows));
					callback(err1, rows);
				}else{
					callback(err1, null);
				}
			}
		});		  
		connection.release();
	});
}

function getComments(callback, offerId){
	var sql = "SELECT * FROM comment where offerId =" + offerId;
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err1,rows){
			if(err1)
				throw err1;
			else{
				if(rows.length!=0){
					callback(err1,rows);
				}else{
					callback(err1, null);
				}
			}
		});
		connection.release();
	});
}

function updateOffer(callback, offerId,buyingQty, offeredDetails, buyerStatus, sellerStatus, offerExpiry, productId, buyerId){
	var sql = "UPDATE offer set buyingQty =" + buyingQty + ",offeredDetails = '"+offeredDetails+ "',buyerStatus='" +buyerStatus+ "',sellerStatus='" +sellerStatus+ "',offerExpiry='" +offerExpiry+ "',buyerId=" +buyerId+ ",lastModified='"+formatDate(new Date())+"' where offerId=" +offerId;
	console.log("sql:"+sql);
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err, results){
			if(err){
				console.log("ERROR : "+err.message);
			}
			else{
				callback(err,results);
			}			
		});
		connection.release();
	});
}
function getOfferDet(callback, offerId, productId){
	console.log("offer id: " + offerId);
	var sql = "SELECT *  FROM offer o where o.offerId =" + offerId + " and o.productId = " + productId ;
	console.log("sql"+ sql);
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err1, rows){
			if(err1)	{
				throw err1;
			}else{
				if(rows.length!==0){
					console.log("OFFER DATA : "+JSON.stringify(rows));
					callback(err1, rows);
				}else{
					console.log("no rows");
					callback(err1, null);
				}
			}
		});		  
		connection.release();
	});
}

function deleteOffer(callback, offerId){
	var sql = "delete from offer where offerId ="+offerId;
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err, results){
			if(err){
				console.log("ERROR : "+err.message);
			}
			else{
				callback(err,results);
			}			
		});
		connection.release();
	});
}

function deleteComment(callback, offerId){
	var sql = "delete from comment where offerId ="+offerId;
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err, results){
			if(err){
				console.log("ERROR : "+err.message);
			}
			else{
				callback(err,results);
			}			
		});
		connection.release();
	});
}

function addOfferHistory(callback,offerHistoryId,modified,offerId){
	var sql = "insert into offerhistory values("+offerHistoryId+",'"+modified+"','"+formatDate(new Date())+"',"+offerId+")";
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err, results){
			if(err){
				console.log("ERROR : "+err.message);
			}
			else{
				callback(err,results);
			}			
		});
		connection.release();
	});
}

function getMaxOfferHistoryId(callback,offerId){
	var sql = "select max(offerHistoryId) as maxId from offerhistory where offerId="+offerId;
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err, results){
			if(err){
				console.log("ERROR : "+err.message);
			}
			else{					
				callback(err, results);			  		
			}			
		});
		connection.release();
	});
}

function getOfferHistoryDetails(callback, offerId){
	var sql = "select modified from offerhistory o1 where o1.offerid = "+offerId+ " and o1.offerHistoryId in (select max(offerHistoryId) from offerhistory o where o.offerid = o1.offerid)";
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err, results){
			if(err){
				console.log("ERROR : "+err.message);
			}
			else{					
				if(results.length!==0){
					console.log("OFFER HISTORY DATA : "+JSON.stringify(results));
					callback(err, results);
				}else{
					console.log("no rows");
					callback(err, null);
				}
			}		  		

		});
		connection.release();
	});
}

function deleteOfferHistoryDetails(callback, offerId){
	var sql = "delete from offerhistory where offerId ="+offerId;
	pool.getConnection(function(err,connection){
		connection.query(sql, function(err, results){
			if(err){
				console.log("ERROR : "+err.message);
			}
			else{
				callback(err,results);
			}			
		});
		connection.release();
	});
}


/*kinjal*/
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

//Laxmi

function getOfferHistory(callback, offerId){
	console.log("offer id: " + offerId);
	var sql = "SELECT *  FROM offerhistory oh where oh.offerId =" + offerId;
	console.log("sql"+ sql);
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err1, rows){
			if(err1)	{
				throw err1;
			}else{
				if(rows.length!==0){
					console.log("OFFER HISTORY DATA : "+JSON.stringify(rows));
					callback(err1, rows);
				}else{

					callback(err1, null);
				}
			}
		});		  
		connection.release();
	});
}

function getUsers(callback){

	var sql = "SELECT * FROM user";
	pool.getConnection(function(err, connection){
		connection.query( sql,  function(err, rows){
			if(err)	{
				throw err;
			}else{
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
				}
				else{
					callback(err, null);
				}
			}
		});		  
		connection.release();
	});
}

function checkUser(callback,userId){
	console.log("inside check user");
	var sql="select userId from user where userId="+userId;
	console.log(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,function(err,result){
			if(err){
				throw err;
			}else{
				if(result){
					console.log("User exists");
					callback(err,result);
				}
			}
		});
		connection.release();
	});
}

function checkCategory(callback,categoryId){
	console.log("inside check category");
	var sql="select categoryId from category where categoryId="+categoryId;
	console.log(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,function(err,result){
			if(err){
				throw err;
			}else{
				if(result){
					console.log("category exists");
					callback(err,result);
				}
			}
		});
		connection.release();
	});
}

function checkProduct(callback,productId){
	console.log("inside check product");
	var sql="select productId from product where productId="+productId;
	console.log(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,function(err,result){
			if(err){
				throw err;
			}else{
				if(result){
					console.log("product exists");
					callback(err,result);
				}
			}
		});
		connection.release();
	});
}

function checkCategoryName(callback,categoryName){
	console.log("inside check category name");
	var sql="select count(*) count from category where categoryName="+"\""+categoryName+"\"";
	console.log(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,function(err,result){
			if(err){
				throw err;
			}else{
				if((result[0].count)>1){
					console.log("category Name already exists");
					callback(err,result);
				}else{
					console.log("category Name occurs only once");
					callback(err,result);
				}
			}
		});
		connection.release();
	});
}


function createNewUser(callback,firstName,lastName,emailId,mobile){
	var maxUserSQL="select max(userId) as maxUser from user";
	pool.getConnection(function(err,connection){
		connection.query(maxUserSQL,function(err,row){
			var lastUserId=row[0].maxUser;	
			var userId = null;
			if(row[0].maxUser===null){
				userId=1;				
			}else{					
				userId =(row[0].maxUser)+1;
			}
			console.log("User Id: "+userId);

			var sql="Insert into user values("+userId+","+"\""+firstName+"\"," + "\""+lastName+"\","+"\""+emailId+"\","+mobile+")";
			console.log(sql);
			var data={"userId":userId,"firstName":firstName,"lastName":lastName,"emailId":emailId,"mobile":mobile};
			connection.query(sql,function(err,result){
				if(err){
					throw err;
				}else{
					if(result){
						console.log("User created succesfully");
						console.log("data"+JSON.stringify(data));
						callback(err,result,JSON.stringify(data));
					}
				}
			});			
		});

		connection.release();
	});
}

exports.getCategory = getCategory;
exports.getProductDetails=getProductDetails;
exports.getProducts = getProducts;
exports.getCategoryDetails= getCategoryDetails;
exports.createNewProduct=createNewProduct;
exports.createNewCategory=createNewCategory;
exports.deleteProduct=deleteProduct;
exports.updateProduct=updateProduct;
exports.getOfferDetails = getOfferDetails;
exports.getComments = getComments;
exports.getOfferDet = getOfferDet;
exports.deleteOffer = deleteOffer;
exports.deleteComment = deleteComment;
exports.addOfferHistory = addOfferHistory;
exports.getMaxOfferHistoryId = getMaxOfferHistoryId;
exports.updateOffer = updateOffer;
exports.getOfferHistoryDetails = getOfferHistoryDetails;
exports.postOfferDetails = postOfferDetails;
exports.getPreviousOfferId = getPreviousOfferId;
exports.getOffers = getOffers;
exports.postComments = postComments;
exports.getOfferHistory = getOfferHistory;
exports.getUsers = getUsers;
exports.createNewUser = createNewUser;
exports.deleteOfferHistoryDetails = deleteOfferHistoryDetails;