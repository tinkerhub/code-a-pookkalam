const tableBodyCollege = document.getElementById("tableBodyCollege");
const tableBodyDistrict = document.getElementById("tableBodyDistrict");

const registered = document.getElementById("registered");
const pending = document.getElementById("pending");
const total = document.getElementById("total");
const gender = document.getElementById("gender");

function generateCollegeRow(rank, college, registrations)
{
    return (
        `<tr>
            <th scope="row">${rank}</th>
            <td>${college}</td>
            <td>${registrations}</td>
        </tr>`
    );
}

function generateDistrictRow(district, registrations)
{
    return (
        `<tr>
            <td>${district}</td>
            <td>${registrations}</td>
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
    data.colleges.forEach(({ college, count }) => tableBodyCollege.innerHTML += generateCollegeRow(rank++, college, count));
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

    registered.innerText = data.done;
    pending.innerText = data.pending;
    gender.innerText = `${Number(100 * data.male / data.total).toFixed(0)}% / ${Number(data.female * 100 / data.total).toFixed(0)}%`;

    getDistrictData(data.districts);
}

getTotalData();
getCampusData();

