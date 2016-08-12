import UnityEngine.UI;

#pragma strict

public var nextButton : Button;
public var profileButton : Button;
public var logoutButton : Button;
public var cardPicture : Image;
public var cardName : Text;
public var cardValue : Text;
public var cardDescription : Text;
public var cardBackgroud : Image;
public var cardRank : Text;

function Start () {
    PlayerPrefs.SetString("scene", "browse");
    
    profileButton.onClick.AddListener (function () {
		CanvasControllerSingleton.getInstance().instantiateProfileCanvas();
		Destroy(CanvasControllerSingleton.getInstance().getBrowseCanvas());
    });
    
    nextButton.onClick.AddListener (function () {
    	requestNextCard();
    });
    
    logoutButton.onClick.AddListener (function () {
	    logout();
    });
    
    if (WebSocketSingleton.getInstance() != null) { //Only tries to get profileCard if the app is connected
    	requestNextCard();
    }
}

function requestNextCard() {

	var jsonString : String;
	if (PlayerPrefs.GetString("seenCards") == "") {
		jsonString = '{"event": "getRandomCard", "seenCards": ""}';
	} else {
		jsonString = '{"event": "getRandomCard", "seenCards": [' +  PlayerPrefs.GetString("seenCards") + "]}";
	}
	
	Debug.Log(jsonString);
	
    var jsonReply = JSONObject.Parse(jsonString);
	
	
	StartCoroutine(LoopTillSent(jsonReply.ToString()));
}

function ReceiveData(jsonReply : JSONObject) {
	if (jsonReply.ContainsKey("error")) {
		Debug.Log(jsonReply.GetString("error"));
		CanvasControllerSingleton.getInstance().instantiateFatalErrorNotificationCanvas("Oops, an error happened! Sorry. Press ok to restart.");
	} else {
	
		var cardIds : JSONArray;
		var seenCardsJSONObject : JSONObject;
		var seenCardsString : String = PlayerPrefs.GetString("seenCards");
		
		if (seenCardsString.Equals("")) {
			PlayerPrefs.SetString("seenCards", "" + jsonReply.GetNumber("idcard"));
		} else {
			seenCardsString = seenCardsString + ", " + jsonReply.GetNumber("idcard");
			PlayerPrefs.SetString("seenCards", seenCardsString);
		}
	
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


function logout() {
	CanvasControllerSingleton.getInstance().instantiateLoginCanvas();
	Destroy(CanvasControllerSingleton.getInstance().getBrowseCanvas());
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
