import type { Job, Project } from "./types"

export const projects: Project[] = [
  {
    id: "proj_1",
    name: "Video Processing Pipeline",
    description: "Processes uploaded videos for transcription and analysis.",
    jobCount: 3,
  },
  {
    id: "proj_2",
    name: "Daily Data Sync",
    description: "Syncs data from external APIs to our database.",
    jobCount: 1,
  },
]

export const jobs: Job[] = [
  {
    id: "job_1",
    projectId: "proj_1",
    name: "transcribe-video-123.mp4",
    status: "completed",
    totalDuration: 18500,
    createdAt: "2023-10-26T10:00:00Z",
    logs: [
      {
        id: "log_1_1",
        name: "transcribe-video",
        type: "task",
        status: "completed",
        startTime: 0,
        duration: 18500,
        children: [
          {
            id: "log_1_1_1",
            name: "Attempt 1",
            type: "attempt",
            status: "completed",
            startTime: 100,
            duration: 18400,
            children: [
              {
                id: "log_1_1_1_1",
                name: "extract-audio",
                type: "task",
                status: "completed",
                startTime: 200,
                duration: 11800,
                children: [
                  {
                    id: "log_1_1_1_1_1",
                    name: "Attempt 1",
                    type: "attempt",
                    status: "completed",
                    startTime: 300,
                    duration: 11700,
                    children: [
                      {
                        id: "log_1_1_1_1_1_1",
                        name: "Fetch video from URL",
                        type: "info",
                        status: "completed",
                        startTime: 1000,
                        duration: 0,
                      },
                      {
                        id: "log_1_1_1_1_1_2",
                        name: "Extract audio using FFmpeg",
                        type: "log",
                        status: "completed",
                        startTime: 1100,
                        duration: 5000,
                      },
                    ],
                  },
                ],
              },
              {
                id: "log_1_1_1_2",
                name: "transcribe-audio",
                type: "task",
                status: "completed",
                startTime: 6500,
                duration: 12000,
                children: [
                  {
                    id: "log_1_1_1_2_1",
                    name: "Attempt 1",
                    type: "attempt",
                    status: "completed",
                    startTime: 6600,
                    duration: 11900,
                    children: [
                      {
                        id: "log_1_1_1_2_1_1",
                        name: "transcribe.audio()",
                        type: "log",
                        status: "completed",
                        startTime: 7000,
                        duration: 4000,
                      },
                      {
                        id: "log_1_1_1_2_1_2",
                        name: "Audio summary created",
                        type: "info",
                        status: "completed",
                        startTime: 12000,
                        duration: 0,
                      },
                    ],
                  },
                ],
              },
              {
                id: "log_1_1_1_3",
                name: "upload-to-s3",
                type: "task",
                status: "completed",
                startTime: 13000,
                duration: 5500,
                children: [
                  {
                    id: "log_1_1_1_3_1",
                    name: "Attempt 1",
                    type: "attempt",
                    status: "completed",
                    startTime: 13100,
                    duration: 5400,
                    children: [
                      {
                        id: "log_1_1_1_3_1_1",
                        name: "s3.upload()",
                        type: "success",
                        status: "completed",
                        startTime: 15000,
                        duration: 2000,
                      },
                      {
                        id: "log_1_1_1_3_1_2",
                        name: "Transcribed audio file upload",
                        type: "info",
                        status: "completed",
                        startTime: 17500,
                        duration: 0,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "job_2",
    projectId: "proj_1",
    name: "summarize-text-doc.txt",
    status: "failed",
    totalDuration: 9200,
    createdAt: "2023-10-26T11:30:00Z",
    logs: [
      {
        id: "log_2_1",
        name: "summarize-text",
        type: "task",
        status: "failed",
        startTime: 0,
        duration: 9200,
        children: [
          {
            id: "log_2_1_1",
            name: "Attempt 1",
            type: "attempt",
            status: "failed",
            startTime: 100,
            duration: 4000,
            children: [
              {
                id: "log_2_1_1_1",
                name: "Download text file",
                type: "success",
                status: "completed",
                startTime: 200,
                duration: 1500,
              },
              {
                id: "log_2_1_1_2",
                name: "Call to OpenAI API",
                type: "log",
                status: "failed",
                startTime: 1800,
                duration: 2200,
              },
              {
                id: "log_2_1_1_3",
                name: "APIError: Rate limit exceeded",
                type: "error",
                status: "failed",
                startTime: 4000,
                duration: 0,
              },
            ],
          },
          {
            id: "log_2_1_2",
            name: "Attempt 2",
            type: "attempt",
            status: "failed",
            startTime: 5000,
            duration: 4200,
            children: [
              {
                id: "log_2_1_2_1",
                name: "Wait for 5s before retry",
                type: "log",
                status: "completed",
                startTime: 5000,
                duration: 5000,
              },
              {
                id: "log_2_1_2_2",
                name: "Call to OpenAI API",
                type: "log",
                status: "failed",
                startTime: 10100,
                duration: 2100,
              },
              {
                id: "log_2_1_2_3",
                name: "APIError: Rate limit exceeded",
                type: "error",
                status: "failed",
                startTime: 12200,
                duration: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "job_3",
    projectId: "proj_1",
    name: "generate-report-weekly.pdf",
    status: "in-progress",
    totalDuration: 17500, // 500ms delay + 15000ms runtime + 2000ms halt
    createdAt: "2023-10-26T12:00:00Z",
    logs: [
      {
        id: "log_3_registered",
        name: "Job registered in queue",
        type: "registered",
        status: "completed",
        startTime: 0,
        duration: 0,
      },
      {
        id: "log_3_1",
        name: "generate-report",
        type: "task",
        status: "in-progress",
        startTime: 500, // Start after 500ms delay
        duration: 17000, // 15000ms runtime + 2000ms halt
        children: [
          {
            id: "log_3_1_1",
            name: "Attempt 1",
            type: "attempt",
            status: "in-progress",
            startTime: 600,
            duration: 16900,
            children: [
              {
                id: "log_3_1_1_1",
                name: "Fetch database records",
                type: "success",
                status: "completed",
                startTime: 700,
                duration: 3000,
              },
              {
                id: "log_3_1_1_halt",
                name: "Job halted, waiting for resources",
                type: "halted",
                status: "completed",
                startTime: 3700,
                duration: 2000, // Halted for 2s
              },
              {
                id: "log_3_1_1_2",
                name: "Waiting for image renderer...",
                type: "log",
                status: "completed",
                startTime: 5700, // Resumes after halt
                duration: 7000,
              },
              {
                id: "log_3_1_1_3",
                name: "Render charts",
                type: "log",
                status: "in-progress",
                startTime: 12700,
                duration: 4600,
              },
              {
                id: "log_3_1_1_4",
                name: "Assemble PDF",
                type: "task",
                status: "queued",
                startTime: 0, // This is a placeholder, not yet started
                duration: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "job_4",
    projectId: "proj_2",
    name: "sync-stripe-data",
    status: "completed",
    totalDuration: 8000,
    createdAt: "2023-10-25T08:00:00Z",
    logs: [
      {
        id: "log_4_1",
        name: "sync-stripe",
        type: "task",
        status: "completed",
        startTime: 0,
        duration: 8000,
        children: [
          {
            id: "log_4_1_1",
            name: "Fetch new charges",
            type: "log",
            status: "completed",
            startTime: 500,
            duration: 7500,
          },
        ],
      },
    ],
  },
]
