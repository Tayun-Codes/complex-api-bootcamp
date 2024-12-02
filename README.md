# 📊 Project: Complex API 
Goal: Use data returned from one api to make a request to another api and display the data returned


https://github.com/user-attachments/assets/18f4c064-4c5a-4183-a8cd-2937a540c969


Accessed the Riot API to retrieve top three, most-played champions based on username and region.
Due to the Riot Games not maintaining the API, access to a community API was required in order to display champion images on the document.
The three champion names are then fed into the Spotify API to retrieve the top playlist with that name in the title.

Unfortunately, Riot API Keys are only valid for 24 hours so this application would require a lot of maintenance to host.

**Instructions for if you would like to download the code and input your own keys:**
- Create a keys.js document in the js folder
```
export const riotKey = 'your riotKey within quotations'
export const spotifyClientID = 'your spotifyClientID within quotations'
export const spotifyClientSecret = 'your spotifyClientSecret within quotations'
```

## What I Learned
- How to read API documentation and access the data that I need
- How to directly feed data from one API into another API for linked fetches
