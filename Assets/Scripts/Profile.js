import UnityEngine.UI;
import Boomlagoon.JSON;
#pragma strict

public var cardPicture : Image;
public var logoutButton : Button;
public var browseButton : Button;
public var cardName : Text;
public var cardValue : Text;
public var cardDescription : Text;
public var cardBackgroud : Image;
public var cardRank : Text;

function Start () {

    PlayerPrefs.SetString("scene", "profile");

	browseButton.onClick.AddListener (function () {
    	CanvasControllerSingleton.getInstance().instantiateBrowseCanvas();
		Destroy(CanvasControllerSingleton.getInstance().getProfileCanvas());
    });
    
    logoutButton.onClick.AddListener (function () {
	    logout();
    });

	if (WebSocketSingleton.getInstance() != null) {  //Only tries to get profileCard if the app is connected
    	getProfileCard();
    }
}

function getProfileCard() {
	var json = new JSONObject();
    json.Add("event", "getProfileCard");
    json.Add("email", PlayerPrefs.GetString("email"));
	StartCoroutine(LoopTillSent(json.ToString()));
}

function ReceiveData(jsonReply : JSONObject) {
	if (jsonReply.ContainsKey("error")) {
		Debug.Log(jsonReply.GetString("error"));
		CanvasControllerSingleton.getInstance().instantiateFatalErrorNotificationCanvas("Oops, an error happened! Sorry. Press ok to restart.");
	} else {
		var pictureBytes : byte[] = System.Convert.FromBase64String(jsonReply.GetString("picture"));
		var cardPictureTexture = new Texture2D( 720, 720);
		cardPictureTexture.LoadImage(pictureBytes);
		var sprite = new Sprite ();
		sprite = Sprite.Create (cardPictureTexture, new Rect (0,0,720,720), new Vector2 (0.5f, 0.5f));
		cardPicture.sprite = sprite;
		
		cardName.text = jsonReply.GetString("cardname");
		cardValue.text = "Value: " + jsonReply.GetNumber("value") + " dibcoins";
		cardDescription.text = jsonReply.GetString("description");
		cardRank.text = "Rank: " + jsonReply.GetNumber("rank");
		
		cardBackgroud.color.r = parseFloat(jsonReply.GetString("r"));
		cardBackgroud.color.g = parseFloat(jsonReply.GetString("g"));
		cardBackgroud.color.b = parseFloat(jsonReply.GetString("b"));
		
	}
}

function SendString(str : String) {
    WebSocketSingleton.getInstance().SendString(str);
    yield 0;
}

function logout() {
	CanvasControllerSingleton.getInstance().instantiateLoginCanvas();
	Destroy(CanvasControllerSingleton.getInstance().getProfileCanvas());
	PlayerPrefs.DeleteAll();
}

function LoopTillSent(text : String) {
	while (!WebSocketSingleton.getInstance().getSocket().ReadyState.ToString().Equals("Open")) {
		Debug.Log("String still not sent!");
		yield WaitForSeconds (1);
	}
	WebSocketSingleton.getInstance().SendString(text);
	Debug.Log("String sent!");
}