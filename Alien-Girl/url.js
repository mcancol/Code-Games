
function getAddress()
{
	var url = window.location.href;				
	var parts = url.split(/[\?]+/);
	
	return parts[0];				
}
	
function querySt(Key) {
  	var url = window.location.href;
   	KeysValues = url.split(/[\?&]+/);
   	for (i = 0; i < KeysValues.length; i++) {
   	    KeyValue = KeysValues[i].split("=");
        if (KeyValue[0] == Key) {
            return KeyValue[1];
        }
   	}
		
	return false;
}
