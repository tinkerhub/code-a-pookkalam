const tableBodyCollege = document.getElementById("tableBodyCollege");
const tableBodyDistrict = document.getElementById("tableBodyDistrict");
const tableBodyUsers = document.getElementById("tableBodyUsers");

const submitted = document.getElementById("submitted");
const registered = document.getElementById("registered");
const pending = document.getElementById("pending");
const total = document.getElementById("total");
const gender = document.getElementById("gender");

const modal = new bootstrap.Modal(document.getElementById("exampleModalLong"), {});

const cachedCampuses = {};

function generateCollegeRow(rank, college, submissions)
{
    return (
        `<tr>
            <th scope="row">${rank ?? -1}</th>
            <td onClick="showCollege(this.innerText)">${college || "Unknown"}</td>
            <td>${submissions ?? 0}</td>
        </tr>`
    );
}

function generateDistrictRow(rank, district, registrations)
{
    return (
        `<tr>
            <th scope="row">${rank ?? -1}</th>
            <td>${district || "Unknown"}</td>
            <td>${registrations ?? 0}</td>
        </tr>`
    );
}

function generateUserRow(SlNo, name, image_s, image_l)
{
    return (
        `<tr>
            <td>${SlNo ?? -1}</td>
            <td><a href="${image_l}"><img src="${image_s}" width="24px"></img></a>${name || "Unknown"}</td>
        </tr>`
    );
}


async function getCampusData()
{
    const url = "https://us-central1-tinkerhub-api.cloudfunctions.net/getCampusStats";
    //const url = "http://localhost:5001/tinkerhub-api/us-central1/getCampusStats";

    const data = await fetch(url).then(res => res.json());

    let rank = 1;

    tableBodyCollege.innerHTML = "";
    data.colleges
        .sort((a, b) => (a.submissions ?? -1) < (b.submissions ?? -1) ? 1 : -1)
        .forEach(({ college, submissions }) =>
        tableBodyCollege.innerHTML += generateCollegeRow(rank++, college, submissions));
}

async function getDistrictData(data) 
{
    let i = 1;

    tableBodyDistrict.innerHTML = "";
    Object.keys(data)
        .sort((a, b) => data[a] < data[b] ? 1 : -1)
        .forEach((key) => tableBodyDistrict.innerHTML += generateDistrictRow(i++, key, data[key]));
}

async function getTotalData()
{
    const url = "https://us-central1-tinkerhub-api.cloudfunctions.net/getPookkalamStats";

    const data = await fetch(url).then(res => res.json());

    total.innerHTML = data.total;
    submitted.innerHTML = data.submissions;
    registered.innerText = data.done;
    pending.innerText = data.pending;
    gender.innerText = `${Number(100 * data.male / data.total).toFixed(0)}% / ${Number(data.female * 100 / data.total).toFixed(0)}% / ${Number(data.non_binary * 100 / data.total).toFixed(0)}%`;

    getDistrictData(data.districts);
}

async function showCollege(campus)
{
    if (!campus) return;

    window.location.href = `#${campus}`;

    tableBodyUsers.innerHTML = "";
    modal.show();

    if (cachedCampuses[campus])
        return tableBodyUsers.innerHTML = cachedCampuses[campus];

    const url = `https://us-central1-tinkerhub-api.cloudfunctions.net/getSubmissionsFromCampus/?campus=${campus}`;
    const data = await fetch(url).then(res => res.json());

    let i = 0;

    tableBodyUsers.innerHTML = "";
    for (const user of data.users)
        tableBodyUsers.innerHTML += generateUserRow(++i, user.name,user.small,user.medium);

    cachedCampuses[campus] = tableBodyUsers.innerHTML;
}

window.addEventListener('hashchange', (event) =>
{
    if (location.href.split("#").length > 1)
        showCollege(location.href.split("#")[1]);
    else
        modal.hide();
});

getTotalData();
getCampusData();

if (location.href.split("#").length > 1)
    showCollege(location.href.split("#")[1]);

