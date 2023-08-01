// libs for github & graphql
const core = require('@actions/core');
const github = require('@actions/github');
const { parse } = require('json2csv');

// libs for csv file creation
const { dirname } = require("path");
const makeDir = require("make-dir");

// get the octokit handle 
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(GITHUB_TOKEN);

// inputs defined in action metadata file
const org_Name = core.getInput('org_name');
const csv_path = core.getInput('csv_path');

let totalSeats = 0;

// Our CSV output fields
const fields = [
{
    label: 'User',
    value: 'assignee.login'
},
{
    label: 'Last Acivity At',
    value: 'last_activity_at'
},
{
    label: 'Last Acivity Editor',
    value: 'last_activity_editor'
},
{
    label: 'Pending Cancellation Date',
    value: 'pending_cancellation_date'
}
];

// Copilot User Management API call
async function getUsage(org) {
    try {

        return await octokit.request('GET /orgs/{org}/copilot/billing/seats', {
            org: org_Name,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Extract vulnerability alerts with a pagination of 50 alerts per page
async function run(org_Name, csv_path) {

    let addTitleRow = true;

    try {
        await makeDir(dirname(csv_path));

        // invoke the graphql query execution
        await getUsage(org_Name).then(usageResult => {           
            let seatsData = JSON.stringify(JSON.stringify(usageResult).data).seats;
           
            if (addTitleRow) {
                totalSeats = JSON.stringify(JSON.stringify(usageResult).data).total_seats;
                console.log('Seat Count ' + totalSeats);
            }

            // ALERT! - create our updated opts
            const opts = { fields, "header": addTitleRow };

            // append to the existing file (or create and append if needed)
            require("fs").appendFileSync(csv_path, `${parse(seatsData, opts)}\n`);

        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

console.log(`preamble: org name: ${org_Name} `);

// run the action code
run(org_Name, csv_path);
