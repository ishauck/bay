import * as React from "react"
import { SVGProps } from "react"
const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 64 40"
    fill="currentColor"
    {...props}
  >
    <g transform="scale(1.96919 1.2333)">
      <clipPath id="a">
        <path d="M0 0h32v32H0z" />
      </clipPath>
      <g clipPath="url(#a)">
        <path d="M-.398 25.946V0h2.532v10.823c.749-.695 1.619-1.093 2.546-1.093 2.803 0 5.078 3.633 5.078 8.108 0 4.476-2.275 8.108-5.078 8.108-.927 0-1.797-.398-2.546-1.092v1.092H-.398ZM4.68 13.784c-1.401 0-2.539 1.816-2.539 4.054 0 2.237 1.138 4.054 2.54 4.054 1.4 0 2.538-1.817 2.538-4.054 0-2.238-1.137-4.054-2.539-4.054ZM18.227 24.863c-.746.69-1.613 1.083-2.536 1.083-2.803 0-5.08-3.632-5.08-8.108 0-2.994 1.02-5.61 2.533-7.015.749-.695 1.618-1.093 2.547-1.093.923 0 1.79.394 2.536 1.084v-.71h2.542v15.842h-2.542v-1.083Zm0-6.846v-.357c-.059-2.155-1.173-3.876-2.536-3.876-1.402 0-2.54 1.816-2.54 4.054 0 2.237 1.138 4.054 2.54 4.054 1.363 0 2.477-1.72 2.536-3.875Z" />
        <path
          d="M43.589 13.514h3.797l3.851 9.295 4.246-9.295h3.811l-9.282 20.223h-3.838l3.049-6.518-5.634-13.705Z"
          style={{
            fillRule: "nonzero",
          }}
          transform="matrix(.68325 0 0 1.09094 -8.447 -4.805)"
        />
      </g>
    </g>
  </svg>
)
export default Logo
