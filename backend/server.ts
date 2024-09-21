import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { CronJob } from "cron";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const API_URL = process.env.API_URL || "";
const auth = {
  username: process.env.API_USERNAME || "",
  password: process.env.API_PASSWORD || "",
};

interface Customer {
  name: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  long: number;
}

interface Shipment {
  id: string;
  start: string;
  carrier: string;
  status: string;
  customer: Customer;
  end?: string;
}

interface DashboardStats {
  totalInTransit: number;
  totalFailedDelivery: number;
  totalOutForDelivery: number;
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Function to check if a shipment is delayed based on sample data
const isDelayed = (shipment: Shipment): boolean => {
  const startDate = new Date(shipment.start);
  const endDate = shipment.end ? new Date(shipment.end) : new Date();

  const diffDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check if the shipment status is not delivered or if it took more than 7 days
  return shipment.status !== "delivered";
};

const getDashboardStats = async (
  shipmentList: Shipment[]
): Promise<DashboardStats> => {
  let totalInTransit = 0;
  let totalFailedDelivery = 0;
  let totalOutForDelivery = 0;

  shipmentList.forEach((shipment) => {
    switch (shipment.status) {
      case "in_transit":
        totalInTransit++;
        break;

      case "failed_delivery":
        totalFailedDelivery++;
        break;

      case "out_for_delivery":
        totalOutForDelivery++;
        break;

      default:
        break;
    }
  });

  return {
    totalInTransit,
    totalFailedDelivery,
    totalOutForDelivery,
  } as DashboardStats;
};

// Function to fetch delayed shipments
const fetchDelayedShipments = async (): Promise<
  { delayedShipments: Shipment[]; dashboardStats: DashboardStats } | undefined
> => {
  try {
    const response = await axios.get(API_URL, { auth });
    const shipments: Shipment[] = response.data.data;

    const delayedShipments: Shipment[] = shipments.filter(isDelayed);
    const dashboardStats: DashboardStats = await getDashboardStats(
      delayedShipments
    );

    return { delayedShipments, dashboardStats };
  } catch (error) {
    console.error("Error fetching shipments:", error);

    return undefined;
  }
};

// Schedule a cron job to run every minute
// Cron Job Schedule: * * * * *
// *     *     *     *     *
// |     |     |     |     |
// |     |     |     |     |
// |     |     |     |     +--- Day of the Week (0 - 6) (0 is Sunday, 6 is Saturday)
// |     |     |     +--------- Month (1 - 12)
// |     |     +--------------- Day of the Month (1 - 31)
// |     +--------------------- Hour (0 - 23)
// +--------------------------- Minute (0 - 59)
//
// In this case: "* * * * *" means the job will run every minute of every hour,
// of every day, of every month, and every day of the week.

const job = new CronJob("* * * * *", () => {
  console.log("Running cron job to check for delayed shipments...");

  fetchDelayedShipments().then((response) => {
    if (response && response.delayedShipments.length > 0) {
      console.log("Delayed Shipments:", response.delayedShipments);
      // Here, send email or SMS alerts to notify customers or admin
      // e.g., using Twilio, SendGrid, or another notification service

      // here we can decide on giving a discount,
      // or any sort of offer to make the customer happy
    } else {
      console.log("No delayed shipments at this time.");
    }
  });
});

job.start();

// Function to generate a text file of delayed shipments
const generateDelayedShipmentsFile = (delayedShipments: Shipment[]): string => {
  let fileContent = "Delayed Shipments List:\n\n";

  delayedShipments.forEach((shipment, index) => {
    fileContent += `Shipment ${index + 1}:\n`;
    fileContent += `Customer Name: ${shipment.customer.name}\n`;
    fileContent += `Address: ${shipment.customer.address}, ${shipment.customer.city}, ${shipment.customer.country}\n`;
    fileContent += `Carrier: ${shipment.carrier}\n`;
    fileContent += `Status: ${shipment.status}\n`;

    fileContent += `Start Date: ${new Date(
      shipment.start
    ).toLocaleDateString()}\n`;

    fileContent += `Expected Delivery Date: ${
      shipment.end ? new Date(shipment.end).toLocaleDateString() : "N/A"
    }\n\n`;
  });

  const filePath = path.join(__dirname, "delayed_shipments.txt");
  fs.writeFileSync(filePath, fileContent);
  return filePath;
};

// API endpoint to manually trigger shipment fetching (for testing purposes)
app.get("/delayed-shipments", async (req: Request, res: Response) => {
  try {
    const response = await fetchDelayedShipments();

    res.json(response);
  } catch (error) {
    console.error("Error fetching shipments:", error);

    res.status(500).send("Error fetching shipments");
  }
});

// API endpoint to download delayed shipments as a text file
app.get("/download-delayed-shipments", async (req: Request, res: Response) => {
  try {
    const delayedShipments: Shipment[] | undefined =
      await fetchDelayedShipments().then(
        (response) => response?.delayedShipments
      );

    if (delayedShipments && delayedShipments.length > 0) {
      const filePath = generateDelayedShipmentsFile(delayedShipments);

      res.download(filePath, "delayed_shipments.txt", (err) => {
        if (err) {
          console.error("Error downloading file:", err);

          res.status(500).send("Error downloading file");
        }
      });
    } else {
      res.status(404).send("No delayed shipments available for download.");
    }
  } catch (error) {
    console.error("Error generating shipment file:", error);

    res.status(500).send("Error generating shipment file");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
