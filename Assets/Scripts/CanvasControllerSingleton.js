#pragma strict

public static class CanvasControllerSingleton extends MonoBehaviour {

    private var canvasController : CanvasController;
	
	public function getInstance() : CanvasController {
		if (!canvasController)	{
		    var scriptsHolder : GameObject = GameObject.Find("GameLogic");
			canvasController = scriptsHolder.GetComponent.<CanvasController>();
		}
		return canvasController;
	}
}