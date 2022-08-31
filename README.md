## virtualTours


# Pre-requisites

1- Must have Node.js and NPM installed on the machine.

# Commands to Run. 

1- git clone https://github.com/smisra3/virtualTours.git

2- cd virtualTours

3- git checkout main

3- npm i

4- npm run start

Open localhost:5500 to view the app working.

# Next steps:

1- image editiing modal which will have hotspot addition

2- Hotspot linking

3- Runtime tour generation

# every tour to have a config.json file generated to capture all the required info for tour generation platform

{
    "metaInfo": {
        "Dining": {
            "hotspot": "",
            "images": [
                "http://localhost:9988/posx.jpg",
                "http://localhost:9988/negx.jpg",
                "http://localhost:9988/posy.jpg",
                "http://localhost:9988/negy.jpg",
                "http://localhost:9988/posz.jpg",
                "http://localhost:9988/negz.jpg"
            ]
        },
        "entrance": {
            "hotspot": "Dining",
            "images": [
                "http://localhost:9988/posx.jpg",
                "http://localhost:9988/negx.jpg",
                "http://localhost:9988/posy.jpg",
                "http://localhost:9988/negy.jpg",
                "http://localhost:9988/posz.jpg",
                "http://localhost:9988/negz.jpg"
            ]
        }
    },
    "tourStart": {
        "tagName": "entrance"
    }
}

# Routes

1- /

2- /init

3- /upload to open the page for uploading images.