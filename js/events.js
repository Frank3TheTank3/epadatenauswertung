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
}

function resetSettings(){
    document.getElementById('answerSizeInput').value = "";
    document.getElementById('entriesInput').value = "";
    localStorage.clear();
    window.location.reload();
}