import { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="32" height="32" rx="8" fill="#020617" />
    <path
      d="M9 22C9 16.4772 13.4772 12 19 12H23V16H19C15.6863 16 13 18.6863 13 22H9Z"
      fill="white"
    />
    <path
      d="M9 10C9 13.866 12.134 17 16 17C19.866 17 23 13.866 23 10C23 6.13401 19.866 3 16 3C12.134 3 9 6.13401 9 10Z"
      fill="#38BDF8"
    />
  </svg>
);

