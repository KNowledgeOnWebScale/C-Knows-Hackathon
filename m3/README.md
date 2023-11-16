# README

1. fetch connector-architecture

```bash
  git clone https://github.com/TREEcg/connector-architecture.git
```

2. Setup infrastructure

```bash
docker compose up
```

3.1 Adding pipeline modules

```bash
cd processor
git submodule add <MP1 github url>
git submodule add <MP2 github url>
git commit -am "commit message"
```

3.2 run mp1 and ingest data into MongoDB

```bash
node  runner/js-runner/bin/js-runner.js mp1_pipeline.ttl
```

3.3 run mp2 and ingest data into a RDF store

```bash
node runner/js-runner/bin/js-runner.js mp2_pipeline.ttl
```

Port mappings:

```plain
0.0.0.0:8080->8080/tcp             ldes.server
0.0.0.0:27017->27017/tcp           ldes.mongodb
1111/tcp, 0.0.0.0:8890->8890/tcp   package-virtuoso-1
```
