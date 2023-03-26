<h1 align="center">ChatGPT Well-Known Plugin Finder</h1>

<p align="center">
  Checks Alexa's top 1M websites for the presence of OpenAI's new `/.well-known/ai-plugin.json` file.
</p>

<p align="center">
  <a href="https://github.com/transitive-bullshit/chatgpt-well-known-plugin-finder/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/transitive-bullshit/chatgpt-well-known-plugin-finder/actions/workflows/test.yml/badge.svg" /></a>
  <a href="https://github.com/transitive-bullshit/chatgpt-well-known-plugin-finder/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

- [Usage](#usage)
- [Results](#results)
- [License](#license)

## Usage

Download the top 1M CSV file from Alexa [here](https://s3.amazonaws.com/alexa-static/top-1m.csv.zip) or [here](https://s3-us-west-1.amazonaws.com/umbrella-static/index.html). Unzip the file to `top-1m.csv` in this directory.

```
pnpm install
npx tsx src/index.ts
```

## Results

After deduping plugins, the following OpenAI-compatible well-known AI plugins were found:

```json
[
  "slack.com",
  "klarna.com",
  "zapier.com",
  "pricerunner.se",
  "server.shop.app",
  "wolframalpha.com",
  "wolframcloud.com"
]
```

Full results can be found in `./ai-plugins-unique.json`.

This is as of March 25, 2023. I anticipate that this list will grow quickly over time.

Additional known plugins include:

```json
["api.speak.com", "x6lq6i-5001.csb.app", "datasette.io", "www.joinmilo.com"]
```

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

If you found this project interesting, please consider [sponsoring me](https://github.com/sponsors/transitive-bullshit) or <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
