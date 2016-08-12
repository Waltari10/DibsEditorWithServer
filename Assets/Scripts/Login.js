import UnityEngine.UI;

#pragma strict

public var passwordInputField : InputField;
public var emailInputField : InputField;
public var loginButton : Button;
public var registerButton : Button;
public var textField : Text;

function Start () {
    PlayerPrefs.SetString("scene", "login");
     
    loginButton.onClick.AddListener (function () {
        login();
    });
    registerButton.onClick.AddListener (function ()  {
        register();
    }); 
}

function ReceiveData(jsonReply : JSONObject) {
        loginEvent(jsonReply);
}

function loginEvent(jsonReply : JSONObject) {
    if (jsonReply.ContainsKey("email")) {
   		PlayerPrefs.SetString("email", jsonReply.GetString("email"));
        PlayerPrefs.SetString("lastname", jsonReply["lastname"].Str);
        PlayerPrefs.SetString("firstname", jsonReply["firstname"].Str);
        PlayerPrefs.SetString("sessionid", jsonReply.GetString("sessionid"));

    	if (jsonReply.GetBoolean("profile") == true) {  	//User has profilecard moving to browsecards
    		CanvasControllerSingleton.getInstance().instantiateBrowseCanvas();
    	} else { 										//No profilecard moving to profilecreation
			CanvasControllerSingleton.getInstance().instantiateProfileCreationCanvas();
    	}
		Destroy(CanvasControllerSingleton.getInstance().getLoginCanvas());
    } 
    if (jsonReply.ContainsKey("error")) {
   		Debug.Log(jsonReply.GetString("error"));
        textField.text = jsonReply.GetString("error");
    }
}

function register () {
	CanvasControllerSingleton.getInstance().instantiateRegisterCanvas();
	Destroy(CanvasControllerSingleton.getInstance().getLoginCanvas());
}

function login () {
    var pass = passwordInputField.text;
    var email = emailInputField.text;
	
    if (pass == null || pass == "" || email == "" || email == null) {
        textField.text = "Please fill all fields";
    }
    else if (!email.Contains("@")) {
        textField.text = "Email doesn't have @";
    } else {
        sendUserInformation(pass, email);
    }
}

function sendUserInformation (pass : String, email : String){
    var loginJson = new JSONObject();
    loginJson.Add("event", "login");
    loginJson.Add("password", pass);
    loginJson.Add("email", email);
    LoopTillSent(loginJson.ToString());
}

function LoopTillSent(text : String) {

	CanvasControllerSingleton.getInstance().instantiateLoadingCanvas();
	while (!WebSocketSingleton.getInstance().getSocket().ReadyState.ToString().Equals("Open")) {
		Debug.Log("String still not sent!");
		yield WaitForSeconds (1);
	}
	WebSocketSingleton.getInstance().SendString(text);
	Destroy(CanvasControllerSingleton.getInstance().getLoadingCanvas());
	Debug.Log("String sent!");
}