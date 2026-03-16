# CS 2340 Hackathon Requirements Checklist

Date verified: March 15, 2026

## Submission Artifacts

- [ ] Live website URL added
- [ ] GitHub repo URL added
- [ ] Video walkthrough URL added

Notes:
- The project includes deployment instructions for a publicly accessible setup using Vercel + Railway.
- Add final production links in README before submitting.

## Requirement Coverage

### 1) Public website accessibility

Status: Partially complete (implementation ready; final URL not filled)

Evidence:
- docs/DEPLOYMENT.md includes full production deployment flow for Vercel frontend and Railway WebSocket backend.
- Next.js production build succeeds.

### 2) At least 5 required diagrams with specified mappings

Status: Complete

Evidence from scenario presets in lib/scenarios.ts:
- UCD (Scenarios 1, 2, 3): `ucd_all`
- DMD (CampusConnect context): `dmd_campus`
- DCD (Scenario 2): `dcd_daniel`
- SD (Scenario 2): `sd_daniel`
- SSD (Scenario 3): `ssd_priya`

### 3) Website clearly teaches

Status: Complete

Evidence in app/learn/page.tsx:
- Purpose of each diagram: each card has a dedicated `purpose` section.
- Process to build each diagram: each card includes a 3-step build list.
- How diagrams connect: each card includes an explicit `connection` explanation and consistency flow section.

### 4) Not built with a site builder

Status: Complete

Evidence:
- Custom source code project (Next.js, TypeScript, Tailwind).
- No Wix/Webflow/Squarespace builder artifacts.

## Internal Consistency Notes

Current state is strong and includes explicit consistency guidance on the Learn page.

Potential improvement (optional but recommended):
- Keep SD operation labels tightly aligned with DCD method names to minimize AI validator warnings and judge scrutiny.

## Final Pre-Submission Steps

1. Deploy and confirm public URL works without authentication barriers.
2. Record walkthrough video showing all 5 required diagrams and scenario mappings.
3. Replace README TODO placeholders with final links.
4. Smoke test once more with `npm run build`.
