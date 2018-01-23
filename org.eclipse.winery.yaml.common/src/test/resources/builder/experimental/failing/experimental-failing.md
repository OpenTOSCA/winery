# Experimental and failing tests

## invalid-artifact_type-invalid_mime_type

- tosca.version: 1.1
- reference: 3.6.4.2

This test contains an invalid mime type, that is currently not recognized as such.

**mime_type:** must be provided as an optional Multipurpose Internet Mail Extensions (MIME) standard string value.

## invalid-constraints-data_types-properties-constraints-invalid_type

- tosca.version: 1.1
- reference: 3.5.8.5

Constraints of a property definition SHALL be type-compatible with the type defined for that definition.
However, such type mismatches are not yet detected.

## invalid-description-type_of_map

- tosca.version: 1.1
- reference: 3.5.1

The description field only allows values of type string.

Grammar:

`description: <string>`

The provided value is of the form: 

```yaml
description:
  <key>:<value>
``` 
 
 This type mismatch is not yet caught by the validator.

## invalid-metadata-value_of_type_map

- tosca.version: 1.1
- reference: 3.9.1

This test contains metadata where the map value does not equal a string as required by the spec.

Metadata should be provided as a map of strings, i.e. <key>:<value> pairs.

Grammar:

```yaml
metadata:
  <key><value>
```

The provided value is of the form:

```yaml
metadata:
  <key>:
    <key>:<value>
```

This type mismatch is currently not handled by the validator.

## valid-data_types

- tosca.version: 1.1
- reference: 3.6.6

Data type dt2 should have the same property (prop1) as data type dt1.
However, it appears that prop1 is missing in dt2.

## invalid-data_type-missing_property_def_and_derived_from

- tosca.version: 1.1
- reference: 3.6.6.3

This test is missing both a valid derived_from declaration as well as at least one valid property definition.
According to the spec; a valid datatype definition MUST have either a valid derived_from declaration or at least one valid property definition.

This test should cause an exception to be thrown instead it is accepted as a valid datatype.

## invalid-data_type-missing_property_definition

- tosca.version: 1.1
- reference: 3.6.6.3

This test provides the properties keyname but no valid property definition.

The spec states: If a properties keyname is provided, it SHALL contain one or more valid property definitions.

This test should cause an exception but none is thrown.

## invalid-artifact_definition-node_type-missing_artifact_file

- tosca.version: 1.1
- reference: 3.5.6

According to the spec a valid artifact definition requires the type to be defined.

A missing type should cause an exception to be thrown, but nothing gets thrown.

## invalid-artifact_definition-node_type-missing_artifact_file

- tosca.version: 1.1
- reference: 3.5.6

According to the spec a valid artifact definition requires the file to be defined.

A missing file should cause an exception to be thrown, but currently causes an assertion error.

## invalid-input-wrong_value_type

- tosca.version: 1.1
- reference: 3.5.12

According to the spec, <parameter-value> represents a type-compatible value to assign to the named parameter.

```yaml
<parameter_name>:
  type: <parameter_type>
  value: <parameter_value>
 ``` 
In this test a type-incompatible value is assigned, which is not caught by the validator. Example see below:
```yaml
ipt1: 
  type: integer
  value: value
```

## invalid-input-wrong_default_type

- tosca.version: 1.1
- reference: 3.5.12.3

According to the additional requirements in the spec: 'The value provided on a parameter definition’s default keyname SHALL be type compatible 1291 with the type declared on the definition’s type keyname.'

Example for an invalid type test:
```yaml
ipt1: 
  type: integer      
  default: value
```

In this test, a type-incompatible default value is assigned, which is currently not caught by the validator.

## invalid-constraints-topology_template-input-wrong_constraint_type

- tosca.version: 1.1
- reference: 3.5.12.3

According to the spec: 'Constraints of a parameter definition SHALL be type-compatible with the type defined for that definition'.

This test contains a mismatch between types, which is not caught by the validator.

Example:

````yaml
ipt1: 
  type: integer      
  constraints:
    - greater_or_equal: value
````










  

    
