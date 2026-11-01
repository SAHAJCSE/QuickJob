# Job Finder - Interactive Mobile App Implementation Plan

An interactive, high-fidelity 4-screen mobile job discovery and application platform built with React, Tailwind CSS, LocalStorage persistence, and a server-side Gemini AI cover letter generator.

> [!IMPORTANT]
> **Confirmed User Decisions:**
> 1. **Feature Scope**: Complete 4-screen mobile flow covering Onboarding, Home & Discovery, Search & Filtering, and Job Details, plus an Application Tracker and Saved Jobs drawer.
> 2. **Data Persistence**: LocalStorage persistence so saved jobs, bookmark toggles, applied jobs status, and generated cover letters remain saved across page refreshes.
> 3. **AI Capabilities**: Integrated server-side Gemini AI (`gemini-3.8-flash`) cover letter generator that crafts personalized application messages when candidates apply.

---

## 1. Overview & Core Concept

**Job Finder** is a modern, tactile mobile job search application designed for tech professionals and designers. The app mirrors the precise visual language of the design system provided: modern pastel card accents (soft lavender `#BFB9FA`, neon lime `#CEF839`, pastel peach `#FDE7C9`, mint `#D8F7D9`), rounded surface cards (`rounded-3xl`), floating bottom navigation dock, and iOS-like viewport presence.

### Key Capabilities
- **Screen 1: Onboarding & Welcome**: Hero 3D professional illustration, soft wave header backdrop, "The bettar way to find your fancy job here", and interactive "Get Started" swipe/click CTA button.
- **Screen 2: Home & Discovery**: Greeting section, location search bar with lime filter trigger, horizontal snap carousel for "Popular Jobs" (Apple Product Designer, GitHub Web Development), and vertical "Recently Added" job list.
- **Screen 3: Search & Job Filtering**: Interactive search with category filter pills (Jobs, Companies, Salaries), query highlighting, recent searches feed, and instant job results.
- **Screen 4: Job Details**: Curved lavender header with Apple company badge in a neon lime pill, salary breakdown, tag chips, interactive vector map preview with "Get Map direction" action, requirements list, and floating bottom "Apply Now" slider with AI Cover Letter generator modal.
- **Saved Jobs & Application Tracker**: Full persistence of bookmarked listings and application history, viewable via the bottom tab bar and profile screens.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Onboarding -> Home**: Users enter on the Onboarding screen. Clicking "Get Started" or "Skip" seamlessly navigates to the Home & Discovery view.
2. **Browsing -> Filtering**: Users can tap any job card (e.g. Product Designer at Apple, Web Dev at GitHub, Spotify Online Marketing) to open the Job Details view, or tap the search bar / filter button to open the Search Job view with category tabs.
3. **Saving & Applying**: 
   - Tapping the bookmark icon toggles the job's saved state with instant visual feedback and saves to LocalStorage.
   - Tapping "Apply Now" on Job Details opens an **AI Cover Letter Modal** pre-filled with job metrics and user profile details.
   - Users can click "Generate with AI", refine the generated letter, and submit. The application status immediately updates to "Applied" across all screens and saves to the Application Tracker.
4. **Navigation Dock**: The floating bottom dock lets users jump between **Home**, **Saved Jobs**, **Messages / Tracker**, and **Profile**.

### Visual Identity & Theme
- **Color Budget (60-30-10 Rule)**:
  - **60% Neutral Canvas**: `#F2F1F8` (light subtle slate background).
  - **30% Structural Surfaces**: Clean white `#FFFFFF` cards, soft pastel surfaces (`#BFB9FA` lavender, `#FDE7C9` peach, `#D8F7D9` mint).
  - **10% High-Intent Accent**: Neon Lime `#CEF839` for primary action buttons, filter buttons, active tab indicators, and badge rings.
- **Typography**: `-apple-system`, `SF Pro Display`, `Inter` body text. Heavy headline typography (`font-bold`, `tracking-tight`), tabular figures (`tabular-nums`) for salary numbers.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Trade-Offs |
| :--- | :--- | :--- |
| **Viewport Presentation** | Responsive Mobile Frame centered on desktop with option to toggle full-screen | Matches the exact mobile design mockups while allowing testing on any device. |
| **State & Persistence** | React State synchronized with `localStorage` | Keeps state light, instant, zero-latency, and persistent without requiring external database setup. |
| **AI Integration** | Server-side Express proxy using `@google/genai` (`gemini-3.8-flash`) | Ensures secret `GEMINI_API_KEY` stays on the server side while delivering fast AI cover letters. |

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          React SPA Frontend                            │
│                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐ │
│  │ OnboardingView       │  │ HomeView             │  │ SearchJobView│ │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘ │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐ │
│  │ JobDetailsView       │  │ ProfileView          │  │ SavedJobsView│ │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘ │
│                                                                        │
│               ▲                             │                          │
│               │ state & storage sync        ▼                          │
│  ┌────────────────────────┐       ┌──────────────────────────────────┐ │
│  │ LocalStorage Service   │       │ Cover Letter Modal & API Client │ │
│  │ (savedJobs, apps, profile)     └──────────────────────────────────┘ │
└───────────────┼───────────────────────────────────┼────────────────────┘
                │                                   │ POST /api/cover-letter
                ▼                                   ▼
       Browser LocalStorage               ┌──────────────────────────────┐
                                          │ Express Server (server.ts)   │
                                          │ @google/genai SDK            │
                                          │ model: gemini-3.8-flash      │
                                          └──────────────────────────────┘
```

### Data Model & Entities

- **JobItem**: `id`, `title`, `company`, `logoType` ('apple' | 'github' | 'spotify'), `logoBg`, `cardTheme` ('lavender' | 'peach' | 'mint' | 'white'), `salary`, `location`, `tags` (`string[]`), `description`, `requirements` (`string[]`), `postedTime`, `isSaved`, `isApplied`.
- **UserProfile**: `name`, `title`, `location`, `avatarUrl`, `stats` (`{ appliedCount, interviewCount, savedCount }`), `skills` (`string[]`), `cvFileName`.
- **JobApplication**: `jobId`, `jobTitle`, `company`, `appliedDate`, `coverLetter`, `status` ('Applied' | 'Under Review' | 'Interview Scheduled').

---

## Implementation Steps

1. **Setup & Dependencies**: Verify `@google/genai` server setup, express backend proxy route `/api/cover-letter`, and Tailwind CSS configuration.
2. **Mock Data & Persistence Layer**: Implement `src/data/jobs.ts` and `src/utils/storage.ts` with default listings (Product Designer @ Apple, Web Dev @ GitHub, Online Marketing @ Spotify, etc.) and state helpers.
3. **Screen Components**:
   - `OnboardingView`: Hero 3D visual, wave gradient background, CTA slider.
   - `HomeView`: Header profile pill, greeting, search bar, Popular Jobs snap carousel, Recently Added list.
   - `SearchJobView`: Live query filter, category tabs (Jobs, Companies, Salaries), job card feed.
   - `JobDetailsView`: Curved lavender top banner, company logo badge, map location widget, requirements, floating apply slider.
   - `ProfileView`: Profile hero card, metric cards, CV document card, key expertise pills, menu options.
   - `AICoverLetterModal`: Interactive modal with AI generator calling `/api/cover-letter`.
4. **Navigation & Floating Dock**: Bottom navigation bar with tab switching, active lime indicator, and screen state router.
5. **Compilation & Verification**: Run `compile_applet` and test all interactive flows.
