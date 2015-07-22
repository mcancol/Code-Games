
/**
 * Loads the list of levels into a form element.
 * @param {String} element <select> Element to insert levelnames into.
 * @param {String} selected Selected item.
 */
function updateLevelSelector(element, selected)
{
  jQuery.ajax(server + "ldb/list_levels.php", { dataType: 'json'}).done(function(result) {
    for(var i = 0; i < result.length; i++) {
      var list = $(element);

      var li = $("<option/>")
        .appendTo(list)
        .attr('value', result[i].name)
        .text(result[i].name[0].toUpperCase() + result[i].name.slice(1));

      if(selected == result[i].name)
        li.attr('selected', 'selected');
    }
  }.bind(this));
}


/**
 * Returns an object with options from the query string.
 */
function getOptionsFromQuery()
{
  return {
    editMode:  getQueryField("edit"),
    debugMode: getQueryField("debug"),
    gameStart: getQueryField("game"),
    levelName: getQueryField("level"),
    userId:    getQueryField("user")
  }
}
