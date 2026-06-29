import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "active",
        "inactive",
        "success",
        "error",
        "warning",
        "info",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithDotAndLabel: Story = {
  render: () => (
    <Badge variant="active">
      <Badge.Dot />
      <Badge.Label>Online</Badge.Label>
    </Badge>
  ),
};

export const LabelOnly: Story = {
  render: () => (
    <Badge variant="active">
      <Badge.Label>Active</Badge.Label>
    </Badge>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
    >
      {(
        [
          "active",
          "inactive",
          "success",
          "error",
          "warning",
          "info",
        ] as const
      ).map((v) => (
        <Badge key={v} variant={v}>
          <Badge.Dot />
          <Badge.Label>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Badge.Label>
        </Badge>
      ))}
    </div>
  ),
};

export const WithCount: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge variant="error">
        <Badge.Count value={3} />
      </Badge>
      <Badge variant="info">
        <Badge.Count value={142} max={99} />
      </Badge>
    </div>
  ),
};

export const CountWithCustomMax: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge variant="warning">
        <Badge.Count value={5} max={3} />
      </Badge>
      <Badge variant="error">
        <Badge.Count value={2} max={3} />
      </Badge>
    </div>
  ),
};
