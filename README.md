# Copilot Usage Report
Export the Copilot for Business seat assignments for an organization that are currently being billed

> Note: **1-Aug-2023** This Action uses the Copilot for Business API, which is in public Beta and subject to change

## PAT Token
Create a Fine-grained personal access tokens with 
       
  - **Resource owner** as Organization
  - **read & write** access to **GitHub Copilot for Business** under _Organization permissions_
        ![Screenshot 2023-08-01 at 4 09 43 PM](https://github.com/ambilykk/copilot-usage-report/assets/10282550/543d34a0-c0ab-40c7-a192-a2b7ab0fcd7c)

Pass this token as an input to the action - GITHUB_TOKEN


## Action in workflow

Include the copilot-usage-report action in your workflow. 

**1. Sample workflow 1: Export to CSV**

```
    name: Copilot Usage Report export to CSV 

    on:
      workflow_dispatch:

    jobs:
      first-job:
        runs-on: ubuntu-latest
        
        steps:
        - name: Copilot usage
            uses: ambilykk/copilot-usage-report@main
            with:        
            GITHUB_TOKEN: ${{secrets.ORG_TOKEN}}
            org_name: 'octodemo'
            file_path: data/Copilot-Usage-Report.csv
        
        - name: Upload Copilot Usage Report
            uses: actions/upload-artifact@v3
            with:
            name: Copilot Usage Report
            path: data/Copilot-Usage-Report.csv      
```

**1. Sample workflow 2: Export to JSON**

```
    name: Copilot Usage Report export to JSON

    on:
      workflow_dispatch:

    jobs:
      first-job:
        runs-on: ubuntu-latest
        
        steps:
        - name: Copilot usage
            uses: ambilykk/copilot-usage-report@main
            with:        
            GITHUB_TOKEN: ${{secrets.ORG_TOKEN}}
            org_name: 'octodemo'
            file_path: data/Copilot-Usage-Report.json
        
        - name: Upload Copilot Usage Report
            uses: actions/upload-artifact@v3
            with:
            name: Copilot Usage Report
            path: data/Copilot-Usage-Report.json      
```

## Parameters

| Name                           | Required  | Description                                                           |
|--------------------------------|------------|----------------------------------------------------------------------|
| GITHUB_TOKEN                 | Yes | PAT Token for access    |
| org_name                       | Yes | GitHub Organization Name                                      |
| file_path                       | Yes | CSV or JSON file path                                   |

## Exported Fields
Following fields are included in the Copilot Usage Report
- User
- Created At
- Updated At
- Last Activity At
- Last Activity Editor
- Pending Cancellation Date
- Team

## Report
Copilot usage report is added as a build artifact in the workflow. You can download the report from the workflow run page.

![Screenshot 2023-08-01 at 4 14 10 PM](https://github.com/ambilykk/copilot-usage-report/assets/10282550/7fef1ea7-5bf8-4ba8-b5d7-95396d08693b)


# License

The scripts and documentation in this project are released under the [MIT License](./LICENSE)
