import './content.less';
import '../assets/linearicons.css';
import '../assets/bf_base.css';
import React from 'react';
import { render } from 'react-dom';
import Content from './containers/Content';

const target = document.getElementById('mount');
render(<Content />, target);
