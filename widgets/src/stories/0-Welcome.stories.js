import React from 'react';

export default {
  title: 'Welcome',
};

export const toStorybook = () => (
  <div>
    <h3>Welcome to PDA widget Storybook</h3>
  </div>
);

toStorybook.story = {
  name: 'to Storybook',
};
