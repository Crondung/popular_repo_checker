# GitHub Popular Repository Searcher

## Project Overview

This project is a Single Page Application (SPA) built with plain HTML and JavaScript. It utilizes Webpack and Babel for bundling and transpiling the code. The application interacts with GitHub's API to fetch repository data for a given repository name, which is done using the Octokit library. The found repository is then displayed and rated in relation of it's popularity.

### Project Structure

Sourcecode is located at the `src` folder, test code can be found in the `test` folder. Configuration files for tailwind, SCSS, babel and webpack are located at the project root level. Dependencies will be installed in a `node_modules` folder and on build a `dist` folder, containg the bundled application, is created.

## Prerequisites

Ensure you have Node.js and npm installed on your machine. If not, download and install [Node.js](https://nodejs.org/), which comes with npm.

## Setup and Installation

Install the project dependencies:

```bash
npm ci
```

## Running the Application

- **Development Mode**:
  Start the webpack development server:

```bash
npm run start
```

This will serve the application on `http://localhost:8080/` and automatically open it in your default web browser.

- **Production Build**:
  Build the application for production:

```bash
npm run build
```

This will create a `dist` folder containing the production-ready files.
The application is currently deployed at [popular-repo.crondung.com](http://popular-repo.crondung.com/)

## Testing

This project uses Jest for testing JavaScript code. Futhermore the jsdom testing environment is to test the functions which manipulate the DOM.
To run the unit tests, use the following command:

```bash
npm run test
```

## Assumptions

- private repositories don't need to be searched for following reasons:

  - to search a private repository you would have to expose an github acces_key
  - a private repository can't have stars

- preferred language for the application is english

## TODOs

- **improve input validation and error handling**: currently the implemented error handling awaits the octokit response. If there is an error in the response, an alert is displayed. Input should be validated (probably via a regex), before even sending the request. There is also the possibility of incomplete_results, which should be handled separately.

- **private repositories**: provide a second input where a user can input his access_key, which can then be handed to the octokit authorization property

- **localization**: display text according to the users current location and make the language selectable

- **multiple results**: the search request returns an array of items with matching repositories. Currently the first item is displayed. After getting the result, a droplist with the top results could be displayed for the user, to enable the selection of the searched repository
