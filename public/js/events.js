var inputEntries = document.getElementById("entriesInput");

inputEntries.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
  event.preventDefault();
  document.getElementById("entriesButton").click();
  }
}); 


var inputSmallSize = document.getElementById("answerSizeInput");

inputSmallSize.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
  event.preventDefault();
  document.getElementById("answerSizeButton").click();
  }
}); 

var inputStartSize = document.getElementById("entriesStartInput");

inputStartSize.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
  event.preventDefault();
  document.getElementById("entriesScopedButton").click();
  }
}); 

var inputEndSize = document.getElementById("entriesEndInput");

inputEndSize.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
  event.preventDefault();
  document.getElementById("entriesScopedButton").click();
  }
}); 

function storeItemValue(nameOfItem, itemValue){
localStorage.setItem(nameOfItem, itemValue);
window.location.reload();
}

function storeInputValue(nameOfItem){

  if(nameOfItem === 'numberofentries')
  {
    if(document.getElementById('entriesInput').value < 47748)
    {
      let itemValue = document.getElementById('entriesInput').value;
      localStorage.setItem(nameOfItem, itemValue);
      window.location.reload();
    }
    else
    {
      alert("Please select a value between 1 and 47748")
    }
  }

  if(nameOfItem === 'graph4smallvalue')
  {
    if(document.getElementById('answerSizeInput').value < 1000)
    {
    let itemValue = document.getElementById('answerSizeInput').value;
    localStorage.setItem(nameOfItem, itemValue);
      window.location.reload();
    }
    else
    {
      alert("Please select a value between 1 and 999")
    }
  }

  if(nameOfItem === 'scopedEntries')
  {
   
    let endInput = document.getElementById('entriesEndInput');
    let startInput = document.getElementById('entriesStartInput');
    if (startInput.value.length === 0 && endInput.value.length === 0)
    {
      alert("Please enter a scope")
    }
    else if (startInput.value < 0 || endInput.value.length < 0)
    {
      alert("Negativ numbers are not allowed")
    }
    else if(startInput.value < endInput.value)
    {
      checkStartInputValue(startInput, endInput);
      checkEndInputValue(startInput, endInput);
      window.location.reload();

    }
    else if(startInput.value.length > 0 && endInput.value.length === 0 || endInput.value.length > 0 && startInput.value.length === 0 )
    {
      checkStartInputValue(startInput, endInput);
      checkEndInputValue(startInput, endInput);
      window.location.reload();

    }
    else
    {
      alert("Your selection is not possible")
    }
  }
}
//Check start value
function checkStartInputValue(startInput, endInput)
{ 
  
  if(startInput.value < 47748)
  {
    localStorage.setItem("startEntries", startInput.value);
  }

  else
  {
    alert("Please select a value between one and " + endInput.value)
  }
}

//Check end value
function checkEndInputValue(startInput, endInput)
{
  
  if(endInput.value > 1 && endInput.value < 47748)
  {
    localStorage.setItem("endEntries", endInput.value);
  }
  //If endinput value = null then remove endEntries from localstorage
  else if(endInput.value  === "" || endInput.value  === null || endInput.value  === undefined)
  {

    localStorage.removeItem('endEntries');
  }
  //Else 
  else
  {
    alert("Please select a end value between " + startInput.value + " and 47748")
  }

}

function resetSettings(){
    document.getElementById('answerSizeInput').value = "";
    document.getElementById('entriesInput').value = "";
    document.getElementById('entriesStartInput').value = "";
    document.getElementById('entriesEndInput').value = "";
    localStorage.clear();
    localStorage.setItem("appHasStarted", true);
    window.location.reload();
}