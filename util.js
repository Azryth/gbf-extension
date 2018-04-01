////////////////
// Formatting //
////////////////

/*
Transforms seconds into hh:mm:ss format
*/
function get_elapsed_time_string(total_seconds) {
  function pretty_time_string(num) {
    return ( num < 10 ? "0" : "" ) + num;
  }

  var hours = Math.floor(total_seconds / 3600);
  total_seconds = total_seconds % 3600;

  var minutes = Math.floor(total_seconds / 60);
  total_seconds = total_seconds % 60;

  var seconds = Math.floor(total_seconds);

  // Pad the minutes and seconds with leading zeros, if required
  hours = pretty_time_string(hours);
  minutes = pretty_time_string(minutes);
  seconds = pretty_time_string(seconds);

  // Compose the string for display
  var currentTimeString = hours + ":" + minutes + ":" + seconds;

  return currentTimeString;
}

/*
Formats a number by adding ' to separate large numbers
*/
function displayNumbers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

/*
Formats the key value pair in a li and returns the html jQuery node
classes: string array of classes that should be attached to the base node
subNum: indent depth of the key
*/
function formatLiData(key, value, subNum, classes=[]) {
  //create base element
  var li = $("<li>");
  for(var i = 0; i < classes.length; i++) {
    li.addClass(classes[i]);
  }
  //key part
  var keyContainer = $("<p>");
  if(subNum > 0) {
    keyContainer.addClass("sub" + subNum);
  }
  keyContainer.text(key);
  li.append(keyContainer);

  //value part
  var valueContainer = $("<p>");
  valueContainer.text(value);
  li.append(valueContainer);

  return li;
}
