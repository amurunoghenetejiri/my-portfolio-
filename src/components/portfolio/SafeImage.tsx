import { useState, type ImgHTMLAttributes } from "react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0b1a12'/>
          <stop offset='100%' stop-color='#0a0f0c'/>
        </linearGradient>
      </defs>
      <rect width='400' height='300' fill='url(#g)'/>
      <g fill='none' stroke='#34d39955' stroke-width='1.2'>
        <circle cx='200' cy='150' r='42'/>
        <circle cx='200' cy='150' r='68' opacity='.5'/>
      </g>
      <text x='50%' y='58%' text-anchor='middle' fill='#34d399' font-family='ui-sans-serif' font-size='13' letter-spacing='4'>D4 TECH</text>
    </svg>`,
  );

type Props = ImgHTMLAttributes<HTMLImageElement> & { fallback?: string };

export function SafeImage({ fallback = FALLBACK, onError, src, loading = "lazy", ...rest }: Props) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      {...rest}
      loading={loading}
      src={errored || !src ? fallback : src}
      onError={(e) => {
        setErrored(true);
        onError?.(e);
      }}
    />
  );
}
