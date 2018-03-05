# Configure the list of properties/artifacts to encrypt/sign in the policy's modal

Since artifacts and properties have to be encrypted, there is a need to identify a correct place for attaching a policy. 

## Considered Options

* [A] Configure the list of properties/artifacts to encrypt/sign in the policy's modal  
* [B] Configure properties/artifacts for encryption/signing in corresponding UI containers (Properties, Deployment Artifacts)

## Decision Outcome

Chosen option: [A], because it allows specifying all types of artifacts and properties at once.

## Pros and Cons of the Options

### [A] Configure the list of properties/artifacts to encrypt/sign in the policy's modal
**Description**: when a policy is attached to the node template, available entities (Implementation/Deployment Artifacts, Properties)
are shown and it is possible to select them using checkboxes. Based on this selection the policy template is updated.

* Good, because all entities can be specified simultaneously
* Bad, because enhanced UI is introduced only for security policies ignoring other policy types

### [B] Configure properties/artifacts for encryption/signing in corresponding UI containers
Description: for each property/ deployment artifact there's a separate checkbox allowing to select it for security policy specification. 
A modeler, after selecting the desired entities attaches a security policy to the node template which contains the selected entities. 

* Good, because modeler directly sees which deployment artifacts and properties will be encrypted/signed
* Bad, because implementation artifacts cannot be selected in topology modeler
* Bad, because separate UI elements in topology modeler are introduced only for security policies ignoring other policy types

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
