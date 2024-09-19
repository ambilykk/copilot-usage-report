// libs for github & graphql
const core = require('@actions/core');
const github = require('@actions/github');
const { parse } = require('json2csv');

// libs for csv file creation
const { dirname } = require("path");
const makeDir = require("make-dir");
const fs = require('fs');

// get the octokit handle 
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(GITHUB_TOKEN);

// inputs defined in action metadata file
const org_Name = core.getInput('org_name');
const file_path = core.getInput('file_path');

let totalSeats = 0;

// Our CSV output fields
const fields = [
    {
        label: 'User',
        value: 'assignee.login'
    },
    {
        label: 'Created At',
        value: 'created_at'
    },
    {
        label: 'Updated At',
        value: 'updated_at'
    },
    {
        label: 'Last Activity At',
        value: 'last_activity_at'
    },
    {
        label: 'Last Activity Editor',
        value: 'last_activity_editor'
    },
    {
        label: 'Pending Cancellation Date',
        value: 'pending_cancellation_date'
    },
    {
        label: 'Team',
        value: 'assigning_team.name'
    }
];

// Copilot User Management API call
async function getUsage(org, pageNo) {
    try {

        return await octokit.request('GET /orgs/{org}/copilot/billing/seats', {
            org: org_Name,
            page: pageNo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Extract Copilot usage data with a pagination of 50 records per page
async function run(org_Name, file_path) {

    let addTitleRow = true;
    let pageNo = 1;
    let remainingRecs = 0;

    try {
        await makeDir(dirname(file_path));
        //delete the file, if exists
        if (fs.existsSync(file_path)) {
            fs.unlinkSync(file_path);
        }
        do {
            // invoke the graphql query execution
            await getUsage(org_Name, pageNo).then(usageResult => {
                let seatsData = usageResult.data.seats;

                if (addTitleRow) {
                    totalSeats = usageResult.data.total_seats;
                    console.log('Seat Count ' + totalSeats);
                    remainingRecs = totalSeats;
                }

                // check whether the file extension is csv or not
                if (file_path.endsWith('.csv')) {

                    // ALERT! - create our updated opts
                    const opts = { fields, "header": addTitleRow };

                    // append to the existing file (or create and append if needed)
                    fs.appendFileSync(file_path, `${parse(seatsData, opts)}\n`);
                } else {
                    // Export to JSON file
                    //check the file exists or not 
                    if (!fs.existsSync(file_path)) {
                        // The file doesn't exist, create a new one with an empty JSON object
                        fs.writeFileSync(file_path, JSON.stringify([], null, 2));
                    }

                    //check the file is empty or not
                    let data = fs.readFileSync(file_path, 'utf8'); // read the file

                    // file contains only [] indicating a blank file
                    // append the entire data to the file
                    if (data.trim() === '[]') {
                        console.log("The JSON data array is empty.");
                        fs.writeFileSync(file_path, JSON.stringify(seatsData, null, 2));
                    } else {
                        //TODO: find the delta and append to existung file
                        let jsonData = JSON.parse(data); // parse the JSON data into a JavaScript array
                        jsonData = jsonData.concat(seatsData);
                        fs.writeFileSync(file_path, JSON.stringify(jsonData, null, 2));
                    }
                }
                // pagination to get next page data
                remainingRecs = remainingRecs - seatsData.length;
                console.log('Remaining Records ' + remainingRecs);
                if (remainingRecs > 0) {
                    pageNo = pageNo + 1;
                    addTitleRow = false;
                }
            });
        } while (remainingRecs > 0);
    } catch (error) {
        core.setFailed(error.message);
    }
}

console.log(`preamble: org name: ${org_Name} `);

// run the action code
run(org_Name, file_path);
