---
title: "AI as the engine, humans as the steering wheel"
description: "Exploration of AI-enhanced democratic governance mechanisms"
author: "Vitalik Buterin"
date: "2025-02-28"
tags: ["AI Governance", "Futarchy", "Distilled Human Judgement", "Deep Funding", "DAO"]
---

# AI as the engine, humans as the steering wheel

## Core Concept

A paradigm where humans provide high-quality but minimal input (the steering wheel) while AI systems execute complex decisions based on this guidance (the engine). This approach aims to combine the benefits of democratic structures without their traditional downsides.

## Key Mechanisms

### Futarchy
- **Definition**: "Vote values, but bet beliefs" - a prediction market system where goals are democratically chosen but implementation decisions are made by market predictions
- **Application**: AI systems can act as sophisticated traders in these markets, predicting outcomes while humans define the metrics of success
- **Benefit**: Separates the "what we want" (human domain) from "how to get there" (AI/market domain)

### Distilled Human Judgement
- **Definition**: A mechanism where human juries provide high-quality answers to a small sample of questions, while AI systems extend these judgements to millions of similar cases
- **Process**: 
  1. Jury evaluates a small subset (~100) of a large set (~1 million) of questions
  2. AI systems provide answers to all questions
  3. Systems are rewarded based on how well they match jury decisions on the sample
- **Applications**: Credit assignment, content moderation, identity verification, aesthetic judgements

### Deep Funding
- **Definition**: Application of distilled human judgement to credit attribution in dependency graphs
- **Use Case**: Distributing rewards across contributors in open source projects or academic research
- **Implementation**: Creates a global graph where funds flow from funded projects to their dependencies based on contribution weights

## Benefits

- **Reduced Voter Burden**: Humans make fewer but higher-quality decisions
- **Incentive Smoothing**: Diffuses power and makes corruption more difficult
- **Open Market Approach**: Avoids enshrining any single AI model into governance
- **Credible Neutrality**: Mechanism remains simple, open-source, and stable even as AI models evolve

## Privacy Considerations

- Private information can be incorporated using cryptographic techniques:
  - Multi-party computation (MPC)
  - Fully homomorphic encryption (FHE)
  - Trusted execution environments (TEEs)
- These allow AI systems to access private data while only outputting approved formats

## Practical Applications

- DAO governance with reduced voter fatigue
- Decentralized funding allocation for public goods
- Community content moderation at scale
- Token distribution mechanisms based on contribution