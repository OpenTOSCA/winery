# Expose signing/ecnryption functionalities as REST endpoints

When secure CSAR is exported the actual encryption/signing need to take place.
This functionality might be exposed as REST endpoints for a 3rd party use.

## Considered Options

* [A] Implement encryption/signing as Winery's internal functionalities
* [B] Expose signing/encryption/decryption/verification REST endpoints

## Decision Outcome

Chosen option: [B], because OpenTOSCA Container requires this functionality.

## Pros and Cons of the Options

### [A] Implement encryption/signing as Winery's internal functionality

* Bad, because only Winery can access the security functionality

### [B] Expose signing/encryption/decryption/verification REST endpoints

* Good, because OpenTOSCA Container will be able to process secure CSARs

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
