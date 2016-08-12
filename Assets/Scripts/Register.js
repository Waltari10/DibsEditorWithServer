import UnityEngine.UI;

#pragma strict

public var firstnameInputField : InputField;
public var surnameInputField : InputField;
public var passwordInputField : InputField;
public var passwordInputFieldConfirm : InputField;
public var emailInputField : InputField;
public var textField : Text;
public var loginButton : Button;
public var registerButton : Button;

function Start () {
    PlayerPrefs.SetString("scene", "register");

    loginButton.onClick.AddListener (function () {
        ChangeToLoginCanvas();
    });
    
    registerButton.onClick.AddListener (function ()  {
        register();
    }); 
}

function ChangeToLoginCanvas () {
	CanvasControllerSingleton.getInstance().instantiateLoginCanvas();
	Destroy(CanvasControllerSingleton.getInstance().getRegisterCanvas());
}

function register () {
    var pass : String = passwordInputField.text;
    var passConfirm : String = passwordInputFieldConfirm.text;
    var email : String = emailInputField.text;
    var firstname : String = firstnameInputField.text;
    var surname : String = surnameInputField.text;
	
    if (pass == null || pass == "" || email == "" || email == null || firstname == "" || firstname == null || surname == "" || surname == null) {
        textField.text = "Please fill all fields";
    } else if (!email.Contains('@')) {
        textField.text = "Email doesn't have @";
    } else if (pass != passConfirm) {
        DebugTime.Log("pass: " + pass);
        DebugTime.Log("passConfirm: " + passConfirm);
        textField.text = "Password's dont match";
    } else {
		CanvasControllerSingleton.getInstance().instantiateLoadingCanvas();
        sendUserInformation(pass, email, firstname, surname);
    }
}

function ReceiveData(jsonReply : JSONObject) {
    registerEvent(jsonReply);
}

function registerEvent(jsonReply : JSONObject) {
    if (jsonReply.ContainsKey("email")) {
        PlayerPrefs.SetString("email", jsonReply["email"].Str);
        PlayerPrefs.SetString("lastname", jsonReply["lastname"].Str);
        PlayerPrefs.SetString("firstname", jsonReply["firstname"].Str);
        PlayerPrefs.SetString("sessionid", jsonReply["sessionid"].Str);
        DebugTime.Log(PlayerPrefs.GetString("sessionid"));
        DebugTime.Log(PlayerPrefs.GetString("email"));

		CanvasControllerSingleton.getInstance().instantiateProfileCreationCanvas();
		Destroy(CanvasControllerSingleton.getInstance().getRegisterCanvas());
    }
    if (jsonReply.ContainsKey("error")) {
        textField.text = jsonReply.GetString("error");
    }
}

function sendUserInformation (pass : String, email : String, firstname : String, lastname : String) {
    var json = new JSONObject();
    json.Add("event", "register");
    json.Add("password", pass);
    json.Add("email", email);
    json.Add("firstname", firstname);
    json.Add("lastname", lastname);

    LoopTillSent(json.ToString());
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