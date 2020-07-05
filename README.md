## Description
This web extension gives users the ability to render the graph for chats. It uses [this](https://github.com/abhijithvijayan/web-extension-starter) as the boilerplate

## Libraries use
- Chart js and moment
- Rest of it pretty much vanila js, html, css

## Architecture
- The web extension call the content script which listens to mutation of the dom and add the visualize component to the tables
- Although this project does not use react, I tried to manage the related logic in a component like structure
The `VisualizeComponent` is responsible for
  - rendering visualize button, modal and chart.
  - maintaining state
- The modal shows the realtime column name in modal

## Issues
- It still need to adjust the visualize button when table position changes dyanmically

## Things to do
- Better accesibilty
- Testing
- Better UI
- Handle some edge cases
