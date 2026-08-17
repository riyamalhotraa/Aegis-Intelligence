🛡️ AEGIS — AI Agent Payment Governance

A policy **enforcement point** for autonomous AI-agent payments.

AEGIS sits between AI agents and the services they pay for. Agents hold no
credentials — they submit an intent, and AEGIS evaluates it against
configurable policy and, only if allowed, makes the paid call itself.

The distinction matters. A layer agents *report to* is advisory: an agent that
never asks is unaffected. A layer that *holds the only credential* is
enforceable, and refusing requires no cooperation from the agent.

    We don't stop prompt injection. We make it financially inert.

See `docs/ARCHITECTURE.md` for how that works, and run the demo below to watch
it happen.

## ⚡ The 60-second demo

    cd backend
    pip install -r requirements.txt
    python demo_injection.py

Runs the same prompt-injection attack four times — against an agent holding
its own wallet, against the same agent behind AEGIS, against a legitimate
provider, and finally against the guard itself. No server needed.

## 🧪 Tests

    cd backend
    python -m pytest test_guard.py -v

23 tests covering the guard's security properties and every bug this work
fixed. Each regression test fails against the previous implementation.


🚨 Problem

As AI agents become increasingly autonomous, they can also initiate financial transactions with limited human intervention. This introduces risks such as:

Unauthorized spending

Excessive or budget-breaking payments

Unintended transactions

Repeated or duplicate transactions

Transactions with untrusted providers

Limited visibility into agent-driven financial activity

💡 Solution

AEGIS evaluates every payment request against configurable financial and risk policies before it reaches transaction execution.

AI Agent → Payment Request → Policy Evaluation → Guardrails
                    ↓
       Approve / Human Approval / Reject
                    ↓
             Payment Execution
                    ↓
              Settlement
                    ↓
         Transaction & Audit Records

✨ Key Features

🤖 AI Agent Governance — Monitor and control payment activity initiated by autonomous agents.

💳 Payment Request Management — View agent, provider, amount, category, risk level, and status.

🛡️ Policy Builder & Guardrails — Spending limits, provider allowlists, frequency limits, category limits, daily budgets, and risk rules.

👤 Human-in-the-Loop Approvals — Route legitimate but higher-risk transactions for human authorization.

⚡ Automated Decisions — Approved, Human Approval Required, or Rejected.

⛓️ Blockchain Monitoring — Track transaction IDs, hashes, network details, settlement status, and timestamps.

📊 Analytics & Auditability — Monitor payments, decisions, incidents, transactions, and system activity.

📸 Project Screenshots

The repository includes screenshots of the main AEGIS interfaces.

⛓️ Blockchain Command Center



🎛️ Command Center



🛡️ Guardrails



📋 Policy Builder



💳 Payment Requests



🔎 Transaction Details



👤 Human Approval



🏗️ Architecture

                         ┌─────────────────┐
                         │    AI AGENTS    │
                         └────────┬────────┘
                                  ↓
                         ┌─────────────────┐
                         │ PAYMENT REQUEST │
                         └────────┬────────┘
                                  ↓
                 ┌────────────────────────────────┐
                 │        AEGIS GOVERNANCE        │
                 │ Policy Engine • Guardrails     │
                 │ Risk Evaluation • Approval     │
                 └───────────────┬────────────────┘
                                 ↓
                    ┌────────────┼────────────┐
                    ↓            ↓            ↓
                 APPROVE      REVIEW        REJECT
                    │            │
                    └──────┬─────┘
                           ↓
                  ┌─────────────────┐
                  │ PAYMENT EXECUTION│
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │ SETTLEMENT /    │
                  │ BLOCKCHAIN      │
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │ AUDIT & ANALYTICS│
                  └─────────────────┘

🧰 Technology Stack

Layer

Technology

Frontend

React, TypeScript, Vite, Tailwind CSS

Backend

Python, FastAPI

AI / Agent Components

LangChain + Groq — used for policy suggestions only. Enforcement is deterministic; an LLM never decides whether to release money.

Governance

Custom Policy Engine + Guardrail Engine

Payments

x402-style payment lifecycle

Blockchain

Hash-linked decision ledger, optionally anchored on Base Sepolia. Settlement is simulated — no funds move.

Database

SQLite — implemented; requests, payments and decisions persist across restarts

APIs

REST

Version Control

Git + GitHub

Deployment

Render

📁 Project Structure

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
├── frontend/
│   └── src/
├── screenshots/
│   ├── blockchain.png
│   ├── command center.png
│   ├── guardrails.png
│   ├── policy builder.png
│   ├── requests.png
│   ├── transaction.png
│   └── user_approval.png
├── README.md
└── .gitignore

💳 x402 Integration

x402 is an HTTP-native approach to programmatic payments built around the 402 Payment Required mechanism.

AEGIS uses an x402-style payment lifecycle within its governance and transaction workflow:

Payment Required → Authorized → Verified → Settling → Settled

🔗 Planned x402 Gateway

A dedicated gateway is planned to sit between AI agents and payment providers:

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

The gateway will validate transaction context and enforce AEGIS policies before approved payments proceed toward settlement.

🗄️ Database Roadmap

A planned SQLite database will provide persistent storage for:

Payment requests

Transactions

Blockchain records

Policy configurations

Guardrail decisions

Approval decisions

Audit records

This will enable historical querying, persistence across restarts, and stronger analytics.

🔄 Governance Scenarios

Scenario

Expected Result

Low-risk request within policy

🟢 Automatic Approval

Legitimate request exceeding autonomous threshold

🟡 Human Approval

Request violating a configured guardrail

🔴 Rejection

This demonstrates that AEGIS does not simply allow or block all autonomous payments — it applies context-aware governance.

🌐 API Catalog

AEGIS can model payment requests for services across categories such as:

Financial research

Travel

Maps

Email

Documents

Image generation

Video generation

Speech

Translation

Weather

Web search

Code

Payments

The API catalog contains providers, estimated request costs, categories, and descriptions used by the payment-selection and governance workflow.

☁️ Deployment

AEGIS is deployed as separate frontend and backend services on Render.

Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend

cd frontend
npm install
npm run dev

The production frontend and backend communicate through REST APIs.

🔐 Environment Variables

Never commit API keys, wallet credentials, or other secrets to GitHub.

Use .env locally and configure production secrets through the deployment platform.

🚀 Future Scope

Dedicated x402 Gateway for pre-settlement transaction governance

Persistent SQLite database for transaction and blockchain history

Production on-chain x402 settlement

Advanced AI risk and anomaly detection

Real-time alerts

Expanded provider and blockchain network support

⚠️ Current Limitations

AEGIS is a prototype. What is real and what is not:

REAL — policy and guardrail engine, decision flow and human escalation,
credential custody, the hash-linked ledger and its verification, SQLite
persistence, and on-chain anchoring when a testnet key is configured.

SIMULATED — the x402 payment lifecycle. The state machine is real; settlement
is stubbed and no funds move. PAY_TO_ADDRESS is the zero address, and settled
payments are marked settlement_mode: "simulated".

NOT BUILT — LLM risk scoring. riskLevel is currently derived from the policy
decision, not independently assessed.

Do not put real value through this without wallet/key management, transaction
signing controls, security testing, monitoring and compliance review.

📚 References

x402 Documentation

x402 Official Site

FastAPI Documentation

React Documentation

SQLite Documentation

👩‍💻 Project

AEGIS — AI Agent Payment Governance

A prototype exploring how autonomous AI agents can perform machine-to-machine payments while remaining subject to configurable financial governance, risk controls, human oversight, and transaction visibility.
