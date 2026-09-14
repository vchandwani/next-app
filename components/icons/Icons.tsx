type IconName = "arrow-down" | "audience" | "calendar" | "clock" | "file" | "globe" | "mode" | "next" | "pin" | "vercel" | "window";

type IconsProps = {
  name: IconName;
  className?: string;
  size?: number;
  width?: number;
  height?: number;
};

export function Icons({ name, className, size = 24, width, height }: IconsProps) {
  const iconProps = {
    className,
    width: width || size,
    height: height || size,
    fill: "none",
    stroke: "currentColor",
    "aria-hidden": true,
  } as const;

  switch (name) {
    case "arrow-down":
      return (
        <svg {...iconProps} viewBox="0 0 25 24">
          <path d="M12.5 18V4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.20866 12.0001C5.20866 12.0001 10.5788 19 12.5003 19C14.4218 19 19.792 12 19.792 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "audience":
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <path d="M7.02061 11.0049H13.0234V9.00488H15.0229V3.00103H13.0234V1.00488H7.02061V3.00488H5.02399V9.00873H7.02061V11.0049ZM13.0229 3.00488V9.00488H7.02399V3.00488H13.0229Z" strokeWidth="1.5" />
          <path d="M17.0234 13.0049V11.0064H15.0234V13.0064H17.0234V17.0049H3.02344V13.0049H5.02344V11.0049H3.02344V13.0034H1.02344V19.0049H19.0234V13.0049H17.0234Z" strokeWidth="1.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...iconProps} viewBox="0 0 16 16">
          <path d="M2 2.5h12v11H2z" strokeWidth="1.5" />
          <path d="M2 5.5h12M4.5 1v3M11.5 1v3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "clock":
      return (
        <svg {...iconProps} viewBox="0 0 16 16">
          <path d="M2.16667 0.5H13.8333V2.16667H15.5V13.8333H13.8333V15.5H2.16667V13.8333H0.5V2.16667H2.16667V0.5Z" strokeWidth="1.5" />
          <path d="M7.16667 3.83333V8.83333H12.1667" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mode":
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <path d="M13.0192 13.0049H17.0192V11.0049H3.01919V13.0049H7.01919V17.0049H1.02344V19.0049H19.0192V17.0049H13.0192V13.0049Z" strokeWidth="1.5" />
          <path d="M3.01855 1.00488H17.0186V3.00488H3.01855V1.00488Z" strokeWidth="1.5" />
          <path d="M3.01813 3.00098H1.01813V10.9997H3.01813V3.00098ZM17.0191 3.0061V11.0048H19.0191V3.0061H17.0191Z" strokeWidth="1.5" />
          <path d="M13.0186 5.00488H15.0186V7.00488H13.0186V5.00488Z" strokeWidth="1.5" />
        </svg>
      );
    case "pin":
      return (
        <svg {...iconProps} viewBox="0 0 16 18">
          <path d="M3.94996 0.899902H12.05V2.5199H3.94996V0.899902ZM2.32996 4.1399V2.5199H3.94996V4.1399H2.32996ZM2.32996 10.6199H0.709961V4.1399H2.32996V10.6199ZM3.94996 12.2399H2.32996V10.6199H3.94996V12.2399ZM5.56996 13.8599H3.94996V12.2399H5.56996V13.8599ZM7.18996 15.4799H5.56996V13.8599H7.18996V15.4799ZM8.80996 15.4799V17.0999H7.18996V15.4799H8.80996ZM10.43 13.8599V15.4799H8.80996V13.8599H10.43V13.8599ZM12.05 12.2399V13.8599H10.43V12.2399H12.05ZM13.67 10.6199V12.2399H12.05V10.6199H13.67ZM13.67 4.1399H15.29V10.6199H13.67V4.1399ZM13.67 4.1399V2.5199H12.05V4.1399H13.67ZM9.61996 5.7599H6.37996V8.9999H9.61996V5.7599Z" strokeWidth="1.5" />
        </svg>
      );
    case "file":
      return (
        <svg {...iconProps} viewBox="0 0 16 16">
          <path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5ZM13 13.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-12h5v5h5V13.5ZM9.5 5V2.12L12.38 5H9.5ZM5.13 5h-.62v1.25h2.12V5H5.13ZM4.5 8h7.12v1.25H4.5V8ZM5.13 11h-.62v1.25h7.12V11H5.13Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      );
    case "globe":
      return (
        <svg {...iconProps} viewBox="0 0 16 16">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="currentColor" />
        </svg>
      );
    case "next":
      return (
        <svg {...iconProps} viewBox="0 0 394 80">
          <path fill="currentColor" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z" />
          <path fill="currentColor" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z" />
        </svg>
      );
    case "vercel":
      return (
        <svg {...iconProps} viewBox="0 0 1155 1000">
          <path d="m577.3 0 577.4 1000H0z" fill="currentColor" />
        </svg>
      );
    case "window":
      return (
        <svg {...iconProps} viewBox="0 0 16 16">
          <path fillRule="evenodd" clipRule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="currentColor" />
        </svg>
      );
  }
}