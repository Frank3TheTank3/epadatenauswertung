/*====================================================
///////////////////////////////////////////////////////
//                                                   //
//  Auswertung von Serverzugriffen von EPA - epa.js  //
//                                                   //
///////////////////////////////////////////////////////
=====================================================*/

// This script CHECKS local storage for settings, then LOADS in data from epa-http.txt
// The data is FORMATTED to fit the json structure in 'access_log_EPA_Jul95_parsed.json'
// The data is SPLIT up into 4 sets, COUNTED through and DISPLAYED in 4 separate charts from 'AnyChart' (CDN Extension)

//Settings
let textDocumentToConvert = 'epa-http.txt'
let numberOfEntriesToDisplay = 5000;
let startEntriesToDisplay = 0;
let endEntriesToDisplay = 0;
let displayFullDataSet = true;
let graph4HideSmallValues = false;
let graph4SmallValue = 1;
let appHasStarted = false;
 //Create object to hold key number and data value after counting double entries
 let counts = {};
 let precounts = {};
 let editcounts = {};

 //Variable element holding data set query paths during the counting loop
 let pushElement;
 let pushComparisioElement;

 // AnyChart json-object for chart 1,3,4
 let pieChart = {
   // chart settings
   "chart": {
     // chart type
     "type": "",
     // chart data
     "data": "",
       "series": "",
     // chart container
     "container": ""
   }
 };    

 // AnyChart json-object for chart 2
 var dataChart = {
   chart: {type: "line",
   // set series type
   series:[
     {seriesType: "spline",
   // set series data
   data: [],
   title:""
     } ],
   // set chart container
   container: "container2"},
        
 };

 //Set the dataset to count to an empty array
 let dataSetToCount = new Array();

 let containerName;

///////////////////////////////////////////////////////
//            Check Local storage settings           //
///////////////////////////////////////////////////////

function checkLocalStorage(){

  //Slightly messy :P sorry for that - TO DO optimization
///////////////////////////////////////////////////////
//             Enteries and full data set            //
///////////////////////////////////////////////////////
  if(localStorage.getItem('appHasStarted')) { 
    appHasStarted = true;
  }

  //Showing full set
  if(localStorage.getItem('showfullset')) { 
    numberOfEntriesToDisplay = 47748
    displayFullDataSet = localStorage.getItem('showfullset');
    localStorage.removeItem('numberofentries');
    localStorage.removeItem('showfullset');
    getByID('entriesInput').value = "";
  }

  //Show with an start entry
  if(localStorage.getItem('startEntries')) { 
    startEntriesToDisplay = localStorage.getItem('startEntries');
    console.log("Scope starting at entry: " + startEntriesToDisplay)
  }

  //Show with an end entry
  if(localStorage.getItem('endEntries')) { 
    endEntriesToDisplay= localStorage.getItem('endEntries');
    console.log("Scope ending at entry: " + endEntriesToDisplay)
  }

  //Show a certain number of data
  if(localStorage.getItem('numberofentries')) {
    displayFullDataSet = false;
    numberOfEntriesToDisplay = localStorage.getItem('numberofentries');
    localStorage.removeItem('showfullset');
    localStorage.removeItem('startEntries');
    localStorage.removeItem('endEntries');
  }

///////////////////////////////////////////////////////
//               Graph 4 settings check              //
///////////////////////////////////////////////////////

  //Show all data sizes in graph 4
  if(localStorage.getItem('showallgraph4')) {
    graph4SmallValue = 1;
    answerSizeInput = localStorage.getItem('showallgraph4');
    localStorage.removeItem('showallgraph4');
    localStorage.removeItem('graph4smallvalue');
    localStorage.removeItem('graph4hidesmalls');
    let button = getByID('answerSizeShowAll');
    button.disabled = true;
    getByID('answerSizeShowAll').style.backgroundColor = 'green'
    getByID('answerSizeShowAll').innerHTML = "Answers with code 200 < 1000B";
    getByID('answerSizeInput').value = "";
  }

    //Set a smallest value for small sizes to hide in graph 4
    if(localStorage.getItem('graph4smallvalue')) {
    
    graph4SmallValue = localStorage.getItem('graph4smallvalue');
    if(graph4SmallValue >= 501)
    {
      localStorage.removeItem('graph4hidesmalls');
      getByID('answerSizeHideSmall').innerHTML = "Hide small sizes < 500";
      getByID('answerSizeHideSmall').style.backgroundColor = 'white'
    }
    else {
      getByID('answerSizeHideSmall').innerHTML = "Hiding small sizes < 500";
      getByID('answerSizeHideSmall').style.backgroundColor = 'green'
      let button = getByID('answerSizeHideSmall');
      button.disabled = true;
      
    }

    getByID('answerSizeShowAll').style.backgroundColor = 'white'
    getByID('answerSizeShowAll').innerHTML = "Show Answers with code 200 < 1000B";
    let answeSizeButton = getByID('answerSizeShowAll');
    answeSizeButton.disabled = false;
    localStorage.removeItem('graph4smallvalue');
    }

  //Hide small sizes < 100 in graph 4
  if(localStorage.getItem('graph4hidesmalls')) {
    graph4SmallValue = 500;
    getByID('answerSizeInput').value = 500;

    //Show all button mutations
    getByID('answerSizeShowAll').style.backgroundColor = 'white'
    getByID('answerSizeShowAll').innerHTML = "Show Answers with code 200 < 1000B";
    let answeSizeButton = getByID('answerSizeShowAll');
    answeSizeButton.disabled = false;

    if(graph4SmallValue >= 501) {
      getByID('answerSizeHideSmall').innerHTML = "Hide the small sizes < 500";
      getByID('answerSizeHideSmall').style.backgroundColor = 'white'
    }
    else{
      getByID('answerSizeHideSmall').innerHTML = "Hiding small sizes < 500";
      getByID('answerSizeHideSmall').style.backgroundColor = 'green'
    }

    //localStorage.removeItem('graph4hidesmalls');
    let button = document.getElementById('answerSizeHideSmall');
    button.disabled = true;
   
    localStorage.removeItem('graph4hidesmalls');
  }

  

}

function getByID(elementName){
  let refElement = document.getElementById(elementName);
  return refElement;
}

checkLocalStorage();

///////////////////////////////////////////////////////
//     Saving new Json file to output.json           //
///////////////////////////////////////////////////////

// file system module to perform file operations


function sendData(dataToSave) {
  $.ajax({
      url: '/save',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({dataToSave}),
      dataType: 'json'
  });
  
}
function downloadObjectAsJson(dataToSave){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToSave));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "epadatenauswertung_new" + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

///////////////////////////////////////////////////////
//       Jquery on document ready function           //
///////////////////////////////////////////////////////

jQuery(document).ready(function() {
  let epaDataRecords;
  fetch('./access_log_EPA_Jul95_parsed.json')
    .then((res) => res.json())
    .then((data) => 
    {
      epaDataRecords  = data;
      
      if(displayFullDataSet)
      {numberOfEntriesToDisplay = 47748};
      move();
    

      ///////////////////////////////////////////////////////
      //       Convert & restructure epa-http.txt          //
      ///////////////////////////////////////////////////////

      //Get epa-http.txt with jQuery
      $.get('/' + textDocumentToConvert,{},function(content){
        //console.log(content)
        //Remove double quotes from text content
        let contentNodoubles = content.replace(/["]+/g, '')

        //Get lines by split at new line
        let lines = content.split('\n');

        //Log number of lines & unformated headers in epa-http.txt
        console.log(`${textDocumentToConvert} contains ${lines.length} lines`);
        console.log(`First line : ${lines[0]}`);

        //Get json key headers by split at first line
        let header = lines[0].split(" ");

        //Create an empty object to add url and method to the "protocol / request" object for correct json naming convention
        let createdProtokolObject = new Object();

        //Get the result of regex match 47749 (all), split by line breaks and map by remaining spaces, then reduce and check structure with switch
        let result = contentNodoubles.match(/^(.+?\n){47749}/gi)[0].split(/\r?\n/).map(x => x.split(" ").reduce((a, o, i) => {
          switch (header[i]) {
            case 'protocol': 
              let splitProtocol = Object.assign({},o.split("/"));
              let ProtocolObject_R1= renameKey (  splitProtocol, 0, "protocol");
              let ProtocolObject_R2 = renameKey ( ProtocolObject_R1, 1, "protocol_version");
              a[ header[i]  ] = ProtocolObject_R2
              createdProtokolObject = a[ header[i]  ];
              break;
            case 'timestamp':  let splitTimeStamp = Object.assign({}, o.replace(/[\[\]']+/g, '').split(":") );
              let TimeStampObject_day = renameKey (  splitTimeStamp, 0, "day");
              let TimeStampObject_hour = renameKey (  TimeStampObject_day, 1, "hour");
              let TimeStampObject_minute = renameKey (  TimeStampObject_hour, 2, "minute");
              let TimeStampObject_second = renameKey (  TimeStampObject_minute, 3, "second");
              a[ header[i]  ] = TimeStampObject_second
              break;
            case 'url':   
              createdProtokolObject[header[i]] = o
              delete(a[header[i]])
              break;
            case 'method': 
              createdProtokolObject[header[i]] = o
              delete(a[header[i]])
              break;
            default: 
              a[ header[i]  ] = o;
              break;
          }
          return a;
        }, {}));

        //Splice out the header from the result
        result.splice(0,1);
        if(endEntriesToDisplay)
        {numberOfEntriesToDisplay = endEntriesToDisplay
          console.log("Number of entries" + startEntriesToDisplay)
        }
        //Restructure the JSON data for all 47748 entries
        for (let index = parseInt(startEntriesToDisplay); index < numberOfEntriesToDisplay; index++) {

          //Set data order by 'preferred Order' function
          let data = preferredOrder(result[index], [
            "host",
            "response_code",
            "document_size",
            "timestamp",
            "method",
            "url",
            "protocol",
            "response_code"
          ]);
          //Rename protocol to request key of data
          let renamedData = renameKey (  data, "protocol", "request");
          //Rename timestamp to datetime of data
          let renamedData_R1 = renameKey (  renamedData, "timestamp", "datetime");
          //Push restructured text data to epaDataRecords
          epaDataRecords.push(renamedData_R1)
        }

        //Send all new data tp server to be saved locally
        if(appHasStarted === false)
        {
        sendData(epaDataRecords)
        console.log("Compiled .json with" + epaDataRecords.length + " entries has been created in the server root folder")
        }

        //Create downloadbutton
        var downloadBtn = document.getElementById("downloadFile");
        downloadBtn.addEventListener("click", function() {
          downloadObjectAsJson(epaDataRecords)
          console.log("Downloading the new .json epa data records with " + epaDataRecords.length + " data entries")
        }, false);

        //Log epaDataRecords to display data set
        console.log("Length of data set: " + epaDataRecords.length);

        //Count the same entries in the epaDataRecords dataset
        countDataSet(epaDataRecords)
        move();
        
      });

    });
});

///////////////////////////////////////////////////////
//         Count & display epa data records          //
///////////////////////////////////////////////////////

function countDataSet(epaDataRecords)
{
  //Loop through the data and log the container
  for (let index = 1; index < 5; index++) {
    //Get container name in DOM by concatiation of 'container' & dataset itteration size (index)
    
    containerName = "container" + index
    //Display Loading messages of containers
    switch (containerName) {
      case 'container1':  console.log('Loading HTTP methods...');
        break;
      case 'container2':  console.log('Loading Request per minuite...'); 
        break;
      case 'container3':  console.log('Loading Answer-codes...');
        break;
      case 'container4':  console.log('Loading Answer-size...');
        break;
      default: return;
        break;
    }
    //console.log(epaDataRecords)
    //Loop through epDataRecords and add chosen data base to 'pushElement'
    epaDataRecords.forEach(element => {
    switch (index) {
      case 1: 
        pushElement = element.request.method;
        break;
      case 2: 
        pushElement = (element.datetime.day) + ".9.95 " + (element.datetime.hour) + ":" + (element.datetime.minute); 
        break;
      case 3: pushElement = element.response_code;
        break;
      case 4: 
        pushComparisioElement = element.response_code;
        if(pushComparisioElement === '200')
        {
          if(parseInt(element.document_size) >= graph4SmallValue && parseInt(element.document_size) < 1000)
          {
            pushElement = element.document_size + " Bytes / Code: " + element.response_code;
            
          }
          else
          {break;}
        }
        break;
      default: return;
        break;
    }
    //Add the dataset to count
   
    dataSetToCount.push(pushElement);
    });

    //Display relevent data on counting loop
    console.log(counts);
    //Set Dataset Doubles
    countDataSetDoubles(index);

    //Create Charts for container
    createDataCharts(index);
  }
  appHasStarted = true;
  localStorage.setItem("appHasStarted", true);
  console.log("The Epa Data Analysis App has loaded")
}
///////////////////////////////////////////////////////
//        Count the double in the datasets           //
///////////////////////////////////////////////////////

//Function to count all double enteries
function countDataSetDoubles(index) {
  dataSetToCount.forEach(element => {

    //Set chart nr. 2 data structure with 'X' and 'Value' array index
    if(index === 2)
    {
      counts[element] = (counts[element] || 0) + 1;
      precounts['x'] =  element
      precounts['value'] = (counts[element] || 0) + 1;
    }
    else if (index === 4)
    {
      counts[element] = (counts[element] || 0) + 1;

    }

    //Set chart 1 and 3 data by checking SetDoubles
    else{ 
      counts[element] = (counts[element] || 0) + 1;
    }
 
  });
}

///////////////////////////////////////////////////////
//        Display AnyChart with json data            //
///////////////////////////////////////////////////////

function createDataCharts(index)
{
      //Set json AnyChart container id reference
      pieChart.chart.container = containerName;

      //Create chart data by turning the 'counts' object to string enteries for AnyChart to process correctly
      var chartResult =  Object.entries(counts);
      
      //Set json AnyChart chart-type for chart 2 (json2) & chart 1,3,4 (json) and rename chart 2 series
      let  chart;
      if(index === 2)
      {
        
        dataChart.chart.series[0].data = chartResult;
        chart = anychart.fromJson(dataChart);
        var i=0;
        //Rename chart 2 dataseries name to "Requests per Minute"
        while (chart.getSeriesAt(i)){
          chart.getSeriesAt(i).name("Requests per Minute");
          i++;
        }
      }
      else{
        pieChart.chart.data = chartResult;
        pieChart.chart.type = "pie"
        chart = anychart.fromJson(pieChart);
      }

      //Create AnyChart chart with json data and set chart boarder and background
      chart.legend(true);
      chart.background().stroke({
        keys: [".1 red", ".5 yellow", ".9 blue"],
        angle: 45,
        thickness: 5
      });
      var background = chart.background();
      background.stroke("3 red");
      background.cornerType("round");
      background.corners(10);
      chart.background().fill({
        src: "https://www.blackdeerfestival.com/wp-content/uploads/2018/02/blackdeer-semi-transparent-block-1000x618.png",
       
      });
      chart.draw();

      //Reset loop array placeholder and counts object 'data placeholder'
      dataSetToCount = [];
      counts = {};
      move();
}

///////////////////////////////////////////////////////
//   Helper functions for sorting & renanimg objects //
///////////////////////////////////////////////////////

const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
};

const clone = (obj) => Object.assign({}, obj);

function preferredOrder(obj, order) {
  var newObject = {};
  for(var i = 0; i < order.length; i++) {
      if(obj.hasOwnProperty(order[i])) {
          newObject[order[i]] = obj[order[i]];
      }
  }
  return newObject;
}

///////////////////////////////////////////////////////
//                   Progress Bar                    //
///////////////////////////////////////////////////////

var i = 0;

function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 1);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
        hideProgress();
      } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width  + "%";
      }
    }
  }
}

function hideProgress() {
    var elem = document.getElementById("myBar");
    elem.style.display = 'none';
}

