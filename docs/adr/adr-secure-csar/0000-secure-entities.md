# Support encryption/signing of artifacts and properties in CSAR

CSAR contains: 
- the TOSCA-Metadata (stores metadata in the form of TOSCA.meta file which describes the content of CSAR)
- the Definitions directory (contains TOSCA Definitions related to the cloud application)
- in addition, other directories may be present in CSAR, e.g. containing implementation/deployment artifacts etc.
A developer should be able to encrypt/sign sensitive data in CSAR.
 
## Considered Options

* [A] Support encryption/signing of implementation/deployment artifacts 
* [B] Support encryption/signing of implementation/deployment artifacts and TOSCA entities' properties
* [C] Only support encryption/signing of the whole CSAR at once

## Decision Outcome

Chosen option: [B], because it allows a more flexible CSAR protection.

## Pros and Cons of the Options

### [A] Support encryption/signing of implementation/deployment artifacts

* Good, because CSAR developer can protect the sensitive artifacts from unauthorized access
* Good, because public parts of CSAR remain accessible by everyone
* Good, because CSAR can be shared in collaborative modeling scenarios
* Bad, because potentially sensitive data stored in properties (XML files) remain unprotected
* Bad, because implementation complexity is increased

### [B] Support encryption/signing of implementation/deployment artifacts and TOSCA entities' properties

* Good, because CSAR developer can protect the sensitive artifacts from unauthorized access
* Good, because CSAR developer can protect the sensitive properties from unauthorized access
* Good, because public parts of CSAR remain accessible by everyone
* Good, because CSAR can be shared in collaborative modeling scenarios
* Bad, because increased implementation complexity
* Bad, because specification of property security rules requires separate specification mechanism

### [C] Only support encryption/signing of the whole CSAR at once

* Good, because relatively easy to implement
* Bad, because public parts of CSAR are not accessible by everyone
* Bad, because collaborative modeling scenarios are not always possible

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
