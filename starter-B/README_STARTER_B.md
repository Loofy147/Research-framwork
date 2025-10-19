# Starter B: Paper-Trading API

This project provides a simple REST API to trigger trading strategy backtests, simulating a paper-trading environment. It acts as a job runner for the backtest engine in `starter-A`.

## How to Run

1.  **Install dependencies:**
    ```bash
    npm ci
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The API will be available at `http://localhost:3000`.

## API Endpoints

### `POST /run-strategy`

Triggers a new backtest job.

**Request Body:**
```json
{
  "config": "../starter-A/configs/technical-backtest.yaml"
}
```
-   `config`: The relative path to the backtest configuration file.

**Response:**
```json
{
  "jobId": "job_1678886400000"
}
```

### `GET /job/:id`

Retrieves the status of a job.

**Response (Running):**
```json
{
  "id": "job_1678886400000",
  "status": "running"
}
```

**Response (Completed):**
```json
{
  "id": "job_1678886400000",
  "status": "completed",
  "resultPath": "/path/to/your/project/starter-A/output/summary.md"
}
```

## How It Works

The Express server listens for POST requests to `/run-strategy`. When a request is received, it spawns a new child process to execute the backtest script from `starter-A`. It stores the job status in memory and provides an endpoint to check on the job's progress.