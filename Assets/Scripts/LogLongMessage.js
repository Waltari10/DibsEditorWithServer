 import System.Text.RegularExpressions;

#pragma strict

public static class LogLongMessage {

	function Log(str : String) {
		var splitStr : String[] = Split(str, 15000);
		
		for (var i : int = 0; i < splitStr.length; i++) {
			Debug.Log(splitStr[i]);
		}
	}

	function Split(text : String, charCount : int) : String[] {
	    if (text.length == 0)
	        return new String[0];
	    var arrayLength = (text.length-1) / charCount +1;
	    var result = new String[arrayLength];
	    
	    for(var i = 0; i < arrayLength; i++)
	    {
	        var tmp = "";
	        for (var n = 0; n < charCount; n++)
	        {
	            var index = i*charCount+n;
	            if (index >= text.length)   //important if last "part" is smaller
	                break;
	            tmp += text[index];
	        }
	        result[i] = tmp;
	    }
	    return result;
	}
}