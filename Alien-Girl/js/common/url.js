
/**
 * Returns the address of the current web page
 * @returns {String} Address of the web page
 */
function getAddress()
{
	var url = window.location.href;
	var parts = url.split(/[\?]+/);

	return parts[0];
}


/**
 * Returns the value of a field from the query string
 * @param {String} Name of the field
 * @returns {String} Value of the field or false if the key was not found.
 */
function getQueryField(field) {
	var url = window.location.href;

	// Extract all field-value pairs
  fieldValues = url.split(/[\?&]+/);

	// Find field-value pair that matches the field
  for (i = 0; i < fieldValues.length; i++)
	{
		fieldValue = fieldValues[i].split("=");

    if (fieldValue[0] == field)
      return fieldValue[1];
  }

	return false;
}


/**
 * Returns the values for all fields in the query string
 * @param {String} URL that contains the query string
 */
function getQueryFields(url)
{
	fieldValues = url.split(/[\?&]+/);
	values = {};

	for(var i = 1; i < fieldValues.length; i++)
	{
		fieldValue = fieldValues[i].split("=");
		values[fieldValue[0]] = fieldValue[1];
	}

	return values;
}


/**
 * Changes the query string
 *
 * @param {Object} Associative array with field to update
 * @returns {String} Updates query string
 */
function updateQueryString(updates)
{
	var url = window.location.href;

	// Extract all field-value pairs
  fieldValues = getQueryFields(url);

	// Copy updates into fieldValues object
	for(field in updates) {
		fieldValues[field] = updates[field];
	}

	var queryString = getAddress();
	var first = true;

	for(field in fieldValues) {
		queryString += (first?"?":"&") + field + "=" + fieldValues[field];
		first = false;
	}

	return queryString;
}
