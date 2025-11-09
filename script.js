console.log("let's write some js")


let currentsong = new Audio()

let songarr;

function formatTime(seconds) {

    seconds = Math.max(0, Math.floor(seconds));

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }

    return `${minutes}:${remainingSeconds}`;
}


async function getsongs() {

    let x = await fetch("http://127.0.0.1:3000/mp3/")
    let data = await x.text()
    console.log(data)

    let obj = document.createElement("div")
    obj.innerHTML = data

    let as = obj.getElementsByTagName("a")

    //console.log(as)  yeh print karke dekh lo ki 'as' ek aaray hai 

    let songarr = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3"))
            songarr.push(element.href.split("3%5C")[1])
    }

    //from here we get an array of all track
    return songarr

}

const playmusic = (track, pause = true) => {

    currentsong.src = "/mp3/" + track
    if (!pause) {
        currentsong.play()
        play.src = "img/play-button.png"
    }
    document.querySelector(".playername").innerHTML = decodeURIComponent(track)
    document.querySelector(".playerduration").innerHTML = "00:00/00:00"

}

async function main() {
     songarr = await getsongs()
    console.log(songarr)

    playmusic(songarr[0])

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    //list the song in library
    for (const i of songarr) {
        songul.innerHTML = songul.innerHTML + /*`<li> ${i.replaceAll("%20" , " ")} </li>`*/

            `<li>
                            <div class="librarycard1 flex">
                                <img class="invert" src="img/next-button.png" alt="">
                                <div class="info">
                                    <div class="sname">${i.replaceAll("%20", " ")}</div>
                                    <div class="aname">Mulix</div>
                                </div>
                                <div>Play Now</div>
                                <img class="play invert" src="img/play-button.png" alt="">
                            </div>
                        </li>`
    }

    //attach event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {  //each e return li
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)                    //info ke andar phele div ke text me song hai
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //attach event listner to play button
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.png"
        } else {
            currentsong.pause()
            play.src = "img/play-button.png"
        }
    })

    //update duration
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".playerduration").innerHTML =
            `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    //seekbar event listner
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    //add event listner to previous and next button
    previous.addEventListener("click", ()=>{
        let index = songarr.indexOf(currentsong.src.split("/mp3/")[1])
        if(index>0){
            playmusic(songarr[index-1])
        }
    })

    next.addEventListener("click", ()=>{
        let index = songarr.indexOf(currentsong.src.split("/mp3/")[1])
        if(index<songarr.length-1){
            playmusic(songarr[index+1])
        }
    })

}

main()