

import fs from 'fs';

const data = JSON.parse(fs.readFileSync('switchdatacenters.json', 'utf8'));

function inspect(label, arr) {
    console.log(`
--- ${label} ---`);
    if (!arr) {
        console.log("Missing/Null");
        return;
    }
    const items = Array.isArray(arr) ? arr : Object.values(arr);
    console.log(`Count: ${items.length}`);
    if (items.length > 0) {
        console.log("First Item:");
        console.log(JSON.stringify(items[0], null, 2));
    }
}

inspsect("Users.UserDetails", data.Users?.UserDetails);
