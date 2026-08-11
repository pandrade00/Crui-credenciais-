export default interface CredentialI {
  credential_uuid: string;
  description: string;
  service_type: string;
  active: boolean;
  provider: {
    uuid: string;
    name: string;
    service_type: string;
  };
  credential_values: Array<{
    uuid: string;
    name: string;
    value: string;
    parameter: {
      uuid: string;
      title: string;
      input_type: string;
      required: boolean;
    };
  }>;
}