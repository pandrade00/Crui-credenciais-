import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/react-vite';

import ButtonNewCredencitial from './ButtonNewCredencitial';

const meta = {
  component: ButtonNewCredencitial,
} satisfies Meta<typeof ButtonNewCredencitial>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "onClick": fn(),
    "text": "text"
  },
};