![image](https://github.com/user-attachments/assets/3ba8fa22-4a94-4598-bda1-862b2b72b3f5)
# Pipelabs Full Stack Challenge Documentation

![Uploading screencapture-abc-fashion-k2c7-vercel-app-2024-09-22-10_41_39.png…]()


## Deployment Details

- **Frontend**: [https://abc-fashion-k2c7.vercel.app/](https://abc-fashion-k2c7.vercel.app/)
- **Backend**: [https://abc-fashion-production.up.railway.app/delayed-shipments](https://abc-fashion-production.up.railway.app/delayed-shipments)

> **Note**: This document provides a brief idea of the solution approach. The solution could be optimized after reviews.

---

## Solution Outline

### Problem Domain
- ABC Fashion faces delayed or missing shipments, which results in customer dissatisfaction.
- They need a system that monitors the shipment status in real-time and alerts them of any delays, allowing them to contact the customer with an update before the customer complains.

---

## Solution Approach

### Backend Component (NodeJS)
- Use the `/shipments` API endpoint provided to retrieve shipment data.
- Implement logic to filter shipments that are delayed based on the carrier and status.
- Use Cron jobs or background workers to regularly check for delays (e.g., every hour).
- Log shipments with issues and provide a summary of delays.
- For delayed shipments, utilize a notification service like **Twilio** or **SendGrid** to notify the customer. This notification can include coupon discounts or any form of gift value, ensuring customer satisfaction.
- Create an endpoint to export delayed shipments as a text file for backup or record-keeping purposes.

### Frontend Component (ReactJS)
- Create a dashboard that displays shipment statuses.
- Include filters to view delayed shipments or shipments with issues.
- Basic features:
  - Summary view: number of delayed, on-time, and delivered shipments.
  - Search functionality by customer name or tracking number.
  - Action buttons to trigger customer communication.

---

## Implementation Plan

### Backend (Node JS using TypeScript)
1. Set up a NodeJS Express server to connect to the provided API and retrieve shipment data.
2. Use **Axios** (or **Fetch**) to call the `/shipments` endpoint and process the paginated data.
3. Create logic to determine if a shipment is delayed (e.g., by calculating days in transit vs expected delivery).
4. Send periodic alerts (using tools like **Twilio** for SMS or email services) for delayed shipments.

### Frontend (React JS using TypeScript)
1. Create a simple dashboard using **React**.
2. Use **Material UI** or **Bootstrap** for a clean layout.
3. Display shipment statuses and add filtering options.
4. Integrate an API call to the backend to fetch updated shipment data.
5. Handle errors gracefully.

---

## Future Improvements
- Introduce **machine learning** to predict potential shipment delays based on carrier performance history.
- Implement **real-time notifications** to the admins regarding new delays.
- Provide customers with a **portal** where they can track and receive updates on their orders.
