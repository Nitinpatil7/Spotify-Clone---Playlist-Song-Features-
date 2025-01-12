console.log('script Started');

let audioPlayer = new Audio();
let playbtn = document.querySelector("#play");
let isPlaying = false;
let currentplaylist = [];
let currentindex = 0;
const currentTimeElement = document.getElementById("current-time");
const totalDurationElement = document.getElementById("total-duration");
const searchInput = document.querySelector('#search-input');


function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDurations() {
    if (!isNaN(audioPlayer.duration)) {
        totalDurationElement.textContent = ` / ${formatTime(audioPlayer.duration)} `;
    }
    currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
}

audioPlayer.addEventListener("loadedmetadata", updateDurations);
audioPlayer.addEventListener("timeupdate", updateDurations);

async function main() {
    let songs = await fetch('songs.json');
    let data = await songs.json();

    const motivation = document.querySelector('#motivational').addEventListener('click', () => {
        loadlibrary(data.playlists[0]);
    });

    const marathi = document.querySelector('#marathi').addEventListener('click', () => {
        loadlibrary(data.playlists[1]);
    });

    const romantic = document.querySelector('#romantic').addEventListener('click', () => {
        loadlibrary(data.playlists[2]);
    });

    playbtn.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
            playbtn.src = "icons/play.svg";
            isPlaying = false;
        } else {
            audioPlayer.play();
            playbtn.src = "icons/pause.svg";
            isPlaying = true;
        }
    });

    document.querySelector('#next').addEventListener('click', playnext);
    document.querySelector('#previous').addEventListener('click', playprevious);

    searchInput.addEventListener('input', search);
}

function loadlibrary(playlist) {
    let playlist_container = document.querySelector('.playlist');
    playlist_container.innerHTML = '';
    let heading = document.createElement('h2');
    heading.classList.add('playlist_title');
    heading.innerText = playlist.name + ' - playlist';
    playlist_container.appendChild(heading);

    let ul = document.createElement('ul');
    currentplaylist = playlist.songs;
    currentindex = 0;
    playlist.songs.forEach((song) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <p>${song.title.split('-')[0]}</p>
        <p>   - ${song.title.split('-')[1]}</p>
        `;
        li.addEventListener('click', () => {
            playsongs(song.Path);
            song_title(song.title);
        });

        ul.appendChild(li);
    });
    playlist_container.appendChild(ul);
}

function playsongs(playsong) {
    audioPlayer.src = playsong;
    audioPlayer.play();
    playbtn.src = "icons/pause.svg";
    isPlaying = true;
}

function song_title(title) {
    let song_name = document.querySelector('.song_name');
    song_name.innerHTML = title;
}

function playnext() {
    currentindex = (currentindex + 1) % currentplaylist.length;
    song_title(currentplaylist[currentindex].title);
    playsongs(currentplaylist[currentindex].Path);
}

function playprevious() {
    currentindex = (currentindex - 1 + currentplaylist.length) % currentplaylist.length;
    song_title(currentplaylist[currentindex].title);
    playsongs(currentplaylist[currentindex].Path);
}

function search() {
    const query = searchInput.value.toLowerCase();
    const allSongs = data.playlists.flatMap(playlist => playlist.songs);

    const filteredSongs = allSongs.filter(song =>
        song.title.toLowerCase().includes(query)
    );

    const playlist_container = document.querySelector('.playlist');
    playlist_container.innerHTML = '';

    if (filteredSongs.length === 0) {
        playlist_container.innerHTML = '<p>No results found</p>';
        return;
    }

    let ul = document.createElement('ul');
    filteredSongs.forEach((song) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <p>${song.title.split('-')[0]}</p>
        <p>   - ${song.title.split('-')[1]}</p>
        `;
        li.addEventListener('click', () => {
            playsongs(song.Path);
            song_title(song.title);
        });

        ul.appendChild(li);
    });
    playlist_container.appendChild(ul);
}

main();
