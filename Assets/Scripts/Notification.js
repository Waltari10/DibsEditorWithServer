#pragma strict
	
public var ok : Button;

function Start () {
	ok.onClick.AddListener (function () {
		Destroy(CanvasControllerSingleton.getInstance().getNotificationCanvas());
    });
}