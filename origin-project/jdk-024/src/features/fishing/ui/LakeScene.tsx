import type { Session, SpotId } from "../../../shared/types";
export function LakeScene({
  session,
  spot,
}: {
  session: Session;
  spot: SpotId;
}) {
  const active = ["waiting", "bite", "fighting"].includes(session.phase);
  const x = 460 + session.castPower * 160;
  const y = 250 - session.castPower * 50;
  return (
    <svg
      className={"lake-scene scene-" + spot}
      viewBox="0 0 1000 510"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="远山环绕的宁静湖面，前景是木质钓台与鱼竿"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="1">
          <stop stopColor="#dceaf0" />
          <stop offset="1" stopColor="#f4ede0" />
        </linearGradient>
        <linearGradient id="lake" x2="0" y2="1">
          <stop stopColor="#a5c6c8" />
          <stop offset="1" stopColor="#5e999c" />
        </linearGradient>
        <linearGradient id="mountain" x2="0" y2="1">
          <stop stopColor="#91aeb2" />
          <stop offset="1" stopColor="#aec5c6" />
        </linearGradient>
        <pattern
          id="grain"
          width="85"
          height="23"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M3 8h24m20 9h32"
            stroke="#d1e1d7"
            strokeWidth="1"
            opacity=".32"
          />
        </pattern>
      </defs>
      <rect width="1000" height="510" fill="url(#sky)" />
      <circle cx="761" cy="75" r="31" fill="#fff6da" opacity=".85" />
      <path
        d="M0 152L100 90 191 142 285 61 408 157 492 102 601 171 731 83 838 143 931 113 1000 159V240H0Z"
        fill="#c5d4d4"
      />
      <path
        d="M0 179L130 131 211 170 323 119 468 187 584 154 682 191 811 135 1000 185V257H0Z"
        fill="url(#mountain)"
      />
      <path
        d="M0 211Q105 188 220 211T474 214T720 217T1000 214V510H0Z"
        fill="url(#lake)"
      />
      <path
        d="M0 237Q210 215 427 239T1000 244"
        fill="none"
        stroke="#e1e9de"
        opacity=".6"
      />
      <rect y="239" width="1000" height="271" fill="url(#grain)" />
      <g fill="#628c86">
        <path d="M0 270V145l17 53 18-87 27 97 18-56 19 97 28-52 21 56 30-37 37 38Z" />
        <path d="M1000 279V136l-24 64-17-89-22 102-28-50-19 86-27-46-20 51-28-15-20 30Z" />
      </g>
      <g fill="#517f76">
        <path d="M0 331V228l27 26 16-68 29 98 30-38 24 52 32-12 28 45Z" />
        <path d="M1000 334V228l-27 26-16-68-29 98-30-38-24 52-32-12-28 48Z" />
      </g>
      <g stroke="#e8efdf" fill="none" opacity=".35">
        <path d="M300 283h77m313 45h91M175 360h94m290-64h39m-252 98h78" />
        <ellipse cx="600" cy="305" rx="57" ry="5" />
        <ellipse cx="484" cy="367" rx="39" ry="4" />
      </g>
      <path d="M0 510V415q100-35 190 8l137 87Z" fill="#476f62" />
      <path d="M1000 510V423q-108-48-187 0L686 510Z" fill="#476f62" />
      <g stroke="#a1ad79" strokeWidth="3" fill="none">
        <path d="M45 465q15-80-10-104m27 95q-4-66 23-96m-5 101q30-59 21-84M939 460q-20-76 7-103m-30 112q-18-68-39-75m63 84q2-58 31-76" />
      </g>
      <path d="M307 510L394 411H610L718 510Z" fill="#a58e72" />
      <g stroke="#756f5d" opacity=".55">
        <path d="M379 429H630M365 445H648M348 466H670M326 491H697M448 412L415 510M552 412L603 510" />
      </g>
      <path
        d="M319 510L403 418H607"
        stroke="#d5c1a2"
        fill="none"
        strokeWidth="4"
      />
      <path d="M447 510L528 331" stroke="#3d5b59" strokeWidth="7" />
      <path d="M455 494L528 331" stroke="#d2b279" strokeWidth="2" />
      <circle
        cx="470"
        cy="466"
        r="11"
        fill="#385453"
        stroke="#adc0b5"
        strokeWidth="3"
      />
      {active && (
        <>
          <path
            d={`M528 331Q565 200 ${x} ${y}`}
            fill="none"
            stroke="#f3f3df"
            strokeWidth="1.2"
          />
          <g className={session.phase === "bite" ? "bobber biting" : "bobber"}>
            <ellipse
              cx={x}
              cy={y + 9}
              rx="29"
              ry="5"
              stroke="#ecf3de"
              fill="none"
              opacity=".75"
            />
            <ellipse
              cx={x}
              cy={y + 9}
              rx="15"
              ry="3"
              stroke="#ecf3de"
              fill="none"
            />
            <path d={`M${x} ${y - 8}v16`} stroke="#e8ece0" strokeWidth="4" />
            <path d={`M${x} ${y - 9}v7`} stroke="#d17658" strokeWidth="4" />
          </g>
        </>
      )}
      <g fill="#758e8c">
        <path d="M677 92q9-9 18 0-8-4-18 0m35 9q8-9 16-1-8-3-16 1" />
      </g>
    </svg>
  );
}
