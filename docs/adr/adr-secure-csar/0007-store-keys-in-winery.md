# Store keys in Winery

Every security policy relies on either a symmetric key or asymmetric keypair.
When exporting a secure CSAR, Winery needs to use the keys in order to sign/encrypt.
We assume that Winery runs in a secure environment.

## Considered Options

* [A] Provide keys at export time
* [B] Allow storing keys in Winery and use them at export time

## Decision Outcome

Chosen option: [B], because it is easier for a modeler in case the key is planned to be reused.

## Pros and Cons of the Options

### [A] Provide keys at export time

* Good, because there is no need to send keys to Winery
* Bad, because a modeler has to provide keys for every export procedure

### [B] Allow storing keys in Winery and use them at export time

* Good, because it is easier for the modeler
* Good because keys are not compromised since Winery runs in a secure environment
* Good, because reusing keys is easier 
* Bad, because keys need to be sent to Winery

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
