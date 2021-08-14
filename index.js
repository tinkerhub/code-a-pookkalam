const tableBody = document.getElementById("tableBody");
const registered = document.getElementById("registered");
const pending = document.getElementById("pending");
const total = document.getElementById("total");

function generateRow(rank, college, registrations)
{
    return (
        `<tr>
            <th scope="row">${rank}</th>
            <td>${college}</td>
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

    tableBody.innerHTML = "";
    data.colleges.forEach(({ college, count }) => tableBody.innerHTML += generateRow(rank++, college, count));
}

async function getTotalData()
{
    const url = "https://us-central1-tinkerhub-api.cloudfunctions.net/getPookkalamStats";

    const data = await fetch(url).then(res => res.json());

    total.innerText = data.total;
    registered.innerText = data.done;
    pending.innerText = data.pending;
}

getTotalData();
getCampusData();

