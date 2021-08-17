const tableBodyCollege = document.getElementById("tableBodyCollege");
const tableBodyDistrict = document.getElementById("tableBodyDistrict");
const tableBodyUsers = document.getElementById("tableBodyUsers");

const submitted = document.getElementById("submitted");
const registered = document.getElementById("registered");
const pending = document.getElementById("pending");
const total = document.getElementById("total");
const gender = document.getElementById("gender");

const modal = new bootstrap.Modal(document.getElementById("exampleModalLong"), {});

function generateCollegeRow(rank, college, registrations, submissions)
{
    return (
        `<tr>
            <th scope="row">${rank ?? -1}</th>
            <td onClick="showCollege(this.innerText)">${college || "Unknown"}</td>
            <td>${registrations ?? 0}</td>
            <td>${submissions ?? 0}</td>
        </tr>`
    );
}

function generateDistrictRow(district, registrations)
{
    return (
        `<tr>
            <td>${district || "Unknown"}</td>
            <td>${registrations ?? 0}</td>
        </tr>`
    );
}

function generateUserRow(SlNo, name)
{
    return (
        `<tr>
            <td>${SlNo ?? -1}</td>
            <td>${name || "Unknown"}</td>
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
    data.colleges.forEach(({ college, count, submissions }) =>
        tableBodyCollege.innerHTML += generateCollegeRow(rank++, college, count, submissions));
}

async function getDistrictData(data) 
{
    tableBodyDistrict.innerHTML = "";
    Object.keys(data).forEach((key) => tableBodyDistrict.innerHTML += generateDistrictRow(key, data[key]));
}

async function getTotalData()
{
    const url = "https://us-central1-tinkerhub-api.cloudfunctions.net/getPookkalamStats";

    const data = await fetch(url).then(res => res.json());

    submitted.innerHTML = data.submissions;
    registered.innerText = data.done;
    pending.innerText = data.pending;
    gender.innerText = `${Number(100 * data.male / data.total).toFixed(0)}% / ${Number(data.female * 100 / data.total).toFixed(0)}%`;

    getDistrictData(data.districts);
}

async function showCollege(campus)
{
    if (!campus) return;

    const url = `https://us-central1-tinkerhub-api.cloudfunctions.net/getSubmissionsFromCampus/?campus=${campus}`;
    const data = await fetch(url).then(res => res.json());

    tableBodyUsers.innerHTML = "";
    let i = 0;

    modal.show();

    for (const email of data.usersMails)
    {
        const urlM = `https://mon.school/api/method/mon_school.api.get_contest_entry_of_user?contest=code-a-pookkalam&email=${email}`;
        const submission = await fetch(urlM)
            .then(res => res.json());

        const name = submission?.message?.entry?.author?.full_name;
        if (!name) return;

        tableBodyUsers.innerHTML += generateUserRow(++i, name);
    }
}

getTotalData();
getCampusData();

