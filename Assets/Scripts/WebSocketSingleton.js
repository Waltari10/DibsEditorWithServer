#pragma strict

import WebSocket;
import System;

//You cant call StartCoroutine in a static class. You cant connect in singleton


public static class WebSocketSingleton extends MonoBehaviour {

    private var webSocketInstance : WebSocket;
	
	public function getInstance() : WebSocket {
		if (!webSocketInstance)	{
		    //webSocketInstance = new WebSocket(new Uri("ws://dibsserver-1201118.rhcloud.com:8000/"));  		//main server
		    webSocketInstance = new WebSocket(new Uri("ws://dibsservertest-1201118.rhcloud.com:8000/"));	//testserver
		}
		return webSocketInstance;
	}

	public function ResetWebSocketInstance () {
	    //webSocketInstance = new WebSocket(new Uri("ws://dibsserver-1201118.rhcloud.com:8000/")); 			//main server
		webSocketInstance = new WebSocket(new Uri("ws://dibsservertest-1201118.rhcloud.com:8000/"));		//testserver
	}
}