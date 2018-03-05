# Trigger security/signing when CSAR is exported

At which point in time the policies have to be enforced.
We assume that Winery is hosted in the safe environment.

## Considered Options

* [A] When the service template is saved
* [B] When the CSAR is exported

## Decision Outcome

Chosen option: [B], because it makes the modeling process more convenient and flexible.

## Pros and Cons of the Options

### [A] When the service template is saved

* Good, because immediate enforcement of policies is possible
* Bad, because the process is less flexible for a modeler 

### [B] When the CSAR is exported

* Good, because only the final version gets encrypted which reduces unnecessary modeling complexity
* Good, because several authorized parties can collaborate easier

## License

Copyright (c) 2017 Contributors to the Eclipse Foundation

See the NOTICE file(s) distributed with this work for additional
information regarding copyright ownership.

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
which is available at https://www.apache.org/licenses/LICENSE-2.0.

SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
