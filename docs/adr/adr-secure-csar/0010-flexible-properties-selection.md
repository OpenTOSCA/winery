# Allow modeler selecting all properties for encryption/signing at once

In case multiple properties have to be encrypted, a modeler has to be able to select them all at once.

## Considered Options

* [A] Add a separate "Select all" checkbox in respective UI containers (properties/deployment artifacts)
* [B] Add a "Select all" for every entity type in the policy attachment modal
* [C] Add a "Select all" property in the policy type

## Decision Outcome

Chosen option: [B], because it allows flexibly select all types of entities including implementation artifacts.

## Pros and Cons of the Options

### [A] Add a separate "Select all" checkbox in respective UI containers (properties/deployment artifacts)

* Good, because modeler can directly see what is selected
* Bad, because additional UI elements on the topology modeler layer are introduced only for security policies
* Bad, because it doesn't allow to select implementation artifacts

### [B] Add a "Select all" for every entity type in the policy attachment modal

* Good, because modeler can directly see what is selected
* Good, because implementation artifacts can be selected
* Bad, because additional UI elements are introduced only for security policies

### [C] Add a "Select all" property in the policy type

* Good, because all types of entities can be specified
* Bad, because a modeler doesn't directly see the selection list

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
