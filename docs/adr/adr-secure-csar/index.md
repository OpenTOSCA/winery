# Architectural Decision Log

The list of architectural decisions related to Cloud Service Archive (CSAR) encryption/signing.
The security of CSAR contents is one of the properties of so-called Smart Service Archive (SMAR). 
Both terms _secure CSAR_ and _SMAR_ refer to the same concept. 


<!-- adrlog -->

- [ADR-SECURE-CSAR-0000](0000-secure-entities.md) - Support encryption/signing of artifacts and properties in CSAR
- [ADR-SECURE-CSAR-0001](0001-use-policies.md) - Use policies to specify encryption/signing rules in CSAR
- [ADR-SECURE-CSAR-0002](0002-sign-whole-csar.md) - Sign the whole CSAR to ensure the integrity of security policies
- [ADR-SECURE-CSAR-0003](0003-attach-policies-to-node-templates.md) - Attach policies to node templates
- [ADR-SECURE-CSAR-0004](0004-trigger-encryption-or-signing-at-export-time.md) - Trigger encryption/signing at export time
- [ADR-SECURE-CSAR-0005](0005-differentiate-between-policy-types.md) - Differentiate between embeddable and not embeddable policies
- [ADR-SECURE-CSAR-0006](0006-store-signatures-in-dedicated-file.md) - Store signatures in a dedicated separate file
- [ADR-SECURE-CSAR-0007](0007-store-keys-in-winery.md) - Store keys in Winery
- [ADR-SECURE-CSAR-0008](0008-create-rest-endpoints.md) - Create REST endpoints for encryption/signing/decryption/verification
- [ADR-SECURE-CSAR-0009](0009-policy-attachment-ui-process.md) - Policy attachment process in the UI
- [ADR-SECURE-CSAR-0010](0010-flexible-properties-selection.md) - Add flexibility to entities' selection in the UI

<!-- adrlogstop -->
  
[back to the main page](../index.md)
