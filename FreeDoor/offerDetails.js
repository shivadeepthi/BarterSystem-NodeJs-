/*kinjal */
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
	ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");
//var cache = require('./cache');

function getOfferDetailsbyOfferId(req,res,offerId, productId){
	var lastEvent = "";
	mysql.getOfferDetails(function(err,results){
		if(!err){
			mysql.getComments(function(err,comments){
				if(!err){
					mysql.getOfferHistoryDetails(function(err,offerhistory){
						if(!err){
							if(offerhistory != null){
								if(offerhistory.modified == null)
									lastEvent = null;
								else
									lastEvent = offerhistory.modified;
							} else{
								lastEvent = null;
							}
								
							
							if(comments != null && comments.length !=0 && results != null){
								//console.log(results);
								res.send({offerId: results[0].offerId, buyingQty : results[0].buyingQty, offeredDetails : results[0].offeredDetails, 
										buyerStatus : results[0].buyerStatus, sellerStatus : results[0].sellerStatus, 
										offerExpiry : results[0].offerExpiry, productId : results[0].productId, 
										buyerId : results[0].buyerId, lastModified : results[0].lastModified, comments : comments, lastEvent : lastEvent});
							}else if(comments == null && results != null){
								res.send({offerId: results[0].offerId, buyingQty : results[0].buyingQty, offeredDetails : results[0].offeredDetails, 
									buyerStatus : results[0].buyerStatus, sellerStatus : results[0].sellerStatus, 
									offerExpiry : results[0].offerExpiry, productId : results[0].productId, 
									buyerId : results[0].buyerId, lastModified : results[0].lastModified, comments : null, lastEvent : lastEvent});
							}else if(results == null){
								res.send({Error : "No Offer Details found for the given offer Id !!"});
							}
						}
					},offerId);
				
				}
			},offerId);
			
		}
	},offerId,productId);
}

/*function updateOfferDetails1(req,res,offerId,buyingQty, offeredDetails, buyerStatus, sellerStatus, offerExpiry, productId, buyerId){
	mysql.updateOffer(function(err,results){
		if(!err){
			console.log("offer updated");
			mysql.getOfferDet(function(err,results){
				if(!err){
					mysql.getComments(function(err,comments){
						if(!err){
						if(comments != null && comments.length !=0){
							//console.log(results);
							res.send({offerId: results[0].offerId, buyingQty : results[0].buyingQty, offeredDetails : results[0].offeredDetails, 
									buyerStatus : results[0].buyerStatus, sellerStatus : results[0].sellerStatus, 
									offerExpiry : results[0].offerExpiry, productId : results[0].productId, 
									buyerId : results[0].buyerId, lastModified : results[0].lastModified, comments : comments});
						}else if(comments == null){
							res.send({offerId: results[0].offerId, buyingQty : results[0].buyingQty, offeredDetails : results[0].offeredDetails, 
								buyerStatus : results[0].buyerStatus, sellerStatus : results[0].sellerStatus, 
								offerExpiry : results[0].offerExpiry, productId : results[0].productId, 
								buyerId : results[0].buyerId, lastModified : results[0].lastModified, comments : null});
						}
						}
					},offerId);
					
				}
			},offerId,productId);
			
		}
	},offerId,buyingQty, offeredDetails, buyerStatus, sellerStatus, offerExpiry, productId, buyerId);
}*/

function updateOfferDetails(req,res,offerId,buyingQty, offeredDetails, buyerStatus, sellerStatus, offerExpiry, productId, buyerId){
	var buyQty = null;
	var historyId = null;
	var modified = null;
	mysql.getOfferDet(function(err,results){
		if(!err){
			if (results != null){
				
			
			buyQty = results[0].buyingQty;
			console.log("buyQty" + buyQty);
			mysql.updateOffer(function(err,results1){
				if(!err){
					console.log("offer updated");
					if(buyQty !== buyingQty){
						mysql.getMaxOfferHistoryId(function(err,results2){
							if(!err){
								if(results2.length === 0){
									historyId = 1;
								}else{
									historyId = results2[0].maxId + 1;
								}
								modified = "old buyQty:"+buyQty+",new buyQty:"+buyingQty;
								mysql.addOfferHistory(function(err,results3){
									if(!err){
										console.log("offer history updated");
									}
								},historyId,modified,offerId);
							}
						},offerId);
						
					}
					mysql.getOfferDet(function(err,results4){
						if(!err){
							mysql.getComments(function(err,comments){
								if(!err){
								if(comments != null && comments.length !=0 && results != null){
									//console.log(results);
									res.send({offerId: results4[0].offerId, buyingQty : results4[0].buyingQty, offeredDetails : results4[0].offeredDetails, 
											buyerStatus : results4[0].buyerStatus, sellerStatus : results4[0].sellerStatus, 
											offerExpiry : results4[0].offerExpiry, productId : results4[0].productId, 
											buyerId : results4[0].buyerId, lastModified : results4[0].lastModified, comments : comments});
								}else if(comments == null && results != null){
									res.send({offerId: results4[0].offerId, buyingQty : results4[0].buyingQty, offeredDetails : results4[0].offeredDetails, 
										buyerStatus : results4[0].buyerStatus, sellerStatus : results4[0].sellerStatus, 
										offerExpiry : results4[0].offerExpiry, productId : results4[0].productId, 
										buyerId : results4[0].buyerId, lastModified : results4[0].lastModified, comments : null});
								}
								}
							},offerId);
							
						}
					},offerId,productId);
				}
			},offerId,buyingQty, offeredDetails, buyerStatus, sellerStatus, offerExpiry, productId, buyerId);
		}else{
			res.send({Error : "Offer details not found !!"});
		}
		}
	},offerId,productId);
}

function deleteOfferId(req,res,offerId){
	mysql.deleteComment(function(err,results){
		if(!err){
			console.log("offer comments deleted");
			mysql.deleteOfferHistoryDetails(function(err,results1){
				if(!err){
					mysql.deleteOffer(function(err,result){
						if(!err){
							res.send({Success: "Deleted successfully"});
						}
					},offerId);
				}
			},offerId);
			
			
		}
	},offerId);
}
/*kinjal*/
function getOfferHistory(req,res,offerId){
	
	mysql.getOfferHistory(function(err,results){		
				if(!err){
				if(results != null){
					//console.log(results);
					res.send({offerId: offerId, offerHistoryId : results[0].offerHistoryId, modifiedQty : results[0].modified, 
							lastModifiedDate : results[0].lastModified});
				}
				else if(results == null){
					res.send({Error : "No Offer History found for the given Offer Id !!"});
				}
				}				
	},offerId);

}
exports.getOfferHistory = getOfferHistory;
exports.getOfferDetailsbyOfferId = getOfferDetailsbyOfferId;
exports.updateOfferDetails = updateOfferDetails;
exports.deleteOfferId = deleteOfferId;
