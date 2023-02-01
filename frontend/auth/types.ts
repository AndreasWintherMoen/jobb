export interface IJwtResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

export interface IUserInfo {
  sub: number;
  name: string;
  family_name: string;
  given_name: string;
  nickname: string;
  preferred_username: string;
  email: string;
  email_verified: boolean;
  picture: string;
}

export interface IProfile {
  id: number;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  online_mail: string;
  address: string;
  zip_code: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  ntnu_username: string;
  field_of_study: number;
  year: number;
  bio: string;
  positions: string[];
  special_positions: string[];
  image: string;
  started_date: string;
}
