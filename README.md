Task Management System (TMS) - README
This directory contains the backend code for the Task Management System challenge.

Prerequisites
Node.js and npm (or yarn) installed on your system.
A MongoDB database instance running locally or remotely.
Installation
Clone this repository:

Bash
git clone https://github.com/yonatan12121/TMS.git
Use code with caution.
content_copy
Navigate to the tms directory:

Bash
cd TMS/tms
Use code with caution.
content_copy
Install dependencies:

Bash
npm install

Use code with caution.
content_copy
Setting Up Database Connection
1. MongoDB Configuration:

Update the config.js file with your MongoDB connection details:

MONGODB_URI: The connection string for your MongoDB database.
Running the Application
Start the development server:

Bash
npm run dev
Use code with caution.
content_copy
This will start the TMS server on a default port (usually 5000). You can access the TMS API endpoints using tools like Postman or curl.

Note: Remember to configure environment variables for sensitive information before running.

API Documentation
Detailed API documentation for TMS is available in the ./api folder. This folder contains OpenAPI (Swagger) specifications describing the TMS API endpoints, request/response formats, and authentication requirements.
