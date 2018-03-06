# Use one keystore for storing all keys/keypairs/certificates

Since keys/certificates for security policies are going to be stored in Winery, we need to consider the possible storage options.
We assume that Winery is run in secure environment.

## Considered Options

* [A] Store keys/certificates as-is
* [B] Use one keystore for all keys/certificates
* [C] Use separate keystores for every stored key/keypair/...

## Decision Outcome

Chosen option: [B], because security layer is not present in Winery and multiple keystores do not make storage more secure in this case.   

## Pros and Cons of the Options

### [A] Store keys/certificates as-is

* Good, because it is the simplest option to implement 
* Bad, because keys/keypairs/certificates have to be handled in a separate manner
* Bad, because keys/keypairs/certificates are stored in the file system completely unprotected

### [B] Use one keystore for all keys/certificates

* Good, because all types of keys and certificates can be stored in one password-protected place 
* Bad, because keystore still can be accessed via Winery

### [C] Use separate keystores for every stored key/keypair/...

* Good, because keys for different modelers can be stored in separate protected keystores
* Good, because credentials for keystores can be generated at publishing time and known only to publishers 
* Bad, because it makes key management more difficult

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
