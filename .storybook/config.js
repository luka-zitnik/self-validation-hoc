import { configure } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.css';

function loadStories() {
  require('../src/index.stories.js');
}

configure(loadStories, module);
