/*====================================================
///////////////////////////////////////////////////////
//                                                   //
//  Auswertung von Serverzugriffen von EPA - epa.js  //
//                                                   //
///////////////////////////////////////////////////////
=====================================================*/

// This script LOADS in data from epa-http.txt
// The data is FORMATTED to fit the json structure in 'access_log_EPA_Jul95_parsed.json'
// The data is SPLIT up into 4 sets, COUNTED through and DISPLAYED in 4 separate charts from 'AnyChart' (CDN Extension)

//Settings
let textDocumentToConvert = 'epa-http.txt'
let numberOfEntriesToDisplay = 5000;
let displayFullDataSet = true;
let Graph4_Hide_NullUndefinedValues = false;
let Graph4_Hide_SmallValues = false;
let Graph4_SmallValue = 100;
let displayFullGraph4 = true;

///////////////////////////////////////////////////////
//            Check Local storage settings           //
///////////////////////////////////////////////////////

if(localStorage.getItem('showfullset'))
{ 
  localStorage.removeItem('numberofentries');
  localStorage.removeItem('showfullset');
  displayFullDataSet = localStorage.getItem('showfullset');
  document.getElementById('entriesInput').value = "";
  Graph4_Hide_SmallValues = true;
  numberOfEntriesToDisplay = 47748
}

if(localStorage.getItem('numberofentries'))
{
  numberOfEntriesToDisplay = localStorage.getItem('numberofentries');
  displayFullDataSet = false;
  localStorage.removeItem('showfullset');
}

if(localStorage.getItem('showallgraph4'))
{
  answerSizeInput = localStorage.getItem('showallgraph4');
  localStorage.removeItem('showallgraph4');
  localStorage.removeItem('graph4smallvalue');
  localStorage.removeItem('graph4hidenulls');
  localStorage.removeItem('graph4hidesmalls');
  Graph4_Hide_SmallValues = false;
  Graph4_SmallValue=1;
  document.getElementById('answerSizeInput').value = "";
  let button = document.getElementById('answerSizeShowAll');
  button.disabled = true;
  document.getElementById('answerSizeShowAll').style.backgroundColor = 'green'
  document.getElementById('answerSizeShowAll').innerHTML = "Showing all answers";
}

if(localStorage.getItem('graph4hidenulls'))
{
  Graph4_Hide_NullUndefinedValues = localStorage.getItem('graph4hidenulls');
  Graph4_Hide_NullUndefinedValues = true;
  document.getElementById('answerSizeHideEmpty').innerHTML = "Hiding empty sizes";
  document.getElementById('answerSizeHideEmpty').style.backgroundColor = 'green'
  document.getElementById('answerSizeShowAll').style.backgroundColor = 'grey'
  document.getElementById('answerSizeShowAll').innerHTML = "Show all answers";
  let button = document.getElementById('answerSizeHideEmpty');
  button.disabled = true;
  
}

if(localStorage.getItem('graph4hidesmalls'))
{  localStorage.removeItem('graph4smallvalue');
    Graph4_Hide_SmallValues = localStorage.getItem('graph4hidesmalls');
    Graph4_Hide_SmallValues = true;
    Graph4_SmallValue = 100;
    document.getElementById('answerSizeInput').value = 100;

    if(Graph4_SmallValue >= 101)
    {
      document.getElementById('answerSizeHideSmall').innerHTML = "Hide small sizes < 100";
      document.getElementById('answerSizeHideSmall').style.backgroundColor = 'grey'
    }
    else
    
    {
      document.getElementById('answerSizeHideSmall').innerHTML = "Hiding small sizes < 100";
      document.getElementById('answerSizeHideSmall').style.backgroundColor = 'green'
    }
    document.getElementById('answerSizeShowAll').style.backgroundColor = 'grey'
    
    localStorage.removeItem('graph4hidesmalls');
    let button = document.getElementById('answerSizeHideSmall');
    button.disabled = true;
    document.getElementById('answerSizeShowAll').innerHTML = "Show all answers";
}

if(localStorage.getItem('graph4smallvalue'))
{
  
  Graph4_SmallValue = localStorage.getItem('graph4smallvalue');
  Graph4_Hide_SmallValues = true;
  if(Graph4_SmallValue >= 101)
  {
    document.getElementById('answerSizeShowAll').innerHTML = "Show all answers";
    document.getElementById('answerSizeHideSmall').innerHTML = "Hide small sizes < 100";
    document.getElementById('answerSizeHideSmall').style.backgroundColor = 'grey'
    document.getElementById('answerSizeShowAll').style.backgroundColor = 'grey'
    localStorage.removeItem('graph4hidesmalls');
  }else
    
  {
    document.getElementById('answerSizeHideSmall').innerHTML = "Hiding small sizes < 100";
    document.getElementById('answerSizeHideSmall').style.backgroundColor = 'green'
    let button = document.getElementById('answerSizeHideSmall');
    button.disabled = true;
  }
  
}

///////////////////////////////////////////////////////
//       Jquery on document ready function           //
///////////////////////////////////////////////////////

jQuery(document).ready(function() {
  move();
  
  if(displayFullDataSet)
  {numberOfEntriesToDisplay = 47748}
  var epaDataRecords = JSON.parse(window.epadata);

  ///////////////////////////////////////////////////////
  //       Convert & restructure epa-http.txt          //
  ///////////////////////////////////////////////////////

  //Get epa-http.txt with jQuery
  $.get('/' + textDocumentToConvert,{},function(content){
    
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

    //Restructure the JSON data for all 47748 entries
    for (let index = 0; index < numberOfEntriesToDisplay; index++) {

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

    //Log epaDataRecords to display data set
    console.log("Length of data set: " + epaDataRecords.length);

    //Count the same entries in the epaDataRecords dataset
    countDataSet(epaDataRecords)
    move();
    
  });

  ///////////////////////////////////////////////////////
  //         Count & display epa data records         //
  ///////////////////////////////////////////////////////

  function countDataSet(epaDataRecords)
  {
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

    //Loop through the data and log the container
    for (let index = 1; index < 5; index++) {
      //Get container name in DOM by concatiation of 'container' & dataset itteration size (index)
      
      let containerName = "container" + index
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
        case 1: pushElement = element.request.method;
          break;
        case 2: 
        pushElement = (element.datetime.day) + ".9.95 " + (element.datetime.hour) + ":" + (element.datetime.minute); 
        pushComparisioElement = element.host;
          break;
        case 3: pushElement = element.response_code;
          break;
        case 4: pushElement = element.document_size;
          break;
        default: return;
          break;
      }
      //Add the dataset to count
     
      if(index === 2)
      {
        dataSetToCount.push(pushElement);
        //console.log("Pushing: " + pushComparisioElement)
      }
      else
      { dataSetToCount.push(pushElement);}
      });

    ///////////////////////////////////////////////////////
    //        Count the double in the datasets           //
    ///////////////////////////////////////////////////////

      //Function to count all double enteries
      function countDataSetDoubles() {
        dataSetToCount.forEach(element => {

          //Set chart nr. 2 data structure with 'X' and 'Value' array index
          if(index === 2)
          {
            counts[element] = (counts[element] || 0) + 1;
            precounts['x'] =  element
            precounts['value'] = (counts[element] || 0) + 1;
          }

          //Set chart nr. 4 data structure with checks for Hide_SmallValues & Hide_NullUndefinedValues
          else if(index === 4)
          {
            switch (Graph4_Hide_NullUndefinedValues) {
              case true:  
                if(element != "0" && element != "-" &&  element != undefined)
                {
                  editcounts[element] = (editcounts[element] || 0) + 1;
                  if(Graph4_Hide_SmallValues && ((editcounts[element] || 0) + 1) >= Graph4_SmallValue)
                  {
                    counts[element] = (editcounts[element] || 0) + 1;
                  }
                  if(!Graph4_Hide_SmallValues && ((editcounts[element] || 0) + 1) >= 0)
                  {
                    counts[element] = (counts[element] || 0) + 1;
                  }
                }
                break;
              case false: 
                if(element != undefined)
                {
                  editcounts[element] = (editcounts[element] || 0) + 1;
                  if(Graph4_Hide_SmallValues && ((editcounts[element] || 0) + 1) >= Graph4_SmallValue)
                  {
                    counts[element] = (editcounts[element] || 0) + 1;
                  }
                  if(!Graph4_Hide_SmallValues && ((editcounts[element] || 0) + 1) >= 0)
                  {
                    counts[element] = (counts[element] || 0) + 1;
                  }
                }
                break;
              default: return;
                break;
            } 
          }

          //Set chart 1 and 3 data by checking SetDoubles
          else{ 
            counts[element] = (counts[element] || 0) + 1;
          }
        });
      }
      console.log(counts);
      //Set Dataset Doubles
      countDataSetDoubles();

    ///////////////////////////////////////////////////////
    //        Display AnyChart with json data            //
    ///////////////////////////////////////////////////////

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
        src: "https://blackdeerfestival.com/wp-content/uploads/2018/02/blackdeer-semi-transparent-block-1000x618.png",
       
      });
      chart.draw();

      //Reset loop array placeholder and counts object 'data placeholder'
      dataSetToCount = [];
      counts = {};
      move();
    }
  }
  
});

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