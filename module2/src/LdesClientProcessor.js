import { newEngine } from '@treecg/actor-init-ldes-client';
import N3  from 'n3';
const {DataFactory} = N3;
const {namedNode} = DataFactory;

//export function sync_ldes(writer, interval) {

    try {
        let url = "https://marineregions.org/feed";
        let options = {
            "pollingInterval": 5000, // millis
            "representation": "Quads", //Object or Quads
            "requestHeaders": { // Optional request headers, useful when e.g. the endpoint requires Auth headers
                //Accept: 'application/ld+json',
                Accept: 'application/n-quads',
            },
            //"fromTime": new Date("2021-02-03T15:46:12.307Z"),
            "emitMemberOnce": true,
            //"disableSynchronization": true,
            "disableFraming": true,
            // "jsonLdContext": { //Only necessary for Object representation
            //     "@context": [
            //         "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-object-ap.jsonld",
            //         "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/persoon-basis.jsonld",
            //         "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-event-ap.jsonld",
            //         {
            //             "dcterms:isVersionOf": {
            //                 "@type": "@id"
            //             },
            //             "prov": "http://www.w3.org/ns/prov#"
            //         }
            //     ]
            // }
        };
        let LDESClient = new newEngine();
        let eventstreamSync = LDESClient.createReadStream(url, options);
        // OR if you have a previous state
        // let eventstreamSync = LDESClient.createReadStream(url, options, state);
        eventstreamSync.on('data', (member) => {
            const store = new N3.Store();
            if (options.representation) {
                if (options.representation === "Object") {
                    const memberURI = member.id;
                    console.log(memberURI);
                    const object = member.object;
                    console.log(object);
                } else if (options.representation === "Quads") {
                    /* When using Quads representation, the members adhere to the [@Treecg/types Member interface](https://github.com/TREEcg/types/blob/main/lib/Member.ts)
                        interface Member {
                            id: RDF.Term;
                            quads: Array<RDF.Quad>;
                        }
                    */
                    const memberURI = member.id.value;
                    console.log(memberURI);
                    const quads = member.quads;
                    console.log(quads);

                    for (const quad of quads) {
                        store.add(quad);
                    }

                    const writer = new N3.Writer();

                    // get versionOfs
                    for (const quad of store.match(null, namedNode('http://purl.org/dc/terms/isVersionOf'), null)) {
                        const memberId = quad.subject;
                        const subject = quad.object;
                        for (const innerQuad of store.match(memberId, null, null)) {
                            const changeType = innerQuad.graph; // TODO: will indicate create, update, delete
                            if (innerQuad.predicate.value !== 'http://purl.org/dc/terms/isVersionOf') {
                                // make query
                                const newSubject = subject;
                                const newPredicate = innerQuad.predicate;
                                const newObject = innerQuad.object;
                                writer.addQuad(newSubject, newPredicate, newObject);
                            }

                        }
                    }

                    writer.end((error, result) => {
                        const query = `INSERT DATA {${result}}`;
                        console.log(query);
                        }
                    );

                }
            } else {
                console.log(member);
            }

            // Want to pause event stream?
            eventstreamSync.pause();
        });
        eventstreamSync.on('metadata', (metadata) => {
            if (metadata.treeMetadata) console.log(metadata.treeMetadata); // follows the structure of the TREE metadata extractor (https://github.com/TREEcg/tree-metadata-extraction#extracted-metadata)
            console.log(metadata.url); // page from where metadata has been extracted
        });
        eventstreamSync.on('pause', () => {
            // Export current state, but only when paused!
            let state = eventstreamSync.exportState();
        });
        eventstreamSync.on('end', () => {
            console.log("No more data!");
        });
    } catch (e) {
        console.error(e);
    }

//}