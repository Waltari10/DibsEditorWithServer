#pragma strict

private var scriptsHolder : GameObject;

function Start () {
	WebSocketSingleton.ResetWebSocketInstance();
    StartCoroutine(WebSocketSingleton.getInstance().Connect()); //Connect to server
	ReceiveString();
	StartCoroutine(MakeSureIsConnected());
}

function MakeSureIsConnected() {
	while (true) {
		if (WebSocketSingleton.getInstance().getSocket().ReadyState.ToString().Equals("Closed")) {
			WebSocketSingleton.ResetWebSocketInstance();
            StartCoroutine(WebSocketSingleton.getInstance().Connect());
		}
		yield WaitForSeconds(1);
	}
}

/*function LoopTillSent(text : String) {
	CanvasControllerSingleton.getInstance().instantiateLoadingCanvas();
	while (!WebSocketSingleton.getInstance().getSocket().ReadyState.ToString().Equals("Open")) {
		Debug.Log("String still not sent!");
		yield WaitForSeconds (1);
		Debug.Log("testing yield return");
	}
	SendString(text);
	Destroy(CanvasControllerSingleton.getInstance().getLoadingCanvas());
	Debug.Log("String sent!");
}*/

function SendString(str : String) {
    WebSocketSingleton.getInstance().SendString(str);
    yield 0;
}

function ReceiveString() : IEnumerator {
    while (true) {
        var reply : String = WebSocketSingleton.getInstance().RecvString();
        if (reply !== null) {
        
			Destroy(CanvasControllerSingleton.getInstance().getLoadingCanvas());
			
            Debug.Log ("Received: " + reply);
            var jsonReply = JSONObject.Parse(reply);
            var eventName : String = jsonReply.GetString("event");
            
            switch (eventName) {
            	case "restoresession":
	                RestoreSessionEvent(jsonReply);
	            break;
	            case "setProfileCard":
	            	if (GameObject.Find("profileCreationCanvas(Clone)") != null) {
		            	scriptsHolder = GameObject.Find("profileCreationCanvas(Clone)");
						var profileCreationScript = scriptsHolder.GetComponent.<ProfileCreation>();
		            	profileCreationScript.ReceiveData(jsonReply);
	            	}
	            break;
	            case "getProfileCard":
	            	if (GameObject.Find("profileCanvas(Clone)") != null) {
		            	scriptsHolder = GameObject.Find("profileCanvas(Clone)");
						var profileScript = scriptsHolder.GetComponent.<Profile>();
		            	profileScript.ReceiveData(jsonReply);
		            }
	            break;
	            case "getRandomCard":
	            	if (GameObject.Find("browseCanvas(Clone)") != null) {
		            	scriptsHolder = GameObject.Find("browseCanvas(Clone)");
						var browseScript = scriptsHolder.GetComponent.<Browse>();
		            	browseScript.ReceiveData(jsonReply);
	            	}
	            break;
	            case "register":
	            	if (GameObject.Find("registerCanvas(Clone)") != null) {
		            	scriptsHolder = GameObject.Find("registerCanvas(Clone)");
						var registerScript = scriptsHolder.GetComponent.<Register>();
		            	registerScript.ReceiveData(jsonReply);
		            }
		        break;
		        case "login":
		        	if (GameObject.Find("loginCanvas(Clone)") != null) {
			        	scriptsHolder = GameObject.Find("loginCanvas(Clone)");
						var loginScript = scriptsHolder.GetComponent.<Login>();
	            		loginScript.ReceiveData(jsonReply);
            		}
            	break;  
            	default:
            		Debug.Log("Event not regognized");
            	break;      
            }
        }
        if (WebSocketSingleton.getInstance().error !== null) {
			Destroy(CanvasControllerSingleton.getInstance().getLoadingCanvas());
			Debug.LogError ("Error 1 : " + WebSocketSingleton.getInstance().error);
            WebSocketSingleton.getInstance().error = null;
            WebSocketSingleton.ResetWebSocketInstance();
            StartCoroutine(WebSocketSingleton.getInstance().Connect());
        }
        yield 0;
    }
}

function RestoreConnection() {
    WebSocketSingleton.ResetWebSocketInstance();
    yield StartCoroutine(WebSocketSingleton.getInstance().Connect());
    SendSession();
}

function RestoreSessionEvent(jsonReply : JSONObject) {
    if (jsonReply.ContainsKey("sessionid")) {
        PlayerPrefs.SetString("sessionid", jsonReply["sessionid"].Str);
    } else {
        DebugTime.Log(jsonReply["error"].Str);
        CanvasControllerSingleton.getInstance().instantiateNotificationCanvas(jsonReply["error"].Str);
    }
}

function SendSession() {
    var json = new JSONObject();
    json.Add("event", "restoresession");
    json.Add("sessionid", PlayerPrefs.GetString("sessionid"));
    yield StartCoroutine(SendString(json.ToString()));
}

function ErrorEvent (jsonReply : JSONObject) {
    DebugTime.Log("error 2: " + jsonReply["error"]);
}

function OnDisable() { //Close websocket connection when the app gets closed
	WebSocketSingleton.getInstance().Close();
}