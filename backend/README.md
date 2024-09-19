
# Shipment Tracking Backend

This is a Node.js/Express backend service to monitor and track shipments. It checks for delayed shipments and provides functionality to alert customers, generate reports, and download shipment data as a text file.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [APIs](#apis)
    - [GET /delayed-shipments](#get-delayed-shipments)
    - [GET /download-delayed-shipments](#get-download-delayed-shipments)
5. [Cron Job](#cron-job)
6. [Error Handling](#error-handling)
7. [Technologies Used](#technologies-used)

## Project Structure

```bash

├── server.ts  # Main application logic
├── .env      # Environment variables
├── delayed_shipments.txt  # Output file for delayed shipments
├── package.json  # Dependencies and scripts
└── README.md     # Project documentation
```

## Installation

### Prerequisites
- Node.js v14+
- npm or yarn
- Create a `.env` file with necessary environment variables

### Steps

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables as described in the [Environment Variables](#environment-variables) section.

4. Start the server:
    ```bash
    npm start
    ```

## Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```bash
# .env file
PORT=5001
API_URL=<API_BASE_URL>
API_USERNAME=<API_USERNAME>
API_PASSWORD=<API_PASSWORD>
```

- `PORT`: The port on which the application will run.
- `API_URL`: The base URL of the shipment API.
- `API_USERNAME`: Username for API authentication.
- `API_PASSWORD`: Password for API authentication.

## APIs

### GET /delayed-shipments

**Description**: Fetches all shipments from the API and filters out delayed shipments.

**Request**:
```bash
GET /delayed-shipments
```

**Response** (200 OK):
```json
{
  "delayedShipments": [
    {
      "id": "123",
      "start": "2023-09-10",
      "carrier": "DHL",
      "status": "in-transit",
      "customer": {
        "name": "John Doe",
        "address": "123 Street",
        "city": "New York",
        "country": "USA",
        "lat": 40.7128,
        "long": -74.0060
      },
      "end": "2023-09-15"
    }
  ]
}
```

**Errors**:
- 500: If there is an error in fetching shipments.

### GET /download-delayed-shipments

**Description**: Fetches delayed shipments and generates a downloadable text file with shipment information.

**Request**:
```bash
GET /download-delayed-shipments
```

**Response** (200 OK): Triggers download of `delayed_shipments.txt`.

**Errors**:
- 500: If there is an error in generating the file.
- 404: If no delayed shipments are found.

## Cron Job

A cron job is scheduled to run every minute to check for delayed shipments. It logs delayed shipments to the console and can be extended to send notifications to customers or admins.

```javascript
const job = new CronJob('* * * * *', () => {
  console.log('Running cron job to check for delayed shipments...');
  fetchDelayedShipments().then((delayedShipments) => {
    if (delayedShipments && delayedShipments.length > 0) {
      console.log('Delayed Shipments:', delayedShipments);
      // Implement notification logic here (e.g., email, SMS, etc.)
    } else {
      console.log('No delayed shipments at this time.');
    }
  });
});
```

## Error Handling

- **Fetching Shipments**: If there's an issue with the shipment API or credentials, an error is logged and a 500 response is sent.
- **File Download**: If there are no delayed shipments or file generation fails, appropriate error messages are returned with status codes.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Framework to handle API requests.
- **axios**: For making HTTP requests to the shipment API.
- **cron**: For scheduling regular tasks to check for delayed shipments.
- **dotenv**: To manage environment variables.
- **fs**: File system operations to generate shipment reports.
- **cors**: To enable cross-origin requests.

## License

This project is licensed under the MIT License.
