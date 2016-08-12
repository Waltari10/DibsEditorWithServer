using UnityEngine.UI;
using UnityEngine;
using System.Collections;

public class changeColor : MonoBehaviour {
	public Button background;
	public float redValue;
	public float greenValue;
	public float blueValue;
	private Color color;
	// 
	public void change () {
		color = new Color (redValue, greenValue, blueValue);
		background.image.color = color;
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
