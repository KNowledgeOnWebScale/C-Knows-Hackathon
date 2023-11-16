# Hackathon

## Module 1

The main goal is to define State-Aware RML (StARML?) rules that are able to produce versioned and state-labeled entities (i.e. created, updated, deleted) entities.
With the help of team 3, the produced versioned entities should be streamed into an LDES server (e.g., ldes-solid-server or VSDS-LDESServer4J) through a connector-architecture workflow.

### Prerequiresites

* Have Java and the RML mapper (v6.3.0)

Download RML mapper

```sh
wget https://github.com/RMLio/rmlmapper-java/releases/download/v6.3.0/rmlmapper-6.3.0-r371-all.jar
```

### Running mapping standalone

Run the mapper with example data

```sh
java -jar rmlmapper-6.3.0-r371-all.jar -m ./module1/mapping.ttl
```

Now you can find the generated LDES in the [file](./out-buienradar-change-observations-change.nq): `out-buienradar-change-observations-change.nq`

Running again leads to the [file](./out-buienradar-change-observations-change.nq) being empty as no new measurements are created

#### State 

If we want to start over again and remove the state, just remove it in the `/tmp` directory:

```sh
rm /tmp/kmi_sensor*
```

### Integrated Raw data to real versioned LDES ft. SDS

TODO: Arthur

## Module 2

TODO:

## Module 3

TODO:	