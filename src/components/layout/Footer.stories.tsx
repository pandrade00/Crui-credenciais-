import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/react-vite';

import Footer from './Footer';

const meta = {
  component: Footer,
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    page: 1,
    lastPage: 3,
    setPage: fn(),
  },
};