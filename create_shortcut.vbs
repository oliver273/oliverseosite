Set oWS = WScript.CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
sLinkFile = oWS.SpecialFolders("Desktop") & "\OliverSEO Business Dashboard.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = fso.GetParentFolderName(WScript.ScriptFullName) & "\START_APP.bat"
oLink.WorkingDirectory = fso.GetParentFolderName(WScript.ScriptFullName)
oLink.Description = "OliverSEO Business Dashboard and Reddit Outreach Tool"
oLink.WindowStyle = 1

' Set icon if it exists
iconPath = fso.GetParentFolderName(WScript.ScriptFullName) & "\icon.ico"
If fso.FileExists(iconPath) Then
    oLink.IconLocation = iconPath
End If

oLink.Save
WScript.Echo "Shortcut created on Desktop with logo!"

