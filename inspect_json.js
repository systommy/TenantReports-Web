
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('switchdatacenters.json', 'utf8'));

function inspect(label, obj) {
    console.log(`
--- ${label} ---
`);
    if (!obj) {
        console.log("Missing/Null");
        return;
    }
    console.log(JSON.stringify(obj, null, 2));
}

insp ect("TenantInfo.Summary", data.TenantInfo?.Summary);
