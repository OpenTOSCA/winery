# Differentiate between embeddable and not embeddable policy types 

Encryption and signing policies rely on the usage of private keys. 
On the other hand policies containing public keys are safe to embed into the secure CSAR. 

## Considered Options

* [A] Treat all security policies as not embeddable
* [B] Treat only "private key" security policies as not embeddable
* [C] Allow specification which policies to embed at export time

## Decision Outcome

Chosen option: [B], because only private key information has to be secured.

## Pros and Cons of the Options

### [A] Treat all security policies as not embeddable
 
* Bad, because all policies have to be exchanged separately

### [B] Treat only "private key" security policies as not embeddable

* Good, because public key policies are directly contained in the secure CSAR
* Bad, because in collaborative scenarios "private key" policies have to exchanged separately

### [C] Allow a modeler to specify which policies to embed at export time

* Good, because of the higher flexibility of secure CSAR export
* Bad, increased modeling complexity

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
