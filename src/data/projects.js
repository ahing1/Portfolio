export const projects = [
  {
    filename: "complianceai.md",
    title: "ComplianceAI",
    description:
      "An Agentic Financial Compliance Engine that autonomously analyzes SEC filings through a multi-step AI pipeline with RAG-based retrieval, LLM-powered risk extraction, and a self-verification loop, reducing manual compliance analysis from hours to under 60 seconds. Deployed on AWS with Docker, real-time SSE streaming via Redis pub/sub, JWT auth, and a GitHub Actions CI/CD pipeline.",
    tags: ["LangGraph", "FastAPI", "PostgreSQL", "pgvector", "Redis", "Celery", "Next.js", "Docker", "AWS"],
    size: "8.4kb",
    modified: "2025-10",
    pinned: true,
  },
  {
    filename: "noc-agent.md",
    title: "NOC Agent",
    description:
      "This was my intern project where I learned to take a project from an idea to production. An automation pipeline using LangGraph + DSPy, integrates Kafka, Postgres, and Cloud Tasks to reduce ticket processing time by 98%.",
    tags: ["Python", "LangGraph", "DSPy", "Kafka", "PostgreSQL", "Docker", "GCP"],
    size: "6.1kb",
    modified: "2025-08",
  },
  {
    filename: "prospra.md",
    title: "Prospra",
    description:
      "This was my first attempt at a SaaS project for people trying to get into tech. A Next.js frontend, FastAPI backend with the ChatGPT API, Clerk for authentication, Stripe for billing. Dockerized and deployed on an AWS EC2 instance.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Clerk", "Stripe", "Docker", "AWS"],
    size: "5.3kb",
    modified: "2025-05",
  },
  {
    filename: "fraud-detector.md",
    title: "Fraud Detector",
    description:
      "This was my first personal project that I made from end-to-end. A React UI, Express API, Flask ML microservice hosting a Random Forest model. Dockerized and deployed on AWS EC2 behind Nginx.",
    tags: ["React", "Express", "Flask", "Docker", "AWS"],
    size: "4.2kb",
    modified: "2024-12",
  },
];
