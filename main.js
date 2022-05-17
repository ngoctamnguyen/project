const SERVER_ROOT = 'http://localhost:3000';

window.onload = function () {

    // if (localStorage.getItem('accessToken')) {
    //     afterLogin();
    // } else {
    //     notLogin();
    // }


    document.getElementById('main-nav-loggedIn').style.display = 'none';
    document.getElementById('songLists').style.display = 'none';
    document.getElementById('playLists').style.display = 'none';
    document.getElementById('iFooter').style.display = 'none';
    document.getElementById('welcome').style.display = '';
    document.getElementById('main-nav-loggedOut').style.display = '';
    document.getElementById('btnSearch').onclick = search;

    document.getElementById("btnlogIn").onclick = function () {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch(`${SERVER_ROOT}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => loggedInFeatures(data));
    }

    document.getElementById("btnLogOut").onclick = function () {
        document.getElementById('main-nav-loggedIn').style.display = 'none';
        document.getElementById('songLists').style.display = 'none';
        document.getElementById('playLists').style.display = 'none';
        document.getElementById('iFooter').style.display = 'none';
        document.getElementById('welcome').style.display = '';
        document.getElementById('main-nav-loggedOut').style.display = '';
        localStorage.removeItem('accessToken');
        pauseTrack();
    }
}

window.onscroll = function() {
    const header = document.getElementById("myHeader");
    const sticky = header.offsetTop;

        if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
}

function loggedInFeatures(data) {
    if (data.status) {
        document.getElementById('errormessage').innerHTML = data.message;
    } else {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('errormessage').innerHTML = '';
        localStorage.setItem('accessToken', data.accessToken);
        afterLogin();
    }
}
function afterLogin() {
    document.getElementById('main-nav-loggedIn').style.display = '';
    document.getElementById('songLists').style.display = '';
    document.getElementById('playLists').style.display = '';
    document.getElementById('iFooter').style.display = '';
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('main-nav-loggedOut').style.display = 'none';
    fetchMusic();
    fetchPlayList();
}
function notLogin() {
    document.getElementById('main-nav-loggedIn').style.display = 'none';
    document.getElementById('main-nav-loggedOut').style.display = '';
    document.getElementById('listDetail').innerHTML = 'Welcome to MIU Station';
}


function fetchMusic() {
    const server = `${SERVER_ROOT}/api/music`;
    fetch(server, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
        }
    })
        .then(response => response.json())
        .then(lists => { displayShowList(lists) });
}

function search() {
    const text = document.getElementById('search').value;
    let host = "";
    if (text == "") {
        host = "http://localhost:3000/api/music";
    } else {
        host = "http://localhost:3000/api/music?search=" + text;
    }

    console.log(host);

    fetch(host, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
        }
    })
        .then(response => response.json())
        .then(lists => { displayShowList(lists) });
}


function fetchPlayList() {
    const server = `${SERVER_ROOT}/api/playlist`;
    fetch(server, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
        }
    })
        .then(response => response.json())
        .then(lists => {
            displayPlayList(lists)
        });
}

function addToPlayList(row) {
    const songId = row.parentNode.parentNode.id;
    const server = `${SERVER_ROOT}/api/playlist/add`;

    fetch(server, {
        method: 'POST',
        body: JSON.stringify({
            songId
        }),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("accessToken"),
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(lists => { displayPlayList(lists) });

}

function removeSongInPlaylist(row) {
    const songId = row.parentNode.parentNode.id;
    const server = `${SERVER_ROOT}/api/playlist/remove`;
    fetch(server, {
        method: 'POST',
        body: JSON.stringify({
            songId
        }),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("accessToken"),
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(lists => { displayPlayList(lists) });
}

function displayShowList(lists) {
    let html = `
    <table class="tableLists" id="user-table">
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Release date</th>
            <th scope="col">Action</th>
        </tr>
    </thead>
    <tbody id="table-body">

`;
    let count = 0
    lists.forEach(song => {
        html += `
        <tr id="${song.id}">
            <th scope="row">${++count}</th>
            <td>${song.title}</td>
            <td>${song.releaseDate}</td>
            <td><button onclick='addToPlayList(this)' style='background:transparent;border: none;'><i class="fa fa-plus" style="font-size:24px; color: brown"></i></button></td>
        </tr>               
   `;
    });

    html += `
    </tbody>
</table>
`;
    document.getElementById('listDetail').innerHTML = html;
}
function displayPlayList(lists) {
    track_list = lists;
    let html = `
        <table class="tableLists" id="user-table">
        <thead>
            <tr>
                <th scope="col">Order</th>
                <th scope="col">Title</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody id="table-body">
        `;
    lists.forEach(song => {
        html += `
            <tr id="${song.songId}">
                <th scope="row">${song.orderId}</th>
                <td>${song.title}</td>
                <td>
                    <button onclick='removeSongInPlaylist(this)' style='background:transparent;border: none;'><i class="fa fa-close" style="font-size:24px;color:red"></i></button>
                    <button onclick='play(this)' style='background:transparent;border: none;'><i style="font-size:24px; color:brown" class="fa">&#xf04b;</i></button>
                </td>
            </tr>               
            `;
    });

    html += `
        </tbody>
        </table>
        `;
    document.getElementById('playDetail').innerHTML = html;

}



