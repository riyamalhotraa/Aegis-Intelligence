AEGIS --- AI Agent Payment Governance

A governance and transaction-control layer for autonomous AI-agent
payments.

Overview

AEGIS is a full-stack platform designed to govern financial actions
initiated by autonomous AI agents. It evaluates payment requests against
configurable policies and guardrails before execution, enabling
legitimate transactions to proceed while controlling risky or
unauthorized spending.

AEGIS focuses on the governance challenges created by x402-style
machine-to-machine payments, where AI agents can programmatically access
paid APIs and services.

Problem

As AI agents become capable of acting independently, they can also
initiate financial transactions with limited human intervention. This
creates risks such as:

Unauthorized spending

Excessive or budget-breaking payments

Unintended transactions

Repeated or duplicate transactions

Transactions with untrusted providers

Limited visibility into agent-driven financial activity

Core Workflow

AI Agent
   ↓
Payment Request
   ↓
Policy Evaluation
   ↓
Guardrails / Risk Checks
   ↓
Approve / Human Review / Reject
   ↓
Payment Execution
   ↓
Settlement
   ↓
Transaction & Audit Records

Key Features

AI Agent Monitoring

Tracks agent activity, objectives, risk levels, and payment behavior.

Payment Request Management

Captures payment requests with agent, provider, amount, category, risk,
and status information.

Policy & Guardrail Engine

Supports configurable controls for:

Spending limits

Provider allowlists

Frequency limits

Category limits

Daily budgets

Risk rules

Automated Decisions

Routes transactions into:

Approved --- can proceed automatically

Human Approval --- requires additional authorization

Rejected --- violates configured governance rules

Automated Transaction Execution

Approved requests can proceed through the transaction execution
workflow.

x402-Style Payment Lifecycle

Payment Required → Authorized → Verified → Settling → Settled

Blockchain Monitoring

Tracks transaction IDs, hashes, network information, settlement status,
timestamps, and blockchain activity.

Dashboard

Includes Mission Control, AI Command Center, Payment Requests, Approval
Center, Transaction Details, Policy Builder, Guardrails, Incident
Center, Blockchain Command Center, Analytics, Audit Logs, and Settings.

Architecture

AI Agents
    ↓
Payment Request
    ↓
AEGIS Governance Layer
 ┌─────────────────────────┐
 │ Policy Engine           │
 │ Guardrails              │
 │ Risk Evaluation         │
 └────────────┬────────────┘
              ↓
      Approve / Review / Reject
              ↓
      Payment Execution
              ↓
   Settlement / Blockchain
              ↓
       Audit & Analytics

Technology Stack

Layer             Technology

Frontend          React, TypeScript, Vite, Tailwind CSS
Backend           Python, FastAPI
AI / Agents       LangChain, LangGraph, LLM APIs
Governance        Custom Policy Engine + Guardrail Engine
Payments          x402-style payment lifecycle
Blockchain        Blockchain transaction layer / Base Sepolia
Database          SQLite planned for persistent records
APIs              REST
Version Control   Git + GitHub
Deployment        Render

Project Structure

Aegis/
├── backend/
│   ├── main.py
│   ├── blockchain.py
│   ├── blockchain.json
│   ├── guardrails.py
│   ├── policy_builder.py
│   ├── policy_store.py
│   ├── request_history.py
│   ├── selector.py
│   ├── api_catalog.json
│   ├── keyword_map.json
│   ├── requirements.txt
│   └── x402/
│       ├── __init__.py
│       ├── payment_models.py
│       └── payment_service.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── README.md
└── .gitignore

x402 Integration

x402 is an HTTP-native approach to programmatic payments built around
the 402 Payment Required mechanism.

AEGIS currently models an x402-style payment lifecycle within its
governance and transaction workflow.

Planned x402 Gateway

A dedicated gateway will eventually sit between AI agents and payment
providers:

AI Agent
   ↓
AEGIS x402 Gateway
   ↓
Policy + Guardrails
   ↓
Payment Verification
   ↓
Settlement
   ↓
Blockchain

The gateway will validate transaction context and enforce AEGIS policies
before approved payments proceed toward settlement.

Database Roadmap

A planned SQLite database will provide persistent storage for:

Payment requests

Transactions

Blockchain records

Policy configurations

Guardrail decisions

Approval decisions

Audit records

This will enable historical querying, persistence across restarts, and
stronger analytics.

Deployment

AEGIS uses separate frontend and backend services.

Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend

cd frontend
npm install
npm run dev

The production frontend and backend are deployed independently on Render
and communicate through REST APIs.

Environment Variables

Never commit API keys, wallet credentials, or other secrets to GitHub.

Use .env locally and configure production secrets through the
deployment platform.

Demo Scenarios

AEGIS can demonstrate three governance outcomes:

🟢 Automatic Approval

A low-risk request within configured policies.

🟡 Human-in-the-Loop

A legitimate request that exceeds the autonomous spending threshold and
requires additional approval.

🔴 Rejection

A request that violates a configured guardrail.

Future Scope

Dedicated x402 Gateway for pre-settlement transaction governance

Persistent SQLite database for transaction and blockchain
history

Real on-chain x402 settlement

Advanced AI risk and anomaly detection

Real-time alerts

Additional payment providers and blockchain networks

Security Considerations

AEGIS is currently a project prototype. Production deployment would
require additional authentication, authorization, secure wallet/key
management, persistent storage, transaction-signing controls, security
testing, monitoring, and compliance controls.

Real-value transactions should only be enabled after appropriate
security and operational validation.

References

x402 Documentation

x402 Official Site

FastAPI Documentation

React Documentation

SQLite Documentation

Project

AEGIS --- AI Agent Payment Governance

A prototype exploring how autonomous AI agents can perform
machine-to-machine payments while remaining subject to configurable
financial governance, risk controls, and transaction visibility.