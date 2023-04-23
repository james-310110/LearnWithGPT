import React from "react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";

const treeData: DataNode[] = [
  {
    title: "parent 1",
    key: "0-0",
    icon: <SmileOutlined />,
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          {
            title: "leaf",
            key: "0-0-0-0",
          },
          {
            title: "leaf",
            key: "0-0-0-1",
          },
          {
            title: "leaf",
            key: "0-0-0-2",
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: "leaf",
            key: "0-0-1-0",
          },
        ],
      },
      {
        title: "parent 1-2",
        key: "0-0-2",
        icon: <SmileOutlined />,
        children: [
          {
            title: "leaf",
            key: "0-0-2-0",
          },
          {
            title: "leaf",
            key: "0-0-2-1",
          },
        ],
      },
    ],
  },
  {
    title: "parent 2-0",
    key: "1-0-0",
    icon: <SmileOutlined />,
    children: [
      {
        title: "leaf",
        key: "1-0-2-0",
      },
      {
        title: "leaf",
        key: "1-0-2-1",
      },
    ],
  },
];

const TreeView: React.FC = () => {
  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  return (
    <Tree
      //   showLine
      switcherIcon={<DownOutlined />}
      onSelect={onSelect}
      treeData={treeData}
      style={{ backgroundColor: "#efdbff" }}
    />
  );
};

export default TreeView;
