import express, { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());

interface Job {
    id: string;
    status: 'running' | 'completed' | 'failed';
    resultPath?: string;
}

const jobs: Map<string, Job> = new Map();

app.post('/run-strategy', (req: Request, res: Response) => {
    const { config } = req.body;
    if (!config) {
        return res.status(400).json({ error: 'Config path is required.' });
    }

    const jobId = `job_${Date.now()}`;
    jobs.set(jobId, { id: jobId, status: 'running' });

    const configPath = path.resolve(process.cwd(), config);
    if (!fs.existsSync(configPath)) {
        jobs.set(jobId, { id: jobId, status: 'failed' });
        return res.status(404).json({ error: 'Config file not found.' });
    }

    // Note: Assumes starter-A is in a sibling directory
    const backtestProcess = spawn('npm', ['run', 'backtest', '--', `--config=${configPath}`], {
        cwd: path.resolve(process.cwd(), '../starter-A'),
        shell: true,
        stdio: 'pipe'
    });

    backtestProcess.stdout.on('data', (data) => {
        console.log(`[Job ${jobId}] stdout: ${data}`);
    });

    backtestProcess.stderr.on('data', (data) => {
        console.error(`[Job ${jobId}] stderr: ${data}`);
    });

    backtestProcess.on('close', (code) => {
        if (code === 0) {
            const resultPath = path.resolve(process.cwd(), '../starter-A/output/summary.md');
            jobs.set(jobId, { id: jobId, status: 'completed', resultPath });
            console.log(`[Job ${jobId}] completed successfully.`);
        } else {
            jobs.set(jobId, { id: jobId, status: 'failed' });
            console.error(`[Job ${jobId}] failed with code ${code}.`);
        }
    });

    res.status(202).json({ jobId });
});

app.get('/job/:id', (req: Request, res: Response) => {
    const job = jobs.get(req.params.id);
    if (!job) {
        return res.status(404).json({ error: 'Job not found.' });
    }
    res.json(job);
});

app.listen(port, () => {
    console.log(`Paper-trading API listening at http://localhost:${port}`);
});