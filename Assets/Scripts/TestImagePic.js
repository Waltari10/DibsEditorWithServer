#pragma strict

import ImageVideoContactPicker;


public var button : UnityEngine.UI.Button ;
public var imag : UnityEngine.UI.Image ;


function Start() {
    button.onClick.AddListener (function () {
        Browse();
    });
}

function OnEnable() {
	PickerEventListener.onImageSelect += OnImageSelect;
	PickerEventListener.onImageLoad += OnImageLoad;

}

function OnDisable() {
	PickerEventListener.onImageSelect -= OnImageSelect;
	PickerEventListener.onImageLoad -= OnImageLoad;

}

function Browse () {
	#if UNITY_ANDROID
		AndroidPicker.BrowseImage();
	#elif UNITY_IPHONE
		IOSPicker.BrowseImage();
	#endif

}

// Update is called once per frame
function OnImageSelect(imgPath : String) {
	Debug.Log ("Image Location : "+imgPath);
	Debug.Log("Image Path : " + imgPath);
}

function OnImageLoad(imgPath : String, tex : Texture2D) {
	TextureScale.Bilinear (tex, 720, 720);
	var sprite : Sprite = new Sprite ();
	sprite = Sprite.Create (tex, new Rect (0,0,720,720), new Vector2 (0.5f, 0.5f));
	imag.overrideSprite = sprite;
}