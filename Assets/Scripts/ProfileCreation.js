import UnityEngine.UI;

#pragma strict

public var cardName : Text;
public var description : InputField;
public var backgroud : Image;
public var logoutButton : Button;
public var nextButton : Button;
public var pictureButton : Button;
public var cardPicture : Image;
public var textureSprite : Sprite;
private var cardTextureBytes : byte[];

function Start () {

    PlayerPrefs.SetString("scene", "profileCreation");
   
	cardName.text = PlayerPrefs.GetString("firstname") + " " + PlayerPrefs.GetString("lastname");

    logoutButton.onClick.AddListener (function () {
        logout();
    });
    
    nextButton.onClick.AddListener(function () {
    	if (cardTextureBytes == null) {
			CanvasControllerSingleton.getInstance().instantiateNotificationCanvas("Please select an image.");
			return;
		}
        CanvasControllerSingleton.getInstance().instantiateLoadingCanvas();
    	StartCoroutine(sendProfileInformation());
    });
    
    pictureButton.onClick.AddListener (function () {
    	OnImageLoadDebugPC(); //pc
        //Browse(); //android
    });
}

function sendProfileInformation () {
	var json = new JSONObject();
	var jsonColor = new JSONObject();

	var r : float = backgroud.color.r;
	var g : float = backgroud.color.g;
	var b : float = backgroud.color.b;

	jsonColor.Add("r", r.ToString());
	jsonColor.Add("g", g.ToString());
	jsonColor.Add("b", b.ToString());

	json.Add ("cardname", PlayerPrefs.GetString("firstname") + " " + PlayerPrefs.GetString("lastname"));
	json.Add ("event", "setProfileCard");
	json.Add ("color", jsonColor);
	json.Add ("description", description.text);
	json.Add ("email", PlayerPrefs.GetString ("email"));
	json.Add ("rank", "1");
	json.Add ("value", "400");
	json.Add ("picture", System.Convert.ToBase64String(cardTextureBytes)); 
	

	Debug.Log(json.ToString ());
	StartCoroutine(SendString(json.ToString()));
	yield;
}

function SendString(str : String) {
    WebSocketSingleton.getInstance().SendString(str);
    yield 0;
}

function ReceiveData(jsonReply : JSONObject){
	if (jsonReply.ContainsKey("error")) {
		Debug.Log(jsonReply.GetString("error"));
		CanvasControllerSingleton.getInstance().instantiateFatalErrorNotificationCanvas("Oops, an error happened! Sorry. Press ok to restart.");
	} else {
		CanvasControllerSingleton.getInstance().instantiateProfileCanvas();
		Destroy(CanvasControllerSingleton.getInstance().getProfileCreationCanvas());
	}
}

function logout() {
	CanvasControllerSingleton.getInstance().instantiateLoginCanvas();
	Destroy(CanvasControllerSingleton.getInstance().getProfileCreationCanvas());
	PlayerPrefs.DeleteAll();
}

function OnEnable() {
	PickerEventListener.onImageLoad += OnImageLoad;

}

function OnDisable() {
	PickerEventListener.onImageLoad -= OnImageLoad;

}

function Browse () {
	#if UNITY_ANDROID
		AndroidPicker.BrowseImage();
	#endif

}

function OnImageLoadDebugPC() {
	TextureScale.Bilinear(textureSprite.texture, 720,720);
 	var pixels = textureSprite.texture.GetPixels(0, 0, textureSprite.rect.width, textureSprite.rect.height );
	var croppedTexture = new Texture2D( 720, 720);
	croppedTexture.SetPixels( pixels );
	croppedTexture.Apply();
	TextureScale.Bilinear(croppedTexture, 720,720);
	var sprite : Sprite = new Sprite ();
	sprite = Sprite.Create (croppedTexture, new Rect (0,0,720,720), new Vector2 (0.5f, 0.5f));
	cardPicture.overrideSprite = sprite;
	
	cardTextureBytes = croppedTexture.EncodeToJPG();
}

function OnImageLoad(imgPath : String, tex : Texture2D) {
	TextureScale.Bilinear (tex, 720, 720);
	cardTextureBytes = tex.EncodeToJPG(); 
	var sprite : Sprite = new Sprite ();
	sprite = Sprite.Create (tex, new Rect (0, 0, 720, 720), new Vector2 (0.5f, 0.5f));
	cardPicture.overrideSprite = sprite;
}

