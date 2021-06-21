import express, {Request, Response} from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import "aws-sdk";
import "csv2geojson";

const app = module.exports = express();

// Load the AWS SDK for Node.js.
var AWS = require("aws-sdk");
// Set the AWS Region.
AWS.config.update({ region: "us-west-2" });
// Create DynamoDB service object.
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

var csv2geojson = require('csv2geojson');



const corsOptions = {
  origin: [
    "https://orcid.org/"
  ],
  credentials: true
};

// everything should be under, *host*/api/v1/


// to support JSON-encoded bodies
app.use(express.json());

// Support cookie manipulation.
app.use(cookieParser());

// run cors
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)) // include before other routes - handles pre-flight


app.post("/fetchddb", (req: Request, res: Response, next: any) => {

  const date_segment = req.body.dateseg;
  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "contains(ID, :date)",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {":date" : {S: date_segment }, },
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: "ID, jdata",
    TableName: "CDRMonitor",
  };

  var csv = 'ID,Date,Value,Lat,Lon,Num,St,Unit\n';

  ddb.scan(params, function (err: any, data: any) {
    if (err) {
      console.log("Error", err);
    } else {
      //console.log("Success", data);



      data.Items.forEach(function (element: any, index: any, array: any) {

        //console.log(
        //    "printing",
        //    element.ID.S + " (" + element.jdata.M.date.S + ")"
        //);

        var jobj = {} as any;
        jobj["ID"] = element.ID.S;
        jobj["date"] = element.jdata.M.date.S;
        jobj["value"] = element.jdata.M.value.N;
        jobj["lat"] = element.jdata.M.lat.N;
        jobj["lon"] = element.jdata.M.lon.N;
        jobj["num"] = element.jdata.M.num.N;
        jobj["st"] = element.jdata.M.st.S;
        jobj["unit"] = element.jdata.M.unit.S;

        csv += jobj["ID"] + "," + jobj["date"] + "," + jobj["value"] + "," + jobj["lat"] + "," + jobj["lon"] + "," + jobj["num"] + "," + jobj["st"] + "," + jobj["unit"];
        csv += "\n";

      });

    }

    var geoJson = csv2geojson.csv2geojson(csv, {
      latfield: 'Lat',
      lonfield: 'Lon',
      delimiter: ','
    }, function(err: any, data: any) {
      //console.log(JSON.stringify(data));
      //return data;
      return res.send({"data": data, "csv": csv});
    });

  });

});


app.post("/fetchddbold", (req: Request, res: Response, next: any) => {

  const date_segment = req.body.dateseg;
  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "contains(ID, :date)",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {":date" : {S: date_segment }, },
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: "ID, jdata",
    TableName: "CDRMonitor",
  };

  var jdata = {} as any;

  ddb.scan(params, function (err: any, data: any) {
    if (err) {
      console.log("Error", err);
    } else {
      //console.log("Success", data);

      data.Items.forEach(function (element: any, index: any, array: any) {

        //console.log(
        //    "printing",
        //    element.ID.S + " (" + element.jdata.M.date.S + ")"
        //);

        var jobj = {} as any;
        jobj["ID"] = element.ID.S;
        jobj["date"] = element.jdata.M.date.S;
        jobj["value"] = element.jdata.M.value.N;
        jobj["lat"] = element.jdata.M.lat.N;
        jobj["lon"] = element.jdata.M.lon.N;
        jobj["num"] = element.jdata.M.num.N;
        jobj["st"] = element.jdata.M.st.S;
        jobj["unit"] = element.jdata.M.unit.S;

        jdata[element.ID.S] = {"ID": element.ID.S, "jdata": jobj};


      });

    }

    //console.log("response here = ", jdata);
    return res.send({"data": jdata});

  });


});




export default app;
