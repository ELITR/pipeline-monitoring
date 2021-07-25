## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

## Usage
Navigate to `localhost:3000/select` and traverse to the folder with the generated pipeline. You should see a graph. Nodes represent components, edges represent the connections between them. If the node is red, it's dead (it's saved PID is not present). If it's green, it's running. 

The edge color also represents if the data flow is okay or not. Recall that an edge is also represented by a log file, where all data transferred on that edge are logged to. Currently, a crude metric is used: the application keeps track of the last five modification dates of the log file. From these modifications, the average time between modifications is computed. Then, if the duration between the current time and the last modification is less than two times the average modification time, the edge is colored green, otherwise it's colored red.

The rationale behind this metric is the traffic on an edge typically comes in bursts, for example when an ASR produces an hypothesis, or when an MT translates something. The duration between bursts also heavily depends on the current audio situation: if there is a little speech, the bursts will have big delays between them, which is why the average is computed only using the last five durations. Because there can be natural pauses in the speech, the two-times multiplication factor when determining the treshold is also used.

Of course, these two constants (last X durations and the threshold multiplier) are hand-picked, can and likely will change, as the application will be deployed in real-life scenarios.