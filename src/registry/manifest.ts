import type { RegisteredExample } from "./types";
import { categoryDefinitions } from "@/features/catalog/data/categories";

// Existing 12 components
import FieldnoteGradientHero from "./examples/hero-sections/fieldnote-gradient-hero";
import FrostedBriefingCard from "./examples/cards/frosted-briefing-card";
import HardEdgeDispatchPanel from "./examples/dashboards/hard-edge-dispatch-panel";
import QuietModeControls from "./examples/buttons/quiet-mode-controls";
import ScrollingFieldNote from "./examples/scroll-animations/scrolling-field-note";
import FloatingDockNav from "./examples/navigation/floating-dock-nav";
import TiltSpecimenCard from "./examples/cards/tilt-specimen-card";
import AuroraMeshAmbient from "./examples/backgrounds/aurora-mesh-ambient";
import TierSliderPricing from "./examples/pricing/tier-slider-pricing";
import StackedCommandInput from "./examples/forms/stacked-command-input";
import EditorialPullquoteCard from "./examples/testimonials/editorial-pullquote-card";
import BentoFeatureShowcase from "./examples/complete-layouts/bento-feature-showcase";

// Group A: Interactive Controls & Navigation
import MagneticActionButton from "./examples/buttons/magnetic-action-button";
import MorphingNavigationTabs from "./examples/navigation/morphing-navigation-tabs";
import CommandPaletteOverlay from "./examples/navigation/command-palette-overlay";
import RadialActionMenu from "./examples/navigation/radial-action-menu";
import ScrollspyReadingNavigation from "./examples/navigation/scrollspy-reading-navigation";

// Group B: Experimental Typography & Text Effects
import SplitFlapDisplay from "./examples/text-effects/split-flap-display";
import DecryptedHeading from "./examples/text-effects/decrypted-heading";
import VariableProximityTypography from "./examples/text-effects/variable-proximity-typography";
import ScrollRevealEditorialHeading from "./examples/text-effects/scroll-reveal-editorial-heading";

// Group C: Generative Backgrounds & Visual Effects
import InteractivePixelTerrain from "./examples/backgrounds/interactive-pixel-terrain";
import DottedNetworkField from "./examples/backgrounds/dotted-network-field";
import { TopographicContourField } from "./examples/backgrounds/topographic-contour-field";
import { LiquidChromeOrb } from "./examples/backgrounds/liquid-chrome-orb";

// Group D: Cards, Media & Large-Scale Layouts
import { SpotlightBorderPanel } from "./examples/cards/spotlight-border-panel";
import { StackedScrollGallery } from "./examples/scroll-animations/stacked-scroll-gallery";
import { BeforeAfterMediaSlider } from "./examples/cards/before-after-media-slider";
import { MomentumCardCarousel } from "./examples/cards/momentum-card-carousel";
import { ScrollExpansionMediaHero } from "./examples/hero-sections/scroll-expansion-media-hero";

// Group E: Dashboards, Data & Developer Interfaces
import { KpiSparklineGrid } from "./examples/dashboards/kpi-sparkline-grid";
import { RadialProgressDashboard } from "./examples/dashboards/radial-progress-dashboard";
import { ActivityHeatmapCalendar } from "./examples/dashboards/activity-heatmap-calendar";
import { InteractiveKanbanBoard } from "./examples/complete-layouts/interactive-kanban-board";
import { DeveloperCommandTerminal } from "./examples/dashboards/developer-command-terminal";

// Group F: Forms, Inputs & Feedback
import { MultiStepOnboardingWizard } from "./examples/forms/multi-step-onboarding-wizard";
import { DragDropFileUploader } from "./examples/forms/drag-drop-file-uploader";
import { SegmentedVerificationInput } from "./examples/forms/segmented-verification-input";
import { NotificationToastStack } from "./examples/buttons/notification-toast-stack";

// Group G: Marketing Sections & Information Presentation
import { InfiniteLogoMarquee } from "./examples/complete-layouts/infinite-logo-marquee";
import { InteractiveProjectTimeline } from "./examples/complete-layouts/interactive-project-timeline";
import { TestimonialMasonryWall } from "./examples/testimonials/testimonial-masonry-wall";

// Phase 7: React Bits Visual Backgrounds & Shaders
import ThreadsField from "./examples/backgrounds/threads-field";
import QuantumParticles from "./examples/backgrounds/quantum-particles";
import FluidWaves from "./examples/backgrounds/fluid-waves";
import LetterGlitch from "./examples/backgrounds/letter-glitch";
import DotGridMotion from "./examples/backgrounds/dot-grid-motion";
import BayerDither from "./examples/backgrounds/bayer-dither";
import DarkVeilAmbient from "./examples/backgrounds/dark-veil-ambient";
import LuminousBeams from "./examples/backgrounds/luminous-beams";

// Phase 7: React Bits Kinetic Typography & Text Effects
import BlurTextReveal from "./examples/text-effects/blur-text-reveal";
import CountUpTicker from "./examples/text-effects/count-up-ticker";
import CircularTextOrbit from "./examples/text-effects/circular-text-orbit";
import ShinyTextBadge from "./examples/text-effects/shiny-text-badge";

// Phase 8: Batch 1 - Visual Backgrounds & Field Shaders
import PrismChromaticBurst from "./examples/backgrounds/prism-chromatic-burst";
import LightningEnergyMesh from "./examples/backgrounds/lightning-energy-mesh";
import HyperspeedLightTunnel from "./examples/backgrounds/hyperspeed-light-tunnel";
import FaultyPhosphorCrt from "./examples/backgrounds/faulty-phosphor-crt";
import PlasmaFilamentAmbient from "./examples/backgrounds/plasma-filament-ambient";
import SilkWaveFabric from "./examples/backgrounds/silk-wave-fabric";
import PixelGridSnow from "./examples/backgrounds/pixel-grid-snow";
import CausticsRippleGrid from "./examples/backgrounds/caustics-ripple-grid";
import GridDistortionWarp from "./examples/backgrounds/grid-distortion-warp";
import IridescentFilmFlow from "./examples/backgrounds/iridescent-film-flow";

// Phase 8: Batch 2 - Kinetic Typography & Text Effects
import AsciiMatrixTransform from "./examples/text-effects/ascii-matrix-transform";
import CurvedLoopMarquee from "./examples/text-effects/curved-loop-marquee";
import FuzzyNeonBloom from "./examples/text-effects/fuzzy-neon-bloom";
import CyberGlitchSlice from "./examples/text-effects/cyber-glitch-slice";
import FlowingGradientText from "./examples/text-effects/flowing-gradient-text";
import PhraseFlipper3d from "./examples/text-effects/phrase-flipper-3d";
import ScrollVelocityMarquee from "./examples/text-effects/scroll-velocity-marquee";
import OpticalFocusHeadline from "./examples/text-effects/optical-focus-headline";

// Phase 8: Batch 3 - Animations & Tactile Interactions
import RadialSparkBurst from "./examples/buttons/radial-spark-burst";
import HolographicGlareCard from "./examples/cards/holographic-glare-card";
import PixelMatrixDissolve from "./examples/cards/pixel-matrix-dissolve";
import PlasmaBorderOutline from "./examples/buttons/plasma-border-outline";
import ElasticParticleTrail from "./examples/animations/elastic-particle-trail";
import MagneticSpringChip from "./examples/buttons/magnetic-spring-chip";
import MorphingBlurGeometry from "./examples/animations/morphing-blur-geometry";
import LiquidMetaballCluster from "./examples/animations/liquid-metaball-cluster";

// Phase 8: Batch 4 - Reusable UI, Cards, Navigation & Galleries
import FannedDeckStack from "./examples/cards/fanned-deck-stack";
import SpotlightMediaGrid from "./examples/cards/spotlight-media-grid";
import TactileFolderIndex from "./examples/navigation/tactile-folder-index";
import RefractiveGlassDock from "./examples/navigation/refractive-glass-dock";
import LiquidIndicatorNav from "./examples/navigation/liquid-indicator-nav";
import PerspectiveRingGallery from "./examples/complete-layouts/perspective-ring-gallery";
import StepperSliderControl from "./examples/forms/stepper-slider-control";
import DecayThresholdCard from "./examples/cards/decay-threshold-card";

// Re-export category definitions from catalog data for backwards compatibility
export { categoryDefinitions };

// Static imports keep preview code explicit and separate from catalog metadata.
export const exampleRegistry = {
  // Existing 12 Examples
  "fieldnote-gradient-hero": { category: "hero-sections", preview: FieldnoteGradientHero },
  "frosted-briefing-card": { category: "cards", preview: FrostedBriefingCard },
  "hard-edge-dispatch-panel": { category: "dashboards", preview: HardEdgeDispatchPanel },
  "quiet-mode-controls": { category: "buttons", preview: QuietModeControls },
  "scrolling-field-note": { category: "scroll-animations", preview: ScrollingFieldNote },
  "floating-dock-nav": { category: "navigation", preview: FloatingDockNav },
  "tilt-specimen-card": { category: "cards", preview: TiltSpecimenCard },
  "aurora-mesh-ambient": { category: "backgrounds", preview: AuroraMeshAmbient },
  "tier-slider-pricing": { category: "pricing", preview: TierSliderPricing },
  "stacked-command-input": { category: "forms", preview: StackedCommandInput },
  "editorial-pullquote-card": { category: "testimonials", preview: EditorialPullquoteCard },
  "bento-feature-showcase": { category: "complete-layouts", preview: BentoFeatureShowcase },

  // Group A: Interactive Controls & Navigation
  "magnetic-action-button": { category: "buttons", preview: MagneticActionButton },
  "morphing-navigation-tabs": { category: "navigation", preview: MorphingNavigationTabs },
  "command-palette-overlay": { category: "navigation", preview: CommandPaletteOverlay },
  "radial-action-menu": { category: "navigation", preview: RadialActionMenu },
  "scrollspy-reading-navigation": { category: "navigation", preview: ScrollspyReadingNavigation },

  // Group B: Experimental Typography & Text Effects
  "split-flap-display": { category: "text-effects", preview: SplitFlapDisplay },
  "decrypted-heading": { category: "text-effects", preview: DecryptedHeading },
  "variable-proximity-typography": { category: "text-effects", preview: VariableProximityTypography },
  "scroll-reveal-editorial-heading": { category: "text-effects", preview: ScrollRevealEditorialHeading },

  // Group C: Generative Backgrounds & Visual Effects
  "interactive-pixel-terrain": { category: "backgrounds", preview: InteractivePixelTerrain },
  "dotted-network-field": { category: "backgrounds", preview: DottedNetworkField },
  "topographic-contour-field": { category: "backgrounds", preview: TopographicContourField },
  "liquid-chrome-orb": { category: "backgrounds", preview: LiquidChromeOrb },

  // Group D: Cards, Media & Large-Scale Layouts
  "spotlight-border-panel": { category: "cards", preview: SpotlightBorderPanel },
  "stacked-scroll-gallery": { category: "galleries", preview: StackedScrollGallery },
  "before-after-media-slider": { category: "galleries", preview: BeforeAfterMediaSlider },
  "momentum-card-carousel": { category: "galleries", preview: MomentumCardCarousel },
  "scroll-expansion-media-hero": { category: "hero-sections", preview: ScrollExpansionMediaHero },

  // Group E: Dashboards, Data & Developer Interfaces
  "kpi-sparkline-grid": { category: "dashboards", preview: KpiSparklineGrid },
  "radial-progress-dashboard": { category: "dashboards", preview: RadialProgressDashboard },
  "activity-heatmap-calendar": { category: "dashboards", preview: ActivityHeatmapCalendar },
  "interactive-kanban-board": { category: "complete-layouts", preview: InteractiveKanbanBoard },
  "developer-command-terminal": { category: "dashboards", preview: DeveloperCommandTerminal },

  // Group F: Forms, Inputs & Feedback
  "multi-step-onboarding-wizard": { category: "forms", preview: MultiStepOnboardingWizard },
  "drag-drop-file-uploader": { category: "forms", preview: DragDropFileUploader },
  "segmented-verification-input": { category: "forms", preview: SegmentedVerificationInput },
  "notification-toast-stack": { category: "feedback", preview: NotificationToastStack },

  // Group G: Marketing Sections & Information Presentation
  "infinite-logo-marquee": { category: "complete-layouts", preview: InfiniteLogoMarquee },
  "interactive-project-timeline": { category: "timelines", preview: InteractiveProjectTimeline },
  "testimonial-masonry-wall": { category: "testimonials", preview: TestimonialMasonryWall },

  // Phase 7: React Bits Visual Backgrounds & Shaders
  "threads-field": { category: "backgrounds", preview: ThreadsField },
  "quantum-particles": { category: "backgrounds", preview: QuantumParticles },
  "fluid-waves": { category: "backgrounds", preview: FluidWaves },
  "letter-glitch": { category: "backgrounds", preview: LetterGlitch },
  "dot-grid-motion": { category: "backgrounds", preview: DotGridMotion },
  "bayer-dither": { category: "backgrounds", preview: BayerDither },
  "dark-veil-ambient": { category: "backgrounds", preview: DarkVeilAmbient },
  "luminous-beams": { category: "backgrounds", preview: LuminousBeams },

  // Phase 7: React Bits Kinetic Typography & Text Effects
  "blur-text-reveal": { category: "text-effects", preview: BlurTextReveal },
  "count-up-ticker": { category: "text-effects", preview: CountUpTicker },
  "circular-text-orbit": { category: "text-effects", preview: CircularTextOrbit },
  "shiny-text-badge": { category: "text-effects", preview: ShinyTextBadge },

  // Phase 8: Batch 1 - Visual Backgrounds & Field Shaders
  "prism-chromatic-burst": { category: "backgrounds", preview: PrismChromaticBurst },
  "lightning-energy-mesh": { category: "backgrounds", preview: LightningEnergyMesh },
  "hyperspeed-light-tunnel": { category: "backgrounds", preview: HyperspeedLightTunnel },
  "faulty-phosphor-crt": { category: "backgrounds", preview: FaultyPhosphorCrt },
  "plasma-filament-ambient": { category: "backgrounds", preview: PlasmaFilamentAmbient },
  "silk-wave-fabric": { category: "backgrounds", preview: SilkWaveFabric },
  "pixel-grid-snow": { category: "backgrounds", preview: PixelGridSnow },
  "caustics-ripple-grid": { category: "backgrounds", preview: CausticsRippleGrid },
  "grid-distortion-warp": { category: "backgrounds", preview: GridDistortionWarp },
  "iridescent-film-flow": { category: "backgrounds", preview: IridescentFilmFlow },

  // Phase 8: Batch 2 - Kinetic Typography & Text Effects
  "ascii-matrix-transform": { category: "text-effects", preview: AsciiMatrixTransform },
  "curved-loop-marquee": { category: "text-effects", preview: CurvedLoopMarquee },
  "fuzzy-neon-bloom": { category: "text-effects", preview: FuzzyNeonBloom },
  "cyber-glitch-slice": { category: "text-effects", preview: CyberGlitchSlice },
  "flowing-gradient-text": { category: "text-effects", preview: FlowingGradientText },
  "phrase-flipper-3d": { category: "text-effects", preview: PhraseFlipper3d },
  "scroll-velocity-marquee": { category: "text-effects", preview: ScrollVelocityMarquee },
  "optical-focus-headline": { category: "text-effects", preview: OpticalFocusHeadline },

  // Phase 8: Batch 3 - Animations & Tactile Interactions
  "radial-spark-burst": { category: "buttons", preview: RadialSparkBurst },
  "holographic-glare-card": { category: "cards", preview: HolographicGlareCard },
  "pixel-matrix-dissolve": { category: "cards", preview: PixelMatrixDissolve },
  "plasma-border-outline": { category: "buttons", preview: PlasmaBorderOutline },
  "elastic-particle-trail": { category: "animations", preview: ElasticParticleTrail },
  "magnetic-spring-chip": { category: "buttons", preview: MagneticSpringChip },
  "morphing-blur-geometry": { category: "animations", preview: MorphingBlurGeometry },
  "liquid-metaball-cluster": { category: "animations", preview: LiquidMetaballCluster },

  // Phase 8: Batch 4 - Reusable UI, Cards, Navigation & Galleries
  "fanned-deck-stack": { category: "cards", preview: FannedDeckStack },
  "spotlight-media-grid": { category: "cards", preview: SpotlightMediaGrid },
  "tactile-folder-index": { category: "navigation", preview: TactileFolderIndex },
  "refractive-glass-dock": { category: "navigation", preview: RefractiveGlassDock },
  "liquid-indicator-nav": { category: "navigation", preview: LiquidIndicatorNav },
  "perspective-ring-gallery": { category: "galleries", preview: PerspectiveRingGallery },
  "stepper-slider-control": { category: "forms", preview: StepperSliderControl },
  "decay-threshold-card": { category: "cards", preview: DecayThresholdCard },
} satisfies Readonly<Record<string, RegisteredExample>>;

export type ExamplePreviewKey = keyof typeof exampleRegistry;

export function getRegisteredExample(previewKey: string) {
  return Object.prototype.hasOwnProperty.call(exampleRegistry, previewKey)
    ? exampleRegistry[previewKey as ExamplePreviewKey]
    : undefined;
}

