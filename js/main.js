//importing keys hidden from open repo to be used in functions
import { riotKey } from './key.js'
import { spotifyClientID } from './key.js'
import { spotifyClientSecret } from './key.js'




// once the usename is entered and the button is clicked run getName()
document.querySelector('button').addEventListener('click', getName)

// gets the username + tagline from the input, edgecases&errors, 
function getName() {
    // location dropdown shows up
    document.getElementById('partTwo').classList.remove('hidden')
    // filler variables for testing
    // let gameName = 'mental illinois'
    // let tagLine = 'parky'
    // next two lines properly get value from inputs
    let gameName = document.getElementById('gameName').value
    let tagLine = document.getElementById('tagLine').value
    if (tagLine.length > 5 || tagLine.length < 3 || gameName.length > 16 || gameName.length < 3) {
        //would like to add a must be alphanumeric but also allow spaces
        //Pattern regex = Pattern.compile("[^A-Za-z0-9]");
        document.getElementById('error').innerText = 'Game Name or Tag line is incorrect. Make sure your game name is 3-16 characters and your Tag line is 3-5 characters. Both may only contain alphanumeric (letters or numbers) characters.'
    }
    // if gameName has a space, replace the space with %20
    gameName = gameName.split(' ').join('%20')
    // once a region is selected run, getPUUID with the user inputs
    document.querySelector('select').addEventListener('change', () => getPUUID(gameName, tagLine))
}

// gets PUUID using user inputs: gameName and tagLine as defined and grabbed in getName() 
function getPUUID(gameName, tagLine) {
    //grabs the current value of the changed location drop down
    let location = document.querySelector('#partTwo select').value
    // region selector shows up
    document.getElementById('partThree').classList.remove('hidden')
    // template literal for the url using grabbed variables: location, gameName, tagLine, riotKey
    let urlPUUID = `https://${location}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${riotKey}`
    // get PUUID data
    fetch(urlPUUID)
        .then(res => res.json())
        .then(data => {
            let puuid = data.puuid
            // calls getChampions with the grabbed PUUID
            // called anonymously so it doesn't run instantaneously
            document.querySelector('#partThree select').addEventListener('change', () => getChampions(puuid));
        })

}


function getChampions(puuid) {
    let region = document.querySelector('#partThree select').value
    let urlTopThree = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?api_key=${riotKey}`

    class championInfo {
        constructor(name, img) {
            this.name = name;
            this.img = img
        }
    }
    let championNames = []

    fetch(urlTopThree)
        .then(res => res.json())
        .then(data => {
            let championIds = [data[0].championId, data[1].championId, data[2].championId]
            let urlChampions = championIds.map((a) => `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${a}.json`)

            fetch(urlChampions[0])
                .then(res => res.json())
                .then(data => {
                    const championOne = new championInfo(data.alias, data.skins[0].id)
                    championNames.push(championOne.name)

                    let splashPath = data.skins[0].splashPath.toLowerCase()
                    splashPath = splashPath.replace('/lol-game-data/assets', '/rcp-be-lol-game-data/global/default')

                    document.getElementById('championOneName').innerText = championOne.name
                    document.getElementById('championOneImg').src = `https://raw.communitydragon.org/latest/plugins${splashPath}`
                })

            fetch(urlChampions[1])
                .then(res => res.json())
                .then(data => {
                    const championTwo = new championInfo(data.alias, data.skins[0].id)
                    championNames.push(championTwo.name)

                    let splashPath = data.skins[0].splashPath.toLowerCase()
                    splashPath = splashPath.replace('/lol-game-data/assets', '/rcp-be-lol-game-data/global/default')

                    document.getElementById('championTwoName').innerText = championTwo.name
                    document.getElementById('championTwoImg').src = `https://raw.communitydragon.org/latest/plugins${splashPath}`
                })

            fetch(urlChampions[2])
                .then(res => res.json())
                .then(data => {
                    const championThree = new championInfo(data.alias, data.skins[0].id)
                    championNames.push(championThree.name)

                    let splashPath = data.skins[0].splashPath.toLowerCase()
                    splashPath = splashPath.replace('/lol-game-data/assets', '/rcp-be-lol-game-data/global/default')

                    document.getElementById('championThreeName').innerText = championThree.name
                    document.getElementById('championThreeImg').src = `https://raw.communitydragon.org/latest/plugins${splashPath}`

                    const champion = document.querySelectorAll('.champion')
                    champion.forEach((a) => { a.addEventListener('click', () => getSpotify(championNames[a.id])) });
                    console.log(championNames, 'urlTopThree1')
                })

            console.log(championNames, 'urlTopThree')

        })
    /*
    forEach get id and use that id to get champion name as a parameter to pass through the spotify function

    */

}

// document.querySelector('button').addEventListener('click', getName)

async function getSpotify(championName) {
    const token = await _getToken(); //calling _getToken()
    console.log(token) //logging

    const playlistData = await _getPlaylists(token, championName)
    console.log(playlistData)
    document.querySelector('.playlist').classList.remove('hidden')
    document.querySelector('a').href = playlistData.url
    document.getElementById('playlistName').innerText = playlistData.name
    document.getElementById('playlistImage').src = playlistData.image

};


/*<section>
            <a href="">
                <h3></h3>
                <img id="playlist" src="">
            </a>
        </section>
        */


//gets Token once called
const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(spotifyClientID + ':' + spotifyClientSecret)
        },
        body: 'grant_type=client_credentials'
    })
    const data = await result.json();
    return data.access_token;
}

const _getPlaylists = async (token, championName) => {
    const result = await fetch(`https://api.spotify.com/v1/search?query=${championName}&type=playlist&locale=en-US%2Cen%3Bq%3D0.6&offset=0&limit=20`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await result.json();
    console.log(data, 'get playlists')
    const playlistData = {
        url: data.playlists.items[0].external_urls.spotify,
        image: data.playlists.items[0].images[0].url,
        name: data.playlists.items[0].name
    }
    return playlistData;
}


