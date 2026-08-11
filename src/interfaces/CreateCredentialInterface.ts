export default interface CreateCredentialI {
    description: string;
    service_type: string;
    parameters: {
        credential_parameter_uuid: string;
        value: string;
    }[];
}