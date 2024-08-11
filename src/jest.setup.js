// import { JSDOM } from 'jsdom';
// import "@testing-library/jest-dom";
const { JSDOM } =  require ('jsdom');

const dom = new JSDOM();
global.TextDecoder = dom.window.TextDecoder;