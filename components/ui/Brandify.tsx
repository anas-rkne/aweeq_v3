import { Fragment } from "react";

const BRAND_PATTERN = /(3weeq)/gi;

/**
 * Brandify — renders a translated string, isolating every "3weeq"/"3WEEQ"
 * occurrence inside an LTR inline-block so the bidi algorithm never lets the
 * leading digit crash into the following letters inside Arabic text.
 */
export default function Brandify({ text }: { text: string }) {
  const parts = text.split(BRAND_PATTERN);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} dir="ltr" className="inline-block mx-1">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
