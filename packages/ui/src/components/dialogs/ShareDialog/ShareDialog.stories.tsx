import { Meta, Story } from "@storybook/react";
import { ShareDialog as Component } from '../';
import { ShareDialogProps as Props } from '../types';

// Define story metadata
export default {
    title: 'dialogs/ShareDialog',
    component: Component,
} as Meta;

// Define template for enabling control over props
const Template: Story<Props> = (args) => <Component {...args} />;

// Export story
export const Default = Template.bind({});