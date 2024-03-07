import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private _httpService : HttpService) { }

  getTrackingNo() : Observable<any>
  {
    const URL = `Sales/GetTrackingNo`;
    return this._httpService.get(URL);
  }
  getCustomerName(customerCode) : Observable<any>
  {
    return this._httpService.get(`Sales/GetCustomerName?customerCode=${customerCode}`);
  }

  getContiMaterialNo(sales, dist, customer)
  {
    return this._httpService.get(`Sales/GetContiMaterialNo?Sales=${sales}&dist=${dist}&customer=${customer}`);
  }

  getMaterial(materialNo, customerCode, sales, dist) : Observable<any>
  {
    return this._httpService.get(`Sales/GetMaterialNo?materialNo=${materialNo}&customerCode=${customerCode}&sales=${sales}&dist=${dist}`);
  }

  getPlant(materialNo) : Observable<any>
  {
    return this._httpService.get(`Sales/GetPlant?materialNo=${materialNo}`);
  }

  saveCustomerMaterial(formData) : Observable<any>
  {
    return this._httpService.postFile(`Sales/SaveCustomerMaterial`, formData);
  }


  getCustomerDetails(userId) : Observable<any>
  {
    return this._httpService.get(`Sales/GetCustomerDetails?userId=${userId}`);
  }

  getApproveCustomerDetails(trackingNo) : Observable<any>
  {
    return this._httpService.get(`Sales/GetCUstomerMaterialDetails?trackingNo=${trackingNo}`);
  }

  GetApprovalDocument(trackingNo) : Observable<any>
  {
    return this._httpService.get(`Sales/GetApprovalDocument?trackingNo=${trackingNo}`);
  }

  getApprovers(trackingNo) : Observable<any>
  {
    return this._httpService.get(`Sales/GetApprovers?trackingNo=${trackingNo}`);
  }

  approveCustomerDetails(trackingNo, userId, comments) : Observable<any>
  {
    return this._httpService.get(`Sales/ApproveCustomerTracking?trackingNo=${trackingNo}&userId=${userId}&comments=${comments}`);
  }

  rejectCustomerDetails(trackingNo, userId, comments) : Observable<any>
  {
    return this._httpService.delete(`Sales/RejectCustomerTracking?trackingNo=${trackingNo}&userId=${userId}&comments=${comments}`);
  }

  UpdateConditionRecNo(trackingNo, conditionRecNo, userId, comments) : Observable<any>
  {
    return this._httpService.get(`Sales/UpdateConditionRecNo?trackingNo=${trackingNo}&conditionRecNo=${conditionRecNo}&userId=${userId}&comments=${comments}`)
  }

  downloadFinalExcel(trackingNos) : Observable<any>
  {
    return this._httpService.post(`Sales/DownloadExcel`, trackingNos);
  }

}
