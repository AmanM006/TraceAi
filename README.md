# TraceAI — Full-Stack Observability Platform

**TraceAI** is a production-grade error monitoring and debugging platform built for modern web applications. Inspired by tools like Sentry, it provides real-time error tracking, stack trace normalization, and AI-powered diagnostic insights to help developers fix bugs in seconds.



## 🚀 Features

* **Custom SDK**: A lightweight, published npm package (`traceai-sdk-official`) for automatic global error capture and manual event logging.
* **AI Diagnostics**: Leverages **Google Gemini** to analyze obfuscated stack traces and provide human-readable root-cause analysis and code-fix suggestions.
* **Environment-Aware Dashboard**: Separate monitoring for `Dev` and `Prod` environments with real-time activity feeds and error frequency analytics.
* **Secure Multi-Tenancy**: Project-based workspace management using **Supabase Auth** and Row Level Security (RLS) to protect developer data.
* **Fingerprinting**: Intelligent error deduplication that groups similar crashes by stack trace similarity to prevent dashboard clutter.

## 🛠️ Tech Stack

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Database & Auth**: Supabase (PostgreSQL)
* **AI Engine**: Google Gemini API
* **Styling**: Tailwind CSS

## 📂 Project Structure

This repository is managed as a monorepo:
* `/app`: Next.js frontend and API routes.
* `/trace-sdk`: Source code for the `@traceai/sdk-official` library.
* `/components`: Reusable UI elements, including the Live Error Feed and Analytics Charts.

## 🔧 Installation & Setup

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/AmanM006/traceai.git](https://github.com/AmanM006/traceai.git)
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory with the following:
    ```text
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    GEMINI_API_KEY=your_google_gemini_key
    ```
4.  **Run the dashboard**
    ```bash
    npm run dev
    ```

---
