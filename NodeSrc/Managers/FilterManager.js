/**
 * Copyright - A Produle Systems Private Limited. All Rights Reserved.
 *
 * @desc Handles all the Filter related operations
 *
 */

var express = require("express");
var app = require("../server").app;

class FilterManager {

  constructor()
    {

        this.router = express.Router();


        this.router.post("/listpredefined",(req, res) => { this.getAllPredefinedFilters(req,res); });
        this.router.post("/listuserdefined",(req, res) => { this.getAllUserdefinedFilters(req,res); });
        this.router.post("/updateFilter",(req, res) => { this.updateFilter(req,res); });
    }

  	/*
  	 * @desc Returns all the predefined filters
  	 */
  	getAllPredefinedFilters(req,res)
  	{
        var predefinedFiltersList = [
            {_id: 1, name: "All Users", filter: null},
            {_id: 2, name: "New Users", filter: null},
            {_id: 3, name: "Slipping Away", filter: null},
        ];
        return res.send({status:predefinedFiltersList});

  	}

  	/*
  	 * @desc Returns all the user defined filters for the app
  	 */
  	getAllUserdefinedFilters(req,res)
  	{
        var appid = req.body.appid;

        var filterCollection = global.db.collection('filters').aggregate([
            { $match :
                { appid : appid }
            },
            { $sort :
                { "createDate" : 1 }
            }
        ]).toArray(function(err,filters)
            {
                if(err)
                {
                    res.status(500);
                    return res.send({status:'failure'});
                }

                return res.send({status:filters});
            }
        );

  	}

  	/*
  	 * @desc Updates / Creates a filter
  	 */
  	updateFilter(req,res)
  	{

        var filter = req.body.filter;

        filter.createDate = new Date();

        var filterCollection = global.db.collection('filters');

        filterCollection.update(
            { _id: filter._id },
            filter,
            { upsert: true }
        );


        return res.send({status:"saved"});

  	}
}


module.exports.FilterManager = FilterManager;
