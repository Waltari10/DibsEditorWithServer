import UnityEngine.UI;
import WebSocketSingleton;
import Boomlagoon.JSON;

#pragma strict

private var loginCanvas						: UnityEngine.Object; 
private var registerCanvas					: UnityEngine.Object; 
private var profileCreationCanvas			: UnityEngine.Object; 
private var browseCanvas					: UnityEngine.Object; 
private var profileCanvas					: UnityEngine.Object;
private var notificationCanvas				: UnityEngine.Object;
private var loadingCanvas					: UnityEngine.Object;
private var fatalErrorNotificationCanvas 	: UnityEngine.Object;

function Awake() {
	//PlayerPrefs.DeleteAll();
    Screen.orientation = ScreenOrientation.Portrait;  //Disable screen rotation by forcing it upright
    instantiateLastCanvas();
}

function update () { //Close application on back press
    if (Input.GetKeyDown(KeyCode.Escape)) { Application.Quit(); } //Close program on back button press
}

function getLoadingCanvas() {
	return loadingCanvas;
}

function getBrowseCanvas() {
	return browseCanvas;
}

function getProfileCanvas() {
	return profileCanvas;
}

function getLoginCanvas() {
	return loginCanvas;
}

function getRegisterCanvas() {
	return registerCanvas;
}

function getProfileCreationCanvas() {
	return profileCreationCanvas;
}

function getNotificationCanvas() {
	return notificationCanvas;
}

function getFatalErrorNotificationCanvas() {
	return fatalErrorNotificationCanvas;
}

function instantiateLoadingCanvas() {
	loadingCanvas = Instantiate(Resources.Load("Prefabs/loadingCanvas"));
}

function instantiateBrowseCanvas() {
	browseCanvas = Instantiate(Resources.Load("Prefabs/browseCanvas"));
}

function instantiateProfileCanvas() {
	profileCanvas = Instantiate(Resources.Load("Prefabs/profileCanvas"));
}

function instantiateLoginCanvas() {
	loginCanvas = Instantiate(Resources.Load("Prefabs/loginCanvas"));
}

function instantiateRegisterCanvas() {
    registerCanvas = Instantiate(Resources.Load("Prefabs/registerCanvas"));
}

function instantiateProfileCreationCanvas() {
	profileCreationCanvas = Instantiate(Resources.Load("Prefabs/profileCreationCanvas"));
}

function instantiateNotificationCanvas(newText : String) {
	notificationCanvas = Instantiate(Resources.Load("Prefabs/notificationCanvas"));
	setNotificationText(newText);
}

function instantiateFatalErrorNotificationCanvas(newText : String) {
	fatalErrorNotificationCanvas = Instantiate(Resources.Load("Prefabs/fatalErrorNotificationCanvas"));
	setFatalErrorNotificationText(newText);
}

function setNotificationText(newText : String) {
	var errorText : GameObject = GameObject.Find("/notificationCanvas(Clone)/errorText");
	errorText.GetComponent.<Text>().text = newText;
}

function setFatalErrorNotificationText(newText : String) {
	var errorText : GameObject = GameObject.Find("/fatalErrorNotificationCanvas(Clone)/errorText");
	errorText.GetComponent.<Text>().text = newText;
}

function getCurrentCanvas() {
	Debug.Log(PlayerPrefs.GetString("scene")); //Log which scene is active

    if (PlayerPrefs.GetString("scene").Equals("login")) {
		return loginCanvas;
    } else if (PlayerPrefs.GetString("scene").Equals("register")) {
		return registerCanvas;
    } else if (PlayerPrefs.GetString("scene").Equals("profileCreation")) {
    	return profileCreationCanvas;
    } else if (PlayerPrefs.GetString("scene").Equals("browse")) {
    	return browseCanvas;
    } else if (PlayerPrefs.GetString("scene").Equals("profile")) {
    	return profileCreationCanvas;
    }
    return null;
}

function instantiateLastCanvas() {
	Debug.Log(PlayerPrefs.GetString("scene")); //Log which scene is going to be loaded 
	
	if (PlayerPrefs.GetString("scene").Equals("") || PlayerPrefs.GetString("scene").Equals("login")) {
		instantiateLoginCanvas();
    } else if (PlayerPrefs.GetString("scene").Equals("register")) {
		instantiateRegisterCanvas();
    } else if (PlayerPrefs.GetString("scene").Equals("profileCreation")) {
    	instantiateProfileCreationCanvas();
    } else if (PlayerPrefs.GetString("scene").Equals("browse")) {
    	instantiateBrowseCanvas();
    } else if (PlayerPrefs.GetString("scene").Equals("profile")) {
    	instantiateProfileCanvas();
    } else {
    	instantiateLoginCanvas();
    }
}