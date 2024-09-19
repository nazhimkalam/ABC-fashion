# ABC-fashion
This repo contains the source code including both the frontend &amp; backend for ABC fashion.

The frontend is hosted using Netlify & the backend is hosted using Railway

- Frontend: https://abc-fashion-2a3db.web.app
- Backend: https://abc-fashion-production.up.railway.app

![image](https://github.com/user-attachments/assets/cf2f80d2-d057-48f4-bc37-52fa965931dd)

# Solution Outline

## 1. Problem Understanding:
- ABC Fashion faces delayed or missing shipments and customers become unsatisfied.
- They need a system that monitors the shipment status in real-time and alerts them of any delays, allowing them to contact the customer with an update before the customer complains.

## 2. Basic Solution Approach:
### a. Backend Component (NodeJS):

- Use the /shipments API endpoint provided to retrieve shipment data.
- Implement logic to filter shipments that are delayed based on the carrier and status.
- Use cron jobs or background workers to regularly check for delays (e.g., every hour).
- Log shipments with issues and provide a summary of delays.

### b. Frontend Component (ReactJS):

- Create a dashboard that displays shipment statuses.
- Include filters to view delayed shipments or shipments with issues.

- Basic features:
    - Summary view: number of delayed, on-time, and delivered shipments.
    - Search by customer name or tracking number.
    - Action buttons to trigger customer communication.

## 3. Future Extensions:

- Add machine learning to predict potential shipment delays based on carrier performance history.
Implement real-time notifications to alert the admin of new delays.
Provide customers with a portal where they can track and receive updates on their orders.