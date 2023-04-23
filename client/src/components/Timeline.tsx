import React from "react";
import { Timeline } from "antd";

const Time: React.FC = () => {
  return (
    <Timeline
      mode={"left"}
      items={[
        {
          label: (
            <a href="#" onClick={() => changeVideo(0)}>
              00:00
            </a>
          ),
          children: "Create a services",
        },
        {
          label: (
            <a href="#" onClick={() => changeVideo(120)}>
              02:00
            </a>
          ),
          children: "Solve initial network problems",
        },
        {
          children: "Technical testing",
        },
        {
          label: (
            <a href="#" onClick={() => changeVideo(180)}>
              03:00
            </a>
          ),
          children: "Network problems being solved",
        },
      ]}
    />
  );
};

export default Time;
function changeVideo(time: number): void {
  console.log(time);
}
