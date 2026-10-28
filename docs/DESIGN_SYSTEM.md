# UI Atlas design system

## Direction

The application uses a near-black canvas with neon red and electric indigo accents, crisp pixel-inspired typography, and restrained surface depth. Shared navigation, page controls, and specimen frames keep this visual language consistent. Live examples keep their own palettes and interaction styles inside those frames.

## Color tokens

These semantic values are scoped to the shared application shell in `src/components/layout/site-shell.module.css`; `src/app/globals.css` retains document-wide foundations and the light base values used outside the shell.

| Token | Value | Use |
| --- | --- | --- |
| `--page` | `#08080d` | Main application canvas |
| `--surface` | `#10121c` | Cards and raised controls |
| `--surface-soft` | `#161826` | Secondary panels and controls |
| `--ink` | `#f8fafc` | Primary text |
| `--ink-soft` | `#cbd5e1` | Supporting text |
| `--muted` | `#94a3b8` | Labels and secondary text |
| `--line` | `rgba(255, 255, 255, 0.08)` | Borders and separators |
| `--accent` | `#7865ff` | Indigo actions and highlights |
| `--accent-strong` | `#a99cff` | Strong accent text and hover |
| `--accent-wash` | `rgba(120, 101, 255, 0.14)` | Selected and accent surfaces |
| `--brand-neon-red` | `#ff334f` | Primary actions and motion cues |
| `--success` | `#59d6a0` | Success indicators |
| `--warning` | `#f5bd62` | Warning indicators |
| `--focus` | `#ff6479` | Keyboard focus outline |

Keep normal text at WCAG AA contrast and never communicate a state through shadow or color alone.

## Typography

| Family | Role |
| --- | --- |
| Pixelify Sans | Brand, selected display headings, and short expressive labels |
| Inter | Body copy, navigation, forms, and controls |
| JetBrains Mono | IDs, category labels, small metadata, and technical notes |

The three families use Next.js font loading with a system fallback and `display: swap`. Pixelify Sans is intentionally limited to short text. Suggested scales are 12–14px for labels, 14–16px for body copy, 18–32px for section headings, and 48–96px for the home display heading. Keep body line-height around 1.55–1.7.

## Spacing and geometry

- Use a 4px base unit and an 8px primary rhythm; common steps are 4, 8, 12, 16, 24, 32, 48, and 64px.
- Use 6px corners for compact controls and 10–14px corners for page cards and stages; preview examples can use shapes that fit their own style.
- Use thin, visible borders for controls and cards. Pixel marks are small, intentional details rather than a full-page texture.
- Application raised surface: `0 18px 48px -28px rgba(0, 0, 0, 0.85)` with a subtle inset highlight.
- Application inset surface: a dark inset plus a faint top edge; preserve visible control borders.
- Keep shadows close to the object and tint hover glows toward the active indigo or red accent.

## Component states

- **Buttons and links:** clear boundaries or underlines, restrained hover change, visible focus outline, and a useful disabled state when used.
- **Search fields:** inset dark surface, visible border, label for assistive technology, and focus-within ring.
- **Cards:** dark surface, thin cool border, compact ambient shadow, and modest indigo lift on hover. Content and title links remain visible without hover.
- **Navigation:** text and icon together, comfortable target size, and obvious hover/focus treatment. The sticky header spans the viewport while its contents align to the shared content frame. Keep a dark, strongly tinted translucent surface with a soft blur and restrained indigo/red reflections; retain enough opacity for foreground content to read clearly. Keep subordinate links visually light and tint only the primary action. Respect reduced-transparency preferences. Mobile keeps primary destinations in a thumb-reachable glass bottom bar. Within the Library, use a fixed desktop category rail aligned directly below the shared header, with a reserved content gutter and unnumbered category links; show the current category as its only heading and hide the rail when the shared footer enters view. Narrow screens use a compact fixed category drawer that also clears before the footer.
- **Badges:** short mono label with a border and sufficient text contrast.
- **Selected state:** accent wash plus border or icon; do not use color alone.

## Responsive behavior

The shared shell uses a centered fluid frame capped at 108rem, reducing unused side gutters on wide displays. The fixed Library rail aligns to that frame and its content reserve; Library cards switch to one column around tablet widths, then add columns only when cards retain a comfortable reading width. The home hero expands its atmospheric frame while keeping copy at a readable measure. Grids collapse at tablet and phone widths, and navigation labels remain available on mobile. Keep touch controls at least about 38px high and allow text to wrap without horizontal page overflow.

## Motion and accessibility

- Use short CSS transitions for hover and focus. Avoid continuous movement and large panning or scaling.
- Match the landing page's typography motion on secondary routes with the existing kinetic text effects: a restrained letter ripple on headings, a slow shimmer on short introductory copy, and a brief scramble on specimen titles. Keep controls and long supporting copy static.
- Disable kinetic typography motion when `prefers-reduced-motion: reduce` is active; effects remain decorative and all text stays available as readable HTML.
- The scroll-note reveal is optional, guarded by `@supports (animation-timeline: view())`, and disabled for `prefers-reduced-motion: reduce`.
- Shared page reveals use the existing `ScrollReveal` observer for headings, page sections, and staggered result cards. Keep the entrance brief and subtle: a small rise, fade, and soft focus transition; keep hover lifts local to the card, and make focus-within use the same visual feedback.
- Preserve native keyboard behavior for form controls. Use semantic headings, landmarks, and labels.
- Maintain visible focus and verify readable contrast for text and control boundaries. Shadows supplement borders; they do not replace them.

## Global and local styling

Global CSS owns Tailwind's import and token mapping, shared variables, a small reset, document defaults, focus, selection, and reduced-motion foundations. CSS Modules own each page, shared component, and example preview. Use Tailwind utilities for simple layout only when that keeps the component clearer; do not duplicate the same design across utilities, module CSS, and global selectors.

## Extending the system

Use the shared tokens for Atlas chrome and place substantial unique styling in a colocated module. A library example can intentionally use glass, brutalist, editorial, or other visual language. Keep that style scoped to its preview and document its responsive behavior, interactions, assets, and reuse terms in catalog metadata.
