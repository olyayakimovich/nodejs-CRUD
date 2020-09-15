# IN MEMORY CRUD REST SERVICE WITH VALIDATION

[Home task 3](https://epam.sharepoint.com/sites/EPAMNode.jsGlobalMentoringProgram/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FEPAMNode%2EjsGlobalMentoringProgram%2FShared%20Documents%2FGeneral%2FHomework%2FModule%203%2FHomework%203%2Epdf&parent=%2Fsites%2FEPAMNode%2EjsGlobalMentoringProgram%2FShared%20Documents%2FGeneral%2FHomework%2FModule%203&p=true&originalPath=aHR0cHM6Ly9lcGFtLnNoYXJlcG9pbnQuY29tLzpiOi9zL0VQQU1Ob2RlLmpzR2xvYmFsTWVudG9yaW5nUHJvZ3JhbS9FVmZWRVl4VVhxMUZ1NXFYcW9YTnFxTUJqQXczYzZPRXNPUU9IU3Zta3NUUlpBP3J0aW1lPVo5QkY5UHhTMkVn)

[Home task 4](https://epam.sharepoint.com/sites/EPAMNode.jsGlobalMentoringProgram/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FEPAMNode%2EjsGlobalMentoringProgram%2FShared%20Documents%2FGeneral%2FHomework%2FModule%204%2FHomework%204%2Epdf&parent=%2Fsites%2FEPAMNode%2EjsGlobalMentoringProgram%2FShared%20Documents%2FGeneral%2FHomework%2FModule%204&p=true&originalPath=aHR0cHM6Ly9lcGFtLnNoYXJlcG9pbnQuY29tLzpiOi9zL0VQQU1Ob2RlLmpzR2xvYmFsTWVudG9yaW5nUHJvZ3JhbS9FWm51bTBEeGhOTkdzRmVXVnNWQy1tY0I2alhveVA1cHVCOGpOOEQ0YWk4MG1BP3J0aW1lPWtIVndySDVWMkVn)

#### To start application run:

1. npm install
2. npm run start

#### The following routes for user are implemented:

- create user: POST to /users
- update user: PUT to /users/:id
- get user by id: GET to /users/:id
- delete user by id: DELETE to /users/:id
- get autosuggested users: GET to /users?login=${logingsubstring}&limit=${limit}
- add users to group: POST to /users/addGroup

#### User's validation for POST and PUT requests:

**login**: string (min length 3, max length 30)

**password**: string (min length 6, max length 26, at least one letter, at least one number)

**age**: number (from 4 to 130)

#### The following routes for group are implemented:

- create group: POST to /groups
- update group: PUT to /groups/:id
- get group by id: GET to /groups/:id
- get all groups: GET to /groups
- delete group by id: DELETE to /groups/:id
