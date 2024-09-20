export default function Loader({ centered, noMargin, width, height }) {
    return (
      <svg
        className={` text-[#fff] ${centered ? "mx-auto" : undefined} ${noMargin ? "m-auto" : "my-20"} animate-spin`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={width ? width : "40px"}
        height={height ? height : "40px"}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx={50}
          cy={50}
          fill="none"
          stroke="#fff"
          strokeWidth={10}
          r={26}
          strokeDasharray="122.52211349000194 42.840704496667314"
          transform="matrix(1,0,0,1,0,0)"
          style={{
            transform: "matrix(1, 0, 0, 1, 0, 0)",
            animationPlayState: "paused",
          }}
        />
      </svg>
    );
  }
  