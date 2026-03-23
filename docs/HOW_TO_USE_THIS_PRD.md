# 📖 How To Use The AgriMitra 360 PRD

> This guide explains how to use `AgriMitra_360_PRD.md` as a universal context document with any AI model — ChatGPT, Claude, Gemini, Copilot, Cursor, or any coding agent.
>
> **⚠️ HACKATHON MODE**: This project is scoped for a **24-hour hackathon** with a **$0 budget**. All tools, APIs, models, and hosting are FREE.

---

## 🎯 What This PRD Is Designed To Do

This isn't just a document — it's a **context engine**. Any AI model that reads it will instantly understand:

- What the project is (identity, vision, metaphor)
- Where the project currently stands (phase, completed work, blockers)
- How every module connects (dependencies, data flow, build order)
- What decisions were already made and WHY (decision log)
- Exact technical specs to implement (formulas, schemas, APIs)

---

## 🚀 Quick Start — Copy-Paste Prompts

### When Starting a New Chat With Any AI Model

Copy the PRD content and paste it as the first message, followed by your instruction. Use these templates:

---

### ⚡ For Hackathon Building (MOST COMMON)

```
[PASTE ENTIRE PRD HERE]

---

INSTRUCTION: You are the lead developer for AgriMitra 360 in a 24-HOUR HACKATHON.
Read CONTEXT_PROTOCOL first, then check PROJECT_STATE and the 24-Hour Sprint Plan (§19).
ALL tools, APIs, and models must be FREE ($0 budget). Check DECISION_LOG before suggesting alternatives.
I am currently on Wave [1-6]. I need you to: [YOUR SPECIFIC REQUEST]

Examples:
- "Set up the Supabase database schema from §9.1"
- "Build the React farmer dashboard with Chart.js based on §12"
- "Implement the Trust Score calculator from §6.4 in JavaScript"
- "Load the pretrained MobileNetV2 model and build inference API"
```

---

### ⚙️ For General Building / Coding

```
[PASTE ENTIRE PRD HERE]

---

INSTRUCTION: You are now the lead developer for AgriMitra 360.
Read the CONTEXT_PROTOCOL first, then check PROJECT_STATE for current progress.
ALL tools must be FREE. Do NOT suggest paid services.
I need you to: [YOUR SPECIFIC REQUEST]
```

---

### 🐛 For Debugging

```
[PASTE ENTIRE PRD HERE]

---

INSTRUCTION: You are debugging the AgriMitra 360 project.
Read CONTEXT_PROTOCOL → MODULE_REGISTRY → relevant spec section.
Here is the error I'm getting: [PASTE ERROR]
The error is in the [MODULE NAME] module.
Fix it according to the specifications in this PRD.
```

---

### 📝 For Documentation / Reports

```
[PASTE ENTIRE PRD HERE]

---

INSTRUCTION: You are writing documentation for AgriMitra 360.
Read QUICK_IDENTITY for the project summary.
I need you to: [YOUR REQUEST]

Examples:
- "Write API documentation for all endpoints in §11"
- "Create a user manual for the farmer dashboard"
- "Generate a technical presentation for national competition judges"
- "Write the README.md for the GitHub repository"
```

---

### 🧪 For Testing

```
[PASTE ENTIRE PRD HERE]

---

INSTRUCTION: You are the QA engineer for AgriMitra 360.
Read MODULE_REGISTRY to understand the system, then use §6 feature specs as acceptance criteria.
Write [unit/integration/end-to-end] tests for the [MODULE NAME] module.
Performance targets are in §14.
```

---

### 🎤 For Competition / Pitch Prep

```
[PASTE ENTIRE PRD HERE]

---

INSTRUCTION: You are a presentation coach helping prepare for a national tech competition.
Read §1 (Summary), §2 (Problem), §3 (Bridge Concept), and §15 (Competitive Analysis).
Judges evaluate on: Innovation, Feasibility, Impact, Scalability, Presentation Clarity.
I need you to: [YOUR REQUEST]

Examples:
- "Write a 7-minute pitch script"
- "Create a judge Q&A defense sheet"
- "Design 15 killer slides for the presentation"
```

---

### 🧠 For Architecture / Design Reviews

```
[PASTE ENTIRE PRD HERE]

---

INSTRUCTION: You are a senior solutions architect reviewing AgriMitra 360.
Read DECISION_LOG for past decisions, §7 for architecture, §14 for scalability.
I need you to: [YOUR REQUEST]

Examples:
- "Review the system architecture for scalability issues"
- "Suggest improvements to the Trust Score formula"
- "Evaluate the data pipeline for bottlenecks"
```

---

## 📋 Section Quick Reference

