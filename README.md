# awards-leaderboard-ui

[![Build Status][CI Badge]][CI Branch] 

This project displays a list of awards as a leaderboard widget.

## Quick start

Options for getting started:

* Clone the repo: `git clone https://github.com/Brightspace/awards-leaderboard-ui.git`.

## BSI - Unbundled

To run this solution, you will need BSI
* Clone the repo `git clone https://github.com/Brightspace/brightspace-integration.git`
* Build BSI https://github.com/Brightspace/brightspace-integration#building
* Link BSI to your local web component for `d2l-awards-leaderboard-ui` (from name in package.json) https://github.com/Brightspace/brightspace-integration#running-locally-with-a-local-web-component
* Unbundle your build so that the UI will update with changes made to code https://github.com/Brightspace/brightspace-integration#using-the-script-to-unbundle-your-build



## Dependencies

This solution is run by widget code within the LMS
* [Awards Leaderboard](https://git.dev.d2l/projects/CORE/repos/lms/browse/awards-leaderboard)

This also makes Valence API calls to Awards tool
* [Valence Awards API](https://docs.valence.desire2learn.com/res/awards.html)

## Versioning

Awards Leaderboard is maintained under [the Semantic Versioning guidelines](http://semver.org/).

To create a new version bump:
* Tag a new release in awards-leaderboard
* Ensure awards-leaderboard is no longer linked to bsi - Follow Option 2 https://github.com/Brightspace/brightspace-integration#running-locally---bundled-production-build
* Don't forget to restart IIS
* Within BSI, run the following commands:
  * `rm package-lock.json`
  * `rm -r node_modules`
  * `npm i --package-lock`
  * `npm install`
  * `npm run build`
* Ensure everything is working as expected
* Checkin the `package-lock.json` file and ensure that has picked up the correct revision for awards-leaderboard

<!-- links -->
[CI Branch]:https://travis-ci.com/Brightspace/awards-leaderboard-ui
[CI Badge]:https://travis-ci.com/Brightspace/awards-leaderboard-ui.svg?branch=master
