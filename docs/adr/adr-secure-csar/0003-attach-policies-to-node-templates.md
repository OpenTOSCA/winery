# Attach security policies to node templates

Since artifacts and properties have to be encrypted, there is a need to identify a correct place for attaching a policy. 

## Considered Options

* [A] Attach policies to node templates
* [B] Attach policies directly to artifacts and properties

## Decision Outcome

Chosen option: [A], because it conforms to TOSCA specification and does not require extension of the schema.

## Pros and Cons of the Options

### [A] Attach policies to node templates

* Good, because less changes are needed
* Bad, because policies need to contain the list of properties/artifacts to encrypt/sign 
* Bad, because policies might be inconsistent if the list of properties/artifacts changes 

### [B] Attach policies directly to artifacts and properties

* Good, because it allows more fire-grained specification of encryption/signing rules for both artifacts and properties
* Bad, because it requires extending the TOSCA specification

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
