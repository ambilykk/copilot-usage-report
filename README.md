# copilot-usage-report
Export the Copilot for Business seat assignments for an organization that are currently being billed

 Note: This Action uses the Copilot for Business API, which is in public Beta and subject to change

## PAT Token
Create a Fine-grained personal access tokens with 
        - Resource owner as Organization
        - read & write access to GitHub Copilot for Business under Organization permissions
Pass this token as an input to the action - GITHUB_TOKEN


## action in workflow

Include the copilot-usage-report action in your workflow. 

Following is the sample workflow

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
            csv_path: data/Copilot-Usage-Report.csv
        
        - name: Upload Copilot Usage Report
            uses: actions/upload-artifact@v3
            with:
            name: Copilot Usage Report
            path: data/Copilot-Usage-Report.csv      
```

## Parameters

| Name                           | Required  | Description                                                           |
|--------------------------------|------------|----------------------------------------------------------------------|
| GITHUB_TOKEN                 | Yes | PAT Token for access    |
| org_name                       | Yes | GitHub Organization Name                                      |
| csv_path                       | Yes | CSV file path                                   |

## Exported Fields
Following fields are included in the Copilot Usage Report
- User
- Created At
- Last Acivity At
- Last Acivity Editor
- Pending Cancellation Date

## Report
Copilot usage report is added as a build artifact in the workflow. You can download the report from the workflow run page.




# License

The scripts and documentation in this project are released under the [MIT License](./LICENSE)
