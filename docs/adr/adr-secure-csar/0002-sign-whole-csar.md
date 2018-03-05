# Sign the whole CSAR as an additional safety measure

CSAR contains security policies specifying which artifacts and properties to encrypt/sign.
In order to ensure that policies will be enforced the whole secure CSAR has to be signed using a separate dedicated policy.  

## Considered Options

* [A] Sign using Winery's keypair
* [B] Sign using the modeler keypair 

## Decision Outcome

Chosen option: [], because .

## Pros and Cons of the Options

### [A] Sign using Winery's keypair

* Bad, because the "Winery keypair" is vague and gives no information about the signer's identity 

### [B] Sign using the modeler keypair

* Good, because identifies a modeler
* Bad (?), because signature file has to be either embedded into the .csar file or provided alongside with the CSAR

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
