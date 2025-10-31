// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_KEY_EMAIL = 'accessUserEmail';
  private USER_KEY_ID = 'accessUserId';
  private USER_KEY_COUNTRY = 'accessUserCountry';
  private USER_KEY_CONTINENT = 'accessUserContinent';

  constructor() { }

  // Store user securely
  public setUserEmail(email: string): void {
    sessionStorage.setItem(this.USER_KEY_EMAIL, email);
  }

  public setUserId(id: string): void {
    sessionStorage.setItem(this.USER_KEY_ID, id);
  }

  public setUserCountry(country: string): void {
    sessionStorage.setItem(this.USER_KEY_COUNTRY, country);
  }

  public setUserContinent(continent: string): void {
    sessionStorage.setItem(this.USER_KEY_CONTINENT, continent);
  }

  // Retrieve User Email
  public getUserEmail(): string | null {
    return sessionStorage.getItem(this.USER_KEY_EMAIL);
  }

  // Retrieve User Id
  public getUserId(): string | null {
    return sessionStorage.getItem(this.USER_KEY_ID);
  }

  // Retrieve User Country
  public getUserCountry(): string | null {
    return sessionStorage.getItem(this.USER_KEY_COUNTRY);
  }

  // Retrieve User Continent
  public getUserContinent(): string | null {
    return sessionStorage.getItem(this.USER_KEY_CONTINENT);
  }

  // Remove User Email
  public removeEmail(): void {
    sessionStorage.setItem(this.USER_KEY_EMAIL, "");
    sessionStorage.removeItem(this.USER_KEY_EMAIL);
  }

  // Remove User Id
  public removeId(): void {
    sessionStorage.setItem(this.USER_KEY_ID, "");
    sessionStorage.removeItem(this.USER_KEY_ID);
  }

  // Remove User Country
  public removeCountry(): void {
    sessionStorage.setItem(this.USER_KEY_COUNTRY, "");
    sessionStorage.removeItem(this.USER_KEY_COUNTRY);
  }

  // Remove User Continent
  public removeContinent(): void {
    sessionStorage.setItem(this.USER_KEY_CONTINENT, "");
    sessionStorage.removeItem(this.USER_KEY_CONTINENT);
  }
}