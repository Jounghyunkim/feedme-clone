# Design

Where design work starts. Decision contracts in `docs/decisions/` own every
rule; this file holds values and points at the contract that owns each element.

## Values

Source: `app/globals.css`. Update this section when that source changes.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#ffffff` | `#141414` |
| `foreground` | `#262626` | `#f6f3eb` |
| `card` | `#ffffff` | `#262626` |
| `primary` | `#fd312e` | `#fd312e` |
| `primary-foreground` | `#ffffff` | `#ffffff` |
| `secondary` | `#f0ece4` | `#4a4946` |
| `muted` | `#f6f3eb` | `#262626` |
| `muted-foreground` | `#716f6a` | `#cbc8c2` |
| `accent` | `#f6f3eb` | `#4a4946` |
| `destructive` | `#a50034` | `#ff6b66` |
| `border` | `#e6e1d6` | `oklch(1 0 0 / 10%)` |
| `input` | `#cbc8c2` | `oklch(1 0 0 / 15%)` |
| `ring` | `#fd312e` | `#fd312e` |

Text roles: sans `Inter` (`--font-sans`), mono `Geist Mono` (`--font-mono`), heading uses the sans font.
Radius and spacing: `--radius` `0.625rem`; spacing follows the Tailwind scale.

## Components

Source: `components/ui`. Update this section when it changes.

- `Button`

## Rejected patterns

- Hex colors written directly in screens → [brand-identity](docs/decisions/brand-identity.md)
- Redrawn or recolored LG logo → [brand-identity](docs/decisions/brand-identity.md)
- LG signature gradients in UI states → [brand-identity](docs/decisions/brand-identity.md)
- Custom markup for UI shadcn already provides → [ui-composition](docs/decisions/ui-composition.md)
- Per-screen arbitrary colors or spacing overrides → [ui-composition](docs/decisions/ui-composition.md)

## Map

- Brand colors and semantic color tokens → [brand-identity](docs/decisions/brand-identity.md)
- Error and destructive color → [brand-identity](docs/decisions/brand-identity.md)
- LG CI logo and app header lockup → [brand-identity](docs/decisions/brand-identity.md)
- General UI components and variants → [ui-composition](docs/decisions/ui-composition.md)
- Page shell, width, and section spacing → [ui-composition](docs/decisions/ui-composition.md)
- Loading, empty, error, success, and disabled states → [ui-composition](docs/decisions/ui-composition.md)
- Narrow-screen layout → [ui-composition](docs/decisions/ui-composition.md)
