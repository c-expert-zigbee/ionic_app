export class Profile {
    company_name: string;
    currency: string;
    email: string;
    first_name: string;
    language: string;
    last_name: string;
    phone: string;
    region: string;
    region_id: string;
    region_name: string;
    type: string;
    user_id: string;

    constructor(){
      this.company_name = "";
      this.currency = "";
      this.email = "";
      this.first_name = "";
      this.last_name = "";
      this.phone = "";
      this.region_name = "";
      this.type = "";
      this.language = "";
      this.region = "";
      this.region_id = "";
      this.user_id = "";
    }
  }