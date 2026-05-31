$baseDir = "c:\Users\prana\Projects\agri-360\ai\data\PlantVillage"
foreach ($d in Get-ChildItem -Directory $baseDir) {
    $count = (Get-ChildItem $d.FullName -File -Recurse | Measure-Object).Count
    Write-Host ($d.Name + ": " + $count + " files")
}
