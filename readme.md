## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# node 17.0v likes to error during launching, this config set fixes that
set NODE_OPTIONS=--openssl-legacy-provider && npm run dev

# Build for production in the dist/ directory
npm run build
```


script.js is supposed to focus on node_modules directory, if we want to read external files, our path should begins at that node_modules dir