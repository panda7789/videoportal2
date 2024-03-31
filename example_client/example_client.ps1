$thumbnailPath = "./thumbnail.jpg"
#$baseAddress = "https://videoportal.panda7789.fun"
$baseAddress = "https://localhost:7287"

function Login {
    $email = Read-Host "Zadejte email"
    $password = Read-Host "Zadejte heslo"
    $body = @{
        email    = $email
        password = $password
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseAddress/api/users/login" -Method Post -Body $body -ContentType "application/json"
    $global:token = $response
    $global:token_email = $email
    MainMenu
}

function GenerateThumbnail {
    param (
        [string]$videoPath
    )

    $ffmpegPath = "./ffmpeg.exe"
    $command = "$ffmpegPath -y -hide_banner -loglevel error -i '$videoPath' -ss 00:00:05 -vframes 1 '$thumbnailPath'"

    Invoke-Expression -Command $command
}

function GetVideoDuration {
    param (
        [string]$videoPath
    )
    $ffprobe = "./ffprobe.exe"
    $command = "$ffprobe -hide_banner -loglevel error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 '$videoPath'"
    Invoke-Expression -Command $command
}

function GetMyPlaylists {
    $playlistsUrl = "$baseAddress/api/playlists/my-playlists"

    try {
        $response = Invoke-RestMethod -Uri $playlistsUrl -Method Get -Headers @{ "Authorization" = "Bearer $($global:token)" }
        if ($response.Count -gt 0) {
            Write-Host "Playlisty:"
            for ($i = 0; $i -lt $response.Count; $i++) {
                Write-Host "$($i + 1). $($response[$i].Name)"
            }

            $selection = Read-Host "Zadejte cislo playlistu do ktereho chcete videa nahrat"
            $selectedPlaylist = $response[$selection - 1]
            
            return $selectedPlaylist
        }
        else {
            Write-Host "Nemate zadne playlisty"
        }
    }
    catch {
        Write-Host "Chyba behem ziskavaní playlistu: $_.Exception.Message"
    }
}

function UploadVideos {
    $selectedPlaylist = GetMyPlaylists 
    if ($selectedPlaylist -eq $null) {
        Write-Host "Neplatna volba"
        MainMenu
        return
    }

    $folderPath = Read-Host "Zadejte cestu ke slozce ze ktere se videa nahraji"
    $videos = Get-ChildItem -Path $folderPath -File |Select-Object -ExpandProperty FullName

    foreach ($video in $videos) {
        GenerateThumbnail -videoPath $video
        $filename = Split-Path -Leaf $video
        $name = [System.IO.Path]::GetFileNameWithoutExtension($filename)
        $videoFile = Get-Item $video
        $durationSec = GetVideoDuration -videoPath $videoFile
        $durationRounded = [Math]::Ceiling($durationSec)
        $playlistId = $selectedPlaylist.id
        $thumbnail = Get-Item -Path $thumbnailPath

        $videoData = @{
            filename    = $filename
            name        = $name
            description = $filename
            durationSec = $durationRounded
            playlistId  = $playlistId
            image       = $thumbnail
        }

        $response = Invoke-WebRequest -Uri "$baseAddress/api/Videos" -Method Post -Headers @{ "Authorization" = "Bearer $($global:token)" } -Form $videoData
        if ($response.StatusCode -ne 200) {
            Write-Host "Chyba pri nahravani videa $filename"
            continue
        }
        $responseBody = ConvertFrom-Json $response.Content

        $headers = @{ 
            "x-guid"        = $responseBody.dataUrl
            "Authorization" = "Bearer $($global:token)"
        }

        $videoData = Get-Item -Path $video

        $fileData = @{
            file = $videoData
        }
        $response = Invoke-WebRequest -Uri "$baseAddress/api/Videos/upload" -Method Post -Headers $headers -ContentType "multipart/form-data" -Form $fileData
        if ($response.StatusCode -ne 200) {
            Write-Host "Chyba pri nahravani videa $filename"
            continue
        }
        
        Write-Host "Video nahrano $filename"
    }
}

function MainMenu {
    if ($null -ne $global:token_email) {
        Write-Host "Prihlaseny jako: " $global:token_email
    }
    Write-Host "1. Prihlaseni"
    Write-Host "2. Nahrani videi"
    $choice = Read-Host "Vyber moznost"

    switch ($choice) {
        1 { Login }
        2 { UploadVideos }
        default { Write-Host "Neplatna volba" }
    }
}

MainMenu