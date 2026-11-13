# PROMPTS.md
# WeatherBoard — AI Development & Prompt Engineering Log

**Project:** WeatherBoard  
**Organization:** Edspire  
**Challenge:** Frontend (React) Developer Technical Interview  
**Development Date:** Friday, November 13, 2026  
**AI Assistant:** Claude (Anthropic)  
**Editor:** Visual Studio Code  
**Development Language:** JavaScript (React)

---

## 1. Development Environment & Tooling

| Tool | Purpose |
|---|---|
| Claude (Anthropic) | AI-assisted development, architecture, implementation and debugging |
| Visual Studio Code | Code editing and project management |
| React + Vite | Frontend application |
| Tailwind CSS | Styling and responsive UI |
| Git & GitHub | Version control and source code hosting |
| Vercel | Application deployment |

**AI Interaction Method:** Claude was used through its chat interface.

**Agentic IDE Disclosure:** Cursor, Antigravity and OpenCode were not used. Development was conducted through a Claude chat workflow alongside Visual Studio Code. This approach allowed the developer to review proposed implementations, execute commands, test changes and maintain control over technical decisions.

**AI Model Version:** Claude (Sonnet 5.5).

---

## 2. Development Approach

The project was developed through a structured, phase-based workflow rather than generating the entire application in one request.

Each phase followed this process:

1. Define the objective and requirements.
2. Ask Claude for an implementation approach.
3. Review the proposed technical solution.
4. Implement the changes in the project.
5. Run and test the application.
6. Report issues and request corrections.
7. Proceed to the next phase after verification.

The developer retained responsibility for reviewing AI-generated code, making design decisions and validating the application's behaviour.

The following sections document the development prompts and their corresponding outcomes. Conversational prompts have been editorially refined for readability; they are not represented as verbatim transcripts.

---

## 3. Prompt History

### Phase 1 — Project Brief & Technical Architecture

**Date:** November 13, 2026  
**Time:** 3:35 PM

**Objective:** Establish the complete project context and define the implementation strategy before writing code.

**Prompt Summary:**

Provided Claude with a comprehensive project brief covering:

- Developer background, technical experience and preferred stack.
- Edspire's original hiring email and submission deadline.
- The attached technical challenge PDF as the primary requirements document.
- All seven core functional requirements.
- Preferred technologies and API integrations.
- UI/UX design references.
- Development workflow and code quality expectations.
- Time constraints and implementation priorities.
- GitHub, documentation and deployment requirements.

The initial instruction was to analyse the requirements, propose an architecture and wait for approval before starting implementation.

**Follow-up Instruction:**

Prioritize the work according to the limited time available. Focus on delivering a functional, well-tested application without unnecessary overengineering.

**Outcome:**

Claude produced a requirements checklist, proposed architecture, folder structure, API strategy, PWA implementation plan and development timeline.

It also identified the technical limitation of guaranteeing scheduled background notifications in a client-only application.

---

### Phase 2 — Development Environment & Technology Decisions

**Time:** 3:40 PM

**Objective:** Finalize the development workflow and initial project setup.

**Prompt Summary:**

Selected Claude's chat-based development workflow alongside VS Code rather than switching to an unfamiliar Agentic IDE during a time-sensitive assignment.

The decision was based on familiarity with Claude and previous experience building complex applications using it.

Requested the initial project setup and implementation guidance.

**Technical Decisions:**

- React with Vite.
- JavaScript instead of TypeScript.
- Tailwind CSS v4.
- Open-Meteo as the primary weather provider.
- GeoDB Cities API for city autocomplete.
- vite-plugin-pwa for PWA functionality.

**Outcome:**

Claude provided the initial setup commands, dependency recommendations and the first implementation steps, including the planned city-search API module and reusable debounce logic.

---

### Phase 3 — City Search & Input Validation

**Time:** 4:15 PM

**Objective:** Implement the city search functionality and its associated validation.

**Developer Prompt:**

"Phase 0 is complete. What should we implement next?"

**Implementation Scope:**

- Reusable city-search logic.
- Debounced autocomplete requests.
- Request cancellation using AbortController.
- City-search loading and result states.
- Input validation on blur and submission.
- Handling empty searches and unsuccessful API responses.

**Outcome:**

Claude provided the `useCitySearch` hook and SearchBox component implementation, together with a testing checklist.

---

### Phase 4 — Visual Design & Weather Data Integration

**Time:** 8:44 PM

**Objective:** Establish the application's visual identity and implement real weather data integration.

**Developer Prompt:**

"Let's proceed quickly with the next phase. I would like to use an orange and white colour theme for the dashboard. Evaluate this direction and suggest any improvements."

**Design Decision:**

Selected an orange-and-white visual theme.

Claude recommended using darker orange shades for sufficient text contrast and a warm neutral background for a more balanced interface.

**Implementation Scope:**

- Safe localStorage wrapper.
- Weather condition mapping using Open-Meteo weather codes.
- Open-Meteo API integration.
- Weather data management through a reusable `useWeather` hook.
- Cached weather fallback.
- Current weather display.
- Forecast cards.
- Loading, empty and error states.

**Outcome:**

The core weather dashboard and its real API integration were implemented using the selected visual direction.

---

### Phase 5 — Favourite Cities & Persistent Storage

**Time:** 8:51 PM

**Objective:** Implement the favourite cities functionality.

**Developer Prompt:**

"The current phase is complete. Let's move on to the next implementation phase."

**Implementation Scope:**

- Save and remove favourite cities.
- Enforce a maximum of five favourites.
- Persist favourite data using localStorage.
- Handle corrupted stored data.
- Gracefully handle storage failures.
- Add a confirmation dialog before removing a favourite.
- Provide a quick-access favourites panel.

**Outcome:**

Claude provided the reusable `useFavourites` hook, native HTML dialog implementation and the required application integration.

---

### Phase 6 — Progressive Web App & Offline Support

**Time:** 8:56 PM

**Objective:** Convert WeatherBoard into an installable Progressive Web App.

**Developer Prompt:**

"The favourites functionality is complete. Proceed with the PWA implementation. We will handle interview preparation separately after submission."

**Implementation Scope:**

- Application icons.
- Web App Manifest.
- Service Worker configuration.
- Workbox integration.
- Application shell caching.
- Last-viewed weather caching.
- Offline detection.
- Offline mode banner.
- Deployment environment configuration.

**Outcome:**

Claude proposed the PWA implementation using `vite-plugin-pwa` and an injectManifest service worker strategy, including precaching and network-first weather caching.

---

### Phase 7 — Notification Settings & Browser Integration

**Time:** 9:13 PM

**Objective:** Implement the notification settings and browser notification workflow.

**Developer Prompt:**

"The PWA implementation is complete. Let's proceed with the notification functionality."

**Implementation Scope:**

- Explain notification benefits before requesting permission.
- Handle browser notification permissions.
- Allow users to configure reminder times.
- Integrate notification handling into the Service Worker.
- Explore Periodic Background Sync where supported.
- Provide an in-page timer fallback.
- Add a test notification action.
- Handle unsupported browsers and denied permissions.

**Technical Consideration:**

The implementation was designed with browser limitations in mind. Reliable daily background delivery cannot be guaranteed through client-side scheduling alone without additional push infrastructure.

**Outcome:**

Claude implemented the notification settings workflow and proposed best-effort browser functionality with appropriate limitations.

---

### Phase 8 — Debugging & Notification Test Failure

**Time:** 9:23 PM

**Objective:** Investigate a notification test button that remained stuck in its loading state.

**Developer Prompt:**

"The notification settings are implemented, but clicking the 'Send Test Notification' button keeps displaying 'Sending...' indefinitely. Investigate the issue and fix it."

**Issue Identified:**

The notification test workflow was waiting for `navigator.serviceWorker.ready`.

During development, when an active Service Worker was unavailable, this promise could remain unresolved, leaving the interface in a permanent loading state.

**Requested Fix:**

- Prevent indefinite waiting.
- Introduce a timeout using Promise.race.
- Display a meaningful error message when the Service Worker is unavailable.
- Provide guidance to reload the application.
- Verify the behaviour using a production build.

**Outcome:**

Claude proposed a three-second timeout and a more specific error state.

Production testing was recommended using:

`npm run build && npm run preview`

---

### Phase 9 — Final Review & Documentation

**Time:** 9:45 PM

**Objective:** Prepare the application for final delivery.

**Developer Prompt:**

"Let's proceed with the remaining work and prepare the project for submission."

**Implementation Scope:**

- Prepare README.md.
- Prepare PROMPTS.md.
- Review responsive layouts.
- Check mobile touch-target sizes.
- Perform final UI refinements.
- Review deployment readiness.

**Outcome:**

Claude assisted with project documentation, responsive design auditing and final implementation refinements.

---

## 4. Key Technical Decisions & Developer Contributions

The following decisions demonstrate the developer's involvement beyond accepting AI-generated code.

### 4.1 Development Workflow

Chose a familiar Claude chat-based workflow with VS Code instead of using an unfamiliar Agentic IDE under a strict deadline. This choice was documented transparently.

### 4.2 Visual Identity

Selected an orange-and-white theme and incorporated contrast recommendations to improve readability and accessibility.

### 4.3 Weather API Selection

Selected Open-Meteo as the primary weather data provider to avoid API-key activation delays and keep the implementation straightforward.

No unimplemented fallback functionality was claimed.

### 4.4 Error Handling & Debugging

Identified the notification test button's indefinite loading behaviour, reported the issue and requested a specific technical fix rather than accepting the broken implementation.

### 4.5 Honest PWA Limitations

Maintained transparency regarding background notification scheduling. The documentation distinguishes between supported browser functionality and features requiring additional server-side push infrastructure.

### 4.6 Code Review & Validation

Followed an iterative implementation process, reviewing changes, running the application and reporting issues before moving to subsequent development phases.

---

## 5. Final Development Principles

The following principles guided the project:

- Build functionality before adding unnecessary complexity.
- Prefer reusable and maintainable React components.
- Use real API data rather than hardcoded weather information.
- Handle asynchronous operations and failures explicitly.
- Maintain responsive behaviour across supported screen sizes.
- Never expose sensitive API credentials in public repositories.
- Document technical limitations honestly.
- Review and validate AI-generated code rather than accepting it blindly.

---

**End of Development Log**

**Project:** WeatherBoard  
**Organization:** Edspire  
**Purpose:** Frontend (React) Developer Technical Challenge  
**AI Assistant:** Claude (Anthropic)