const BASE_API_URL = "https://localhost:8000/v1";

async function httpGetPlanets() {
    const response = await fetch(`${BASE_API_URL}/planets`);
    const data = await response.json();
    return data;
}

async function httpGetLaunches() {
    const response = await fetch(`${BASE_API_URL}/launches`);
    const data = await response.json();
    return data.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
    try {
        const response = await fetch(`${BASE_API_URL}/launches`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(launch),
        });
        return response;
    } catch (error) {
        return { ok: false };
    }
}

async function httpAbortLaunch(id) {
    try {
        const response = await fetch(`${BASE_API_URL}/launches/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        return { ok: false };
    }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
