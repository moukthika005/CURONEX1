# Ilp2.0

## Project Structure

- `dashboard.html` -> dashboard overview
- `registration.html` -> add new resources
- `resource-availability.html` -> search, filter, and delete registered resources
- `transfer-request.html` -> create transfer requests and filter them by request ID/date
- `movement-tracking.html` -> track transfer status and click rows to advance status

## Asset Layout

- `assets/css/` -> all page styles
- `assets/js/` -> all page scripts
- `assets/images/` -> shared images and logo

## Data Flow

- Resources are stored in browser `localStorage` under `curonexResources`.
- Transfer requests are stored in browser `localStorage` under `curonexTransfers`.
- Movement tracking reads from the saved transfer requests, so only posted requests circulate through the tracking view.