# Motion

Principles: calm, quick, purposeful. Motion clarifies an action or a number; it never decorates money figures or compliance copy. All motion switches off under `prefers-reduced-motion: reduce` (see the end of `app/globals.css`).

| Where | What | Duration | Easing | Trigger | Implementation |
| --- | --- | --- | --- | --- | --- |
| Hero | Headline, sub, CTAs fade up 28px, staggered 0.1s / 0.25s / 0.4s | 900ms | cubic-bezier(.2,.7,.2,1) | Page load | `.anim-in .anim-d1..3` |
| Logo dot | Soft lime pulse ring | 2.4s loop | ease-out | Always | `.pulse-dot` |
| Nav | Height 80 to 64px (mobile 64 to 56), translucent blurred background, shadow | 300ms | default | Scroll past 40px | `Nav.tsx` state |
| Supported assets | Continuous horizontal loop, pauses on hover | 38s loop | linear | Always | `.marquee-track` |
| Headlines and cards | Fade up 28px, cards staggered by 80ms | 800ms | cubic-bezier(.2,.7,.2,1) | First time in view | `<Reveal>` |
| Cards | Lift 6px + `--shadow-pop`; privacy icon tilts -8deg, scale 1.08 | 300ms | cubic-bezier(.2,.7,.2,1) | Hover | `.lift`, `.icon-pop` |
| Privacy icons | Outline draws in | 1.1s, 0.2s delay | ease-out | Card revealed | `.draw` (stroke-dashoffset) |
| Getting started | Green line fills left to right across the steps | 1.4s | cubic-bezier(.2,.7,.2,1) | Row revealed | `.stepbar` (scaleX) |
| Learn more links | Arrow nudges 4px right | 250ms | default | Hover | `.arrow-nudge` |
| Buttons | Press to scale 0.98 | 150ms | ease-out | Active | Tailwind `active:scale-[0.98]` |
| Calculator: result | Counts to the new value | 420ms | ease-out cubic | Amount or currency change | `useCountUp` |
| Calculator: result panel | Green ring pulses once | 900ms | ease-out | New quote lands, lock refresh | `.flash-a/.flash-b` |
| Calculator: switch | Button rotates 180deg per click | 450ms | cubic-bezier(.2,.7,.2,1) | Click | inline `transform` |
| Calculator: rate lock | Ring + seconds count down from 30 | 30s, 200ms steps | linear | Continuous, restarts on change | SVG `stroke-dashoffset` |
| Calculator: invalid input | Red inset outline + horizontal shake | 400ms | ease-out | Non-numeric input | `.shake-a/.shake-b` |
| Calculator: CTA | Spinner, then tick with confirmation, then resets | 1.4s + 2.8s | | Click | component state |
| Calculator card | Floats 10px up and down | 7s loop | ease-in-out | Always | `.float` |
| Final CTA | Soft light sweeps across the lime panel | 6s loop | linear | Always | `.shine` |

Rules:

- Interactions 150 to 450ms, entrances 600 to 900ms.
- Animate `transform` and `opacity`. Documented exceptions: SVG `stroke-dashoffset` (tiny), nav height (once), background-position on the CTA panel.
- At most two looping animations visible at once. If the page feels busy, remove `.shine` first, then `.float`.
- Class pairs (`-a` / `-b`) restart an animation without remounting the element, which keeps keyboard focus in the calculator.
