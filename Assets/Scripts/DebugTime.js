#pragma strict

public static class DebugTime extends MonoBehaviour {

    function getTimeStamp()
    {
        return System.DateTime.UtcNow.ToString("HH:mm:ss.fff: ");
        // or try this if you need a date in front:
        //return System.DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff: ");
    }

    function Log (obj : Object) {
            UnityEngine.Debug.Log(getTimeStamp() + obj);

    }

    function LogError(obj : Object) {
        UnityEngine.Debug.LogError(getTimeStamp() + obj);
    }

    function LogWarning(obj : Object) {
        UnityEngine.Debug.LogWarning(getTimeStamp() + obj);
    }

    function LogException( exception : System.Exception) {
        UnityEngine.Debug.LogException(exception);
    }

    function Break()
    {
        UnityEngine.Debug.Break();
    }

    function DebugBreak()
    {
        UnityEngine.Debug.DebugBreak();

    }

    function ClearDeveloperconsole()
    {
        UnityEngine.Debug.ClearDeveloperConsole();
    }
}