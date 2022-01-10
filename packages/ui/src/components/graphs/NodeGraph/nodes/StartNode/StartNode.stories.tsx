import { Meta, Story } from "@storybook/react";
import { StartNode as Component } from '..';
import { StartNodeProps as Props } from '../types';

// Define story metadata
export default {
    title: 'nodes/StartNode',
    component: Component,
} as Meta;

// Define template for enabling control over props
const Template: Story<Props> = (args) => <Component {...args} />;

// Export story
export const Default = Template.bind({});