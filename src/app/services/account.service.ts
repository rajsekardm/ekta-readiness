import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

let apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public account;
  public register;
  public connection;

  public accountObserve: Observable<{
    address: string,
    chainId: string,
    network: string
  }>;
  public registerObserve: Observable<{
    status: boolean;
  }>;
  public connectionObserve: Observable<{
    status: boolean;
  }>;

  constructor(private http: HttpClient) {
    this.account = new BehaviorSubject({
      address: '',
      chainId: '',
      network: ''
    });
    this.accountObserve = this.account.asObservable();
    
    this.register = new BehaviorSubject({
      status: false
    });
    this.registerObserve = this.register.asObservable();
    
    this.connection = new BehaviorSubject({
      status: false
    });
    this.connectionObserve = this.connection.asObservable();
  }

  setAccount(data: {
    address: string,
    chainId: string,
    network: string
  }) {
    this.account.next(data);
  };

  registerStatus(registerStatus: {
    status: boolean
  }) {
    this.register.next(registerStatus);
  }
  connectionStatus(connectionStatus: {
    status: boolean
  }) {
    this.connection.next(connectionStatus);
  }

  checkRegister(wallet_address){
    wallet_address = JSON.parse(wallet_address);
    console.log("wallet_address sss",wallet_address);
    return  this.http.post(`${apiUrl}/api/v1/get-user/wallet-address`,wallet_address); 
  }
  checkEmail(email){
    return  this.http.get(`${apiUrl}/api/v1/validate-user-email/`+email); 
  }
  checkUserName(username){
    return  this.http.get(`${apiUrl}/api/v1/validate-user-username/`+username); 
  }
  getRegister(){
    return this.http.get(`${apiUrl}/api/v1/get-users`); 
  }
  addRegister(details): Observable<any>{
    console.log("check details",details);
    return this.http.post(`${apiUrl}/api/v1/add-user/`,details); 
  }

  saveWalletAddress(details){

    return this.http.post(`http://54.180.8.45:3000/api/v1/add-wallet-address-to-sheet/`,details); 
  }
}
