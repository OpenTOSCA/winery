# Use policies to specify encryption/signing rules in CSAR

CSAR artifacts and properties might contain sensitive information requiring encryption/signing.
Since CSAR has to remain self-contained, a correct way to specify such rules is needed.

## Considered Options

* [A] Use TOSCA.meta file
* [B] Use policies

## Decision Outcome

Chosen option: [B], because it allows specification of encryption/signing rules for properties (partial encryption/signing).

## Pros and Cons of the Options

### [A] Use TOSCA.meta file

* Good, because allows specification of encryption/signing rules for artifacts
* Good, because signed TOSCA.meta file might be used as an additional level of verification
* Bad, because encryption/signing rules for properties cannot be specified

### [B] Use policies

* Good, because allows specification of encryption/signing rules for both artifacts and properties
* Bad, because a standardized set of security policies is needed
* Bad, because a set of decisions about the relationship between keys and policies is needed (e.g. how to store keys)

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
