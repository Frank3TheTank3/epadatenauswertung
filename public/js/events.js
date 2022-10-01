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
    if(document.getElementById('answerSizeInput').value < 5717)
    {
    let itemValue = document.getElementById('answerSizeInput').value;
    localStorage.setItem(nameOfItem, itemValue);
      window.location.reload();
    }
    else
    {
      alert("Please select a value between 1 and 5717")
    }
  }

  if(nameOfItem === 'scopedEntries')
  {
    let startInput = document.getElementById('entriesStartInput');
    let endInput = document.getElementById('entriesEndInput');
    //Check endinput value
    
    if(endInput.value > 1 && endInput.value < 47748)
    {
      let itemValue = endInput.value;
      localStorage.setItem("endEntries", itemValue);
      
      console.log(itemValue)
    }
    //If endinput value = null then remove endEntries from localstorage
    else if(itemValue = null)
    {

      localStorage.removeItem('endEntries');
    }
    //Else 
    else
    {
      alert("Please select a value between " + startInput.value + " and 47748")
    }
  

    if(startInput.value < 47748)
    {
    let itemValue = document.getElementById('entriesStartInput').value;
    localStorage.setItem("startEntries", itemValue);
    }

    else
    {
      alert("Please select a value between one and " + endInput.value)
    }
  
    window.location.reload();





  }
}

function resetSettings(){
    document.getElementById('answerSizeInput').value = "";
    document.getElementById('entriesInput').value = "";
    document.getElementById('entriesStartInput').value = "";
    document.getElementById('entriesEndInput').value = "";
    localStorage.clear();
    window.location.reload();
}




  