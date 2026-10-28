import type { FC } from "react";
import styles from "./footer-art-banner.module.css";

export const FooterArtBanner: FC = () => {
  return (
    <div className={styles.artContainer} aria-hidden="true">
      <svg
        className={styles.artSvg}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 200"
        focusable="false"
      >
        <defs>
          <pattern
            id="ui-atlas-footer-shapes"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(0.85)"
          >
            <g fill="currentColor">
              <circle cx="4.5" cy="4.5" r="2.8" opacity="0.48" />
              <rect x="11" y="2" width="5" height="5" opacity="0.7" />
              <path d="M22.5 1.5l3 5.5h-6z" opacity="0.92" />
              <circle cx="31.5" cy="4.5" r="2.8" opacity="0.59" />
              <path d="M4.5 10.5l3 5.5h-6z" opacity="0.81" />
              <circle cx="13.5" cy="13.5" r="2.8" opacity="0.48" />
              <rect x="20" y="11" width="5" height="5" opacity="0.7" />
              <path d="M31.5 10.5l3 5.5h-6z" opacity="0.92" />
              <rect x="2" y="20" width="5" height="5" opacity="0.59" />
              <path d="M13.5 19.5l3 5.5h-6z" opacity="0.81" />
              <circle cx="22.5" cy="22.5" r="2.8" opacity="0.48" />
              <rect x="29" y="20" width="5" height="5" opacity="0.7" />
              <circle cx="4.5" cy="31.5" r="2.8" opacity="0.92" />
              <rect x="11" y="29" width="5" height="5" opacity="0.59" />
              <path d="M22.5 28.5l3 5.5h-6z" opacity="0.81" />
              <circle cx="31.5" cy="31.5" r="2.8" opacity="0.48" />
            </g>
          </pattern>

          <mask id="ui-atlas-footer-mask">
            <rect width="100%" height="100%" fill="white" />
            <text
              x="50%"
              y="165"
              textAnchor="middle"
              fill="black"
              fontFamily="Space Grotesk, Inter, system-ui, sans-serif"
              fontWeight="800"
              fontSize="165"
              letterSpacing="-0.04em"
            >
              UI Atlas
            </text>
          </mask>
        </defs>

        <g fill="currentColor">
          <rect
            width="100%"
            height="100%"
            fill="url(#ui-atlas-footer-shapes)"
            mask="url(#ui-atlas-footer-mask)"
          />
        </g>
      </svg>
    </div>
  );
};
