
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
 * Changes the query string
 *
 * @param {Object} Associative array with field to update
 * @returns {String} Updates query string
 */
function updateQueryString(updates)
{
	var url = window.location.href;

	// Extract all field-value pairs
  fieldValues = url.split(/[\?&]+/);
	delete fieldValues[0];

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
