export default interface ProviderI {
  uuid: string;
  name: string;
  slug: string;
  service_type: string;
  services: [{
    uuid: string;
    service_type: string;
  }];
}