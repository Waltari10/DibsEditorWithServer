using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using Boomlagoon.JSON;

public class sendProfileCreationData : MonoBehaviour {

	JSONObject json = new JSONObject();
	JSONObject jsonColor = new JSONObject();
	public InputField nameOfCard;
	public InputField description;
	public Image backgroud;
	public Texture2D picture;

	// Use this for initialization
	public void createJson () {

		//get rgb of the images background color and make it a string
		float r = backgroud.color.r;
		float g = backgroud.color.g;
		float b = backgroud.color.b;

		jsonColor.Add("r", r.ToString());
		jsonColor.Add("g", g.ToString());
		jsonColor.Add("b", b.ToString());

		json.Add ("event", "setProfileCard");
		json.Add ("cardname", nameOfCard.text);
		json.Add ("picture", "");
		json.Add ("description", description.text);
		json.Add ("email", PlayerPrefs.GetString ("email"));
		json.Add ("rank", 1);
		json.Add ("value", 400);
		json.Add ("color", jsonColor);

		Debug.Log(json.ToString ());
//		StartCoroutine(SendString(json.ToString()));

	}
	
	// Update is called once per frame
	void Update () {
	}
}
