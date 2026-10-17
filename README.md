# container-node/render

This branch is one test of the [deploy benchmarks](https://github.com/stacktape/deploy-benchmarks): the Node.js container API, deployed with Render.
It holds only that application and the tool's configuration, so it deploys as it is.

`node branches.mjs` on `main` generates this branch from `main`'s fixtures and tool modules. Don't edit it here: change `main` and generate the branches again.

## Tool version

Hosted by Render: its native Node.js and Python runtimes on Starter instances (0.5 CPU, 512 MB). Render doesn't offer a choice of build image version.

## Files

| Path | What it is |
| --- | --- |
| `render.yaml` | The Render Blueprint |
| Everything else | The application, copied from [`fixtures/containers/node`](https://github.com/stacktape/deploy-benchmarks/blob/main/fixtures/containers/node) |

## Credentials

- `RENDER_API_KEY`: the harness creates the services, reads their URLs and build events and empties their build caches through the Render API.
- `BENCH_FORK`: the URL of your fork. Render's GitHub app must have access to it.

## Reproduce the measurement

You need Node.js 22 or newer, npm, Git and a Render account. The services run in Render's Frankfurt region, the closest to `eu-west-1`. Render deploys only from Git, so this test is the Git push test below.

## Git push test

Each run is a pair: a first push with an empty build cache, then a second push 15 minutes after the first one finished. The clock starts when `git push` returns.

1. Fork the repository with all branches: untick "Copy the main branch only".
2. Install Render's GitHub app on your fork. With `BENCH_FORK` set, `node bench.mjs setup` creates the services of `render.yaml` through the Render API, deploying this branch of your fork on every push. A Blueprint created from `render.yaml` in the Render dashboard is the same.
3. The first push of each pair starts with a "Clear build cache & deploy" of the previous commit through the Render API and waits until it is live.
4. Run the commands below. The project in `work/` has the same commit as this branch, so its pushes continue your fork's branch.

```sh
git clone https://github.com/stacktape/deploy-benchmarks && cd deploy-benchmarks
npm ci
export BENCH_FORK=https://github.com/<you>/deploy-benchmarks   # setup adds it as the project's origin
node bench.mjs setup render container-node                     # write the project to work/ and check the deployed service
node bench.mjs push render container-node --runs 10
node report.mjs
```

## Expected result

Each run appends one JSON line to `results/package.jsonl` or `results/deploy.jsonl`. Times are in milliseconds and sizes in bytes. Every line also records the tool version, the machine and the command log.

```js
{ "app": "container-node", "tool": "render", "journey": "git-cold", "run": 1, "change": "handlers", "changedTargets": 1, "readyMs": <time until the new code answers>, "coldReset": "scripted", "build": <build records from the platform>, "businessOk": true, "unchangedOk": true }
{ "app": "container-node", "tool": "render", "journey": "git-warm", "run": 1, "change": "handlers", "changedTargets": 1, "readyMs": <time until the new code answers>, "build": <build records from the platform>, "businessOk": true, "unchangedOk": true }
```

`node report.mjs` prints the median with the fastest and slowest run of each series. Runs whose business check failed are listed and left out.

## Results

Pending. The results will be published in the [main README](https://github.com/stacktape/deploy-benchmarks#results) after the measurement runs on a dedicated EC2 machine.
