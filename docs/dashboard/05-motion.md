# Motion

Calm and quick. Only `transform` and `opacity` animate (plus bar heights in the chart). Everything turns off under `prefers-reduced-motion`.

| Where | What | Duration | Easing |
| --- | --- | --- | --- |
| Screen change | Content fades up 10px | 350ms | cubic-bezier(.2,.7,.2,1) |
| Modal open | Backdrop fades; dialog rises 16px and scales from 0.98 | 200ms / 300ms | ease-out / cubic-bezier(.2,.7,.2,1) |
| Chart range change | Bars grow to new heights | 600ms | cubic-bezier(.2,.7,.2,1) |
| Buttons | Press to 0.98 scale | 150ms | ease-out |
| Quick actions | Lift 2px with card shadow on hover | 150ms | default |
| Nav, tabs, chips | Colour change on hover and select | 150ms | default |
