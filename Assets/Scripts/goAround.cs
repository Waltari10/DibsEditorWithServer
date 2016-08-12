using UnityEngine;
using System.Collections;

public class goAround : MonoBehaviour {

public int kertoma = 0;
public bool oikea;
void Update() {
	//transform.Rotate(Vector3.down * Time.deltaTime);
	if (oikea == true) {
		transform.Rotate (Vector3.back * Time.maximumDeltaTime / kertoma, Space.World);
	} else if (kertoma > 0) {
		transform.Rotate (Vector3.forward * Time.maximumDeltaTime / kertoma, Space.World);
	}
	
	}
}