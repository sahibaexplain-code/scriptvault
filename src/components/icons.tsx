import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
});
const mk = (d: React.ReactNode) => function Icon({ size, ...p }: P) { return <svg {...base(size)} {...p}>{d}</svg>; };

export const IconCart = mk(<><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" /><circle cx="10" cy="20.5" r="1" /><circle cx="17" cy="20.5" r="1" /></>);
export const IconSearch = mk(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const IconMenu = mk(<><path d="M4 7h16M4 12h16M4 17h10" /></>);
export const IconX = mk(<><path d="M6 6l12 12M18 6 6 18" /></>);
export const IconArrow = mk(<><path d="M5 12h14M13 6l6 6-6 6" /></>);
export const IconCheck = mk(<><path d="m5 12.5 4.5 4.5L19 7.5" /></>);
export const IconClock = mk(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const IconGlobe = mk(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5s1.1-5.9 3.6-8.5Z" /></>);
export const IconText = mk(<><path d="M5 6h14M5 10h14M5 14h9M5 18h6" /></>);
export const IconEye = mk(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></>);
export const IconDownload = mk(<><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></>);
export const IconShield = mk(<><path d="M12 3 5 6v5.5c0 4.3 3 7.7 7 9.5 4-1.8 7-5.2 7-9.5V6l-7-3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>);
export const IconLock = mk(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" /></>);
export const IconStar = mk(<path d="m12 3.8 2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.4l-5.1 2.8L8 13.6 3.8 9.7l5.7-.7L12 3.8Z" fill="currentColor" stroke="none" />);
export const IconFile = mk(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>);
export const IconSpark = mk(<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />);
export const IconUser = mk(<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20.5c1.3-3.6 4-5.3 7.5-5.3s6.2 1.7 7.5 5.3" /></>);
export const IconFilter = mk(<><path d="M4 6h16M7 12h10M10 18h4" /></>);
export const IconPen = mk(<><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></>);
export const IconTrash = mk(<><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></>);
export const IconBolt = mk(<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />);
export const IconLayers = mk(<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>);
