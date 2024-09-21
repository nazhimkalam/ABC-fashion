import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Grid2,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatShipmentStatus } from "./helper";

// Define the structure of the shipment data we expect from the API
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
  end: string;
}

interface DashboardStats {
  totalInTransit: number;
  totalFailedDelivery: number;
  totalOutForDelivery: number;
}

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const Dashboard = () => {
  // Define the state using the Shipment type
  const [delayedShipments, setDelayedShipments] = useState<Shipment[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>();

  const [error, setError] = useState<string | null>(null); // For error messages
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility state

  const apiUrl = "https://abc-fashion-production.up.railway.app";
  // const apiUrl = "http://localhost:5001";/

  useEffect(() => {
    // Fetch delayed shipments from the backend
    axios
      .get<{ delayedShipments: Shipment[]; dashboardStats: DashboardStats }>(
        `${apiUrl}/delayed-shipments`
      )
      .then((response) => {
        setDelayedShipments(response.data.delayedShipments);
        setDashboardStats(response.data.dashboardStats);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching delayed shipments:", error);
        setError("Failed to fetch delayed shipments");
        setOpenSnackbar(true);
        setLoading(false);
      });
  }, []);

  // Function to notify an individual customer
  const notifyCustomer = async (customerId: string) => {
    try {
      // API to notify the customer
      // await axios.post(`${apiUrl}/notify-customer/${customerId}`);

      alert("Notification sent to customer!");
    } catch (error) {
      console.error("Error notifying customer:", error);

      setError("Failed to notify customer");
      setOpenSnackbar(true);
    }
  };

  // Function to notify all customers
  const notifyAll = async () => {
    try {
      // API call to notify all customers
      // await axios.post(`${apiUrl}/notify-all`);

      alert("Notifications sent to all customers!");
    } catch (error) {
      console.error("Error notifying all customers:", error);

      setError("Failed to notify all customers");
      setOpenSnackbar(true);
    }
  };

  // Handle Snackbar close event
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div style={{ padding: 20, margin: 60 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        mb={5}
        textAlign="center"
      >
        ABC Shipment Dashboard
      </Typography>

      {/* Dashboard Statistics Cards */}
      {true && (
        <Grid container spacing={3} mb={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: "#f5f5f5",
                textAlign: "center",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  In Transit
                </Typography>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {dashboardStats?.totalInTransit}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: "#f5f5f5",
                textAlign: "center",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  Failed Delivery
                </Typography>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {dashboardStats?.totalFailedDelivery}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: "#f5f5f5",
                textAlign: "center",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  Out for delivery
                </Typography>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {dashboardStats?.totalOutForDelivery}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" component="h2">
          Delayed Shipments
        </Typography>
        <Button variant="contained" color="secondary" onClick={notifyAll}>
          Notify All
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="shipment table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Customer Name</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Carrier</StyledTableCell>
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>Expected Delivery Date</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {delayedShipments.map((shipment) => (
                <StyledTableRow key={shipment.id}>
                  <TableCell>{shipment.customer.name}</TableCell>
                  <TableCell>{formatShipmentStatus(shipment.status)}</TableCell>
                  <TableCell>{shipment.carrier}</TableCell>
                  <TableCell>
                    {new Date(shipment.start).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(shipment.end).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => notifyCustomer(shipment.id)}
                    >
                      Notify
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