| When You Need... | Go To Section |
|------------------|---------------|
| Project overview | `QUICK_IDENTITY` |
| Current progress | `PROJECT_STATE` |
| All modules & dependencies | `MODULE_REGISTRY` |
| Build order | `DEPENDENCY_FLOW` |
| Past decisions | `DECISION_LOG` |
| The "bridge" concept | §3 Vision & Bridge Concept |
| Disease detection specs | §6.1 Crop Intelligence Engine |
| Yield prediction specs | §6.2 Yield Prediction Module |
| Sustainability scoring | §6.3 Sustainability Scoring System |
| Trust Score formula | §6.4 AgriCredit Engine |
| Explainable AI | §6.5 XAI Dashboard |
| System architecture | §7 System Architecture |
| Tech stack details | §8 Technology Stack |
| Database schema | §9.1 Database Schema |
| AI model parameters | §10 AI/ML Model Specifications |
| API endpoints | §11 API Specifications |
| UI/UX requirements | §12 User Interface Requirements |
| Security requirements | §13 Security & Privacy |
| Performance targets | §14 Performance & Scalability |
| Competitor comparison | §15 Competitive Analysis |
| Risk analysis | §16 Risk Analysis & Mitigation |
| Deployment plan | §17 Deployment Strategy |
| Success metrics | §18 Success Metrics & KPIs |
| Timeline | §19 Roadmap & Milestones |
| Glossary | §20 Appendix A |

---

## 🔄 Keeping the PRD Updated

The PRD is a **living document**. As you build, follow §21 (Context Maintenance Guide):

### After Every Major Implementation Step:

1. **Open the PRD**
2. **Update `PROJECT_STATE`** → move items between `completed` / `in_progress` / `not_started`
3. **Update `last_updated`** date
4. **Save**

### After Any Design Change:

1. **Add a row to `DECISION_LOG`**
2. **Update the relevant §6.x specification**
3. **Update `MODULE_REGISTRY`** if module structure changed

### Why This Matters:

When you open a new chat tomorrow and paste the PRD, the AI will know:
- ✅ What's already done
- 🔄 What you're currently working on
- ❌ What hasn't been started
- ⚠️ What decisions were made and why

This prevents the AI from suggesting work you've already completed or contradicting decisions you've already made.

---

## 💡 Pro Tips

### Tip 1: Use Module IDs in Your Prompts
Instead of describing what you want, reference the module directly:

```
❌ "Help me build the crop disease detection part"
✅ "Implement the CROP_INTEL module per §6.1 specs"
```

### Tip 2: Reference Requirement IDs
For specific features, use the requirement ID:

```
❌ "Make the disease detection work offline"
✅ "Implement requirement CI-06 (offline inference via PWA)"
```

### Tip 3: Use DECISION_LOG to Prevent AI Drift
If an AI suggests using a paid service, you can say:

```
"See DECISION_LOG D2 — we chose Supabase FREE tier. Do not suggest paid alternatives."
```

### Tip 4: Reference Your Current Wave
When chatting with an AI, always say which wave you're on:

```
"I'm on Wave 3 of the 24-hour sprint (see §19). Help me build the yield prediction formula."
```

### Tip 4: Partial Context for Token-Limited Models
If the PRD is too long for a model's context window, paste these sections in order:

1. **Always include**: `CONTEXT_PROTOCOL` + `QUICK_IDENTITY` + `MODULE_REGISTRY`
2. **Add based on task**: The relevant §6.x spec section
3. **Add if needed**: `DECISION_LOG` + `DEPENDENCY_FLOW`

### Tip 5: Multi-Session Continuity
At the start of each new session:

```
"Here is the AgriMitra 360 PRD. Check PROJECT_STATE for current progress.
Last session I completed [X]. Continue from where we left off."
```

---

## 🤖 Tested With These AI Models

This PRD format is designed to work optimally with:

| Model | How to Use | Notes |
|-------|-----------|-------|
| **ChatGPT (GPT-4/4o)** | Paste full PRD as first message | Handles full document easily |
| **Claude (3.5/4)** | Paste full PRD or upload as file | Excellent at following structured protocols |
| **Gemini (2.0/2.5)** | Paste full PRD or attach as file | Works well with YAML/structured metadata |
| **GitHub Copilot** | Add PRD to workspace root | Copilot will reference it for code suggestions |
| **Cursor AI** | Add PRD to project, reference with @file | Picks up context automatically |
| **Windsurf/Codeium** | Add PRD to workspace | Reads as project documentation |
| **VS Code + AI Extension** | Keep PRD open in editor tab | Most extensions read open tabs |
| **Open-source LLMs** | Paste QUICK_IDENTITY + relevant section | Use partial context for smaller models |

---

*This document accompanies `AgriMitra_360_PRD.md` v2.0 (Hackathon Edition)*
*Last updated: March 23, 2026*
*Budget: $0 — All free, all the time.*
