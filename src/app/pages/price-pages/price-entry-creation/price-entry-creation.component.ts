import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { SalesService } from '../../Services/sales.service';
import { CommonService } from '../../Services/common.service';
import { snackbarStatus } from '../../Enums/notification-snackbar';
import { TokenService } from '../../Services/token.service';
import { CustomerMaterial } from '../../Models/saveCustomerMaterial';
import { CommonSpinnerService } from '../../Services/common-spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FileSaverService } from '../../Services/file-saver.service';
import { TrackingDialogComponent } from '../tracking-dialog/tracking-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'ngx-price-entry-creation',
  templateUrl: './price-entry-creation.component.html',
  styleUrls: ['./price-entry-creation.component.scss']
})



export class PriceEntryCreationComponent {
  SalesForm: FormGroup;
  SalesPriceFormGroup: FormGroup;
  trackingNo: number;
  materialNoList: any[] = [];
  plantList: any[] = [];
  customerCodeList: any[] = [];
  files: any;
  userDetails: any;
  showExecute: boolean = false;
  showApprove: boolean = false;
  showAttachment: boolean = false;
  showDownload: boolean = false;
  showCondition: boolean = false;
  showConditionBtn: boolean = false;
  customerField: boolean = false;
  activeStepper : any [] = [];
  oldComments : string;


  salesOrganizationList = [
    {
      SalesOrganization: "B300",
      Name: "CAM Bengaluru",
    },
    {
      SalesOrganization: "GU00",
      Name: "CA Gurgaon",
    },
    {
      SalesOrganization: "BM00",
      Name: "CA Jamalpur",
    },
    {
      SalesOrganization: "BN00",
      Name: "CA Tech Center India",
    },
    {
      SalesOrganization: "BO00",
      Name: "CA Gujarat",
    },
    {
      SalesOrganization: "BQ00",
      Name: "CA Bangalore",
    },
    {
      SalesOrganization: "CR00",
      Name: "Ca Chennai",
    }
  ];

  distributionList = [
    {
      DistributionChannel: '1',
      Name: 'OEM'
    },
    {
      DistributionChannel: '2',
      Name: 'OE Spare Parts'
    },
    {
      DistributionChannel: '3',
      Name: 'IND Non-Automotive'
    },
    {
      DistributionChannel: '4',
      Name: 'Ancillary Business'
    },
    {
      DistributionChannel: '5',
      Name: 'OES After Series'
    },
    {
      DistributionChannel: '10',
      Name: 'Trading&Aftermarket'
    },
    {
      DistributionChannel: '50',
      Name: 'Intercompany'
    },
    {
      DistributionChannel: 'TP',
      Name: 'Template DCH'
    },
    {
      DistributionChannel: 'XX',
      Name: 'Common/Ref. DCH'
    }
  ];
  Plant = ['8164', '8931', '8936', '8933'];
  dataSource = new MatTableDataSource();

  Details: any[] = [];

  displayedColumns: any[] = ['Conti_Material_No', 'Customer_Material', 'Description', 'Effective_Date', 'Valid_From', 'Valid_To', 'Old_Price', 'Old_Price_Currency', 'New_Price', 'New_Price_Currency', 'Unit', 'Outlet'];




  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;


  //  ngAfterViewInit(){
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //  }

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _salesService: SalesService,
    private _commonService: CommonService,
    private _tokenService: TokenService,
    private _commonSpinner: CommonSpinnerService,
    private _activatedRoute: ActivatedRoute,
    private _datePipe: DatePipe,
    private _fileSaver: FileSaverService,
    private _router: Router,
    public _dialog: MatDialog) {

    this.dataSource = new MatTableDataSource(this.Details);

    this.SalesForm = _formBuilder.group({
      TrackingNo: '',
      DistributionChannel: ['', [Validators.required]],
      CustomerCode: '',
      CustomerName: '',
      Plant: ['', [Validators.required]],
      SalesOrganisation: '',
      ConditionRecNo: '',
      Comments: '',
    })


    this.SalesPriceFormGroup = this._formBuilder.group({
      items: this._formBuilder.array([])
    });

  }

  ngOnInit(): void {

    this.userDetails = this._tokenService.decryptToken(localStorage.getItem('SalesToken'));

    if (this.userDetails.Role == "I") {
      this.showExecute = true;
      this.showAttachment = true;
    }
    else {
      this.showApprove = true;
      this.showDownload = true;
    }

    this.addRow();

    this._activatedRoute.queryParams.subscribe({
      next: (response) => {
        if (response) {
          this.trackingNo = response.TrackingNo;
          this.SalesForm.controls.TrackingNo.patchValue(this.trackingNo);
          if (this.trackingNo) {
            this.getApproveCustomer();
            this.getApprovers();
          }
          else {
            this.SalesForm.reset();
            this.SalesPriceFormGroup.reset();
            this.getTrackingNo();
            this.showExecute = true;
            this.showAttachment = true;
            this.showApprove = false;
            this.showDownload = false;
            // this.showExecute = true;
          }
        }
      }
    })

    //  console.log(this.customerCodeList.length);


  }

  getApprovers()
  {
    this._salesService.getApprovers(this.trackingNo).subscribe({
      next : (response) => 
      {
        this.activeStepper = response;
        const comments = response
        .map(element => element.Comments)
        .filter(comment => comment)
        .join('. ');
        this.SalesForm.controls.Comments.patchValue(comments);
        this.oldComments = comments;
        console.log(response);
      }, error : (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }


  getApproveCustomer() {
    this._salesService.getApproveCustomerDetails(this.trackingNo).subscribe({
      next: (response) => {
        response.MaterialDetails.forEach(element => {
          element.EffectiveDate = this.changeDate(element.EffectiveDate);
          element.ValidTo = this.changeDate(element.ValidTo);
          element.ValidFrom = this.changeDate(element.ValidFrom);
          element.ChangedOn = this.changeDate(element.EffectiveDate);
        });
        this.SalesForm.patchValue(response.CustomerDetails);
        //this.SalesForm.controls.CustomerCode.patchValue(response.CustomerName);
        this.SalesPriceFormGroup.get('items').patchValue(response.MaterialDetails);
        this.checkApproveStatus(response.Workflows)
      }
    })
  }

  checkApproveStatus(data) {
    // console.log(data);
    data.forEach(element => {
      if (element.Owner == this.userDetails.UserId) {
        if (element.Status == "Created" || element.Status == "Approved" || element.Status == "Rejected") {
          this.showDownload = true;
          this.showAttachment = false;
          this.showExecute = false;
          this.showApprove = false;
          this.showCondition = false;
        }
        if (element.Role == "AR") {
          if (element.Status == "Approved" || element.Status == "Rejected") {
            this.showCondition = true;
            this.showConditionBtn = false;
            this.showApprove = false;
          }
          else {
            this.showCondition = true;
            this.showConditionBtn = true;
            this.showApprove = false;
            this.SalesForm.controls.ConditionRecNo.addValidators(Validators.required);
          }
        }
      }
    });
  }

  changeDate(date) {
    return this._datePipe.transform(date, "yyyy-MM-dd");
  }

  getMaterialfromTable(data) {

    if (!this.validateSalesFormControls(this.SalesForm, this._commonService)) {
      return;
    }

    this.getMaterialDetails(data);
  }


  getMaterialDetails(i) {
    this._salesService.getMaterial(this.SalesPriceFormGroup.controls.items.value[i].ContiMaterialNo, this.SalesForm.value.CustomerCode, this.SalesForm.value.SalesOrganisation, this.SalesForm.value.DistributionChannel).subscribe({
      next: (response) => {
        var array = this.SalesPriceFormGroup.get('items') as FormArray;
        array.controls[i].patchValue(response);
        //this.getPlant();
      }, error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }


  getTrackingNo() {
    this._salesService.getTrackingNo().subscribe({
      next: (response) => {
        this.SalesForm.controls.TrackingNo.patchValue(response);
      }
    })
  }


  downloadAttachment() {
    this._salesService.GetApprovalDocument(this.trackingNo).subscribe({
      next: async (data) => {
        await this._fileSaver.downloadFile(data);
        this._commonService.openSnackbar("Attachment Download Successfully", snackbarStatus.Success);
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    })
  }


  SortChange(SortState: Sort) {
    if (SortState.direction) {
      this._liveAnnouncer.announce('sorted ${SortState.direction}ending');
    }
    else {
      this._liveAnnouncer.announce('Sorted Cleared');
    }
  }

  addRow() {

    const addRow = this.SalesPriceFormGroup.get('items') as FormArray;
    var obj = this.getFormFields();
    addRow.push(obj);
    this.dataSource.data.push(obj.value);
    this.dataSource._updateChangeSubscription();
  }

  getFormFields() {
    return this._formBuilder.group({
      ContiMaterialNo: ['', Validators.required],
      CustomerPartNo: '',
      MaterialDescription: '',
      EffectiveDate: '',
      ValidFrom: '',
      ValidTo: '',
      OldPrice: '',
      OldPriceCurrency: '',
      NewPrice: '',
      NewPriceCurrency: '',
      Unit: '',
      Outlet: '',
      ChangedBy: '',
      ChangedOn: '',
      Time: ''
    })
  }


  ClickonCustomerCode() {
    if (!this.validateSalesFormControls(this.SalesForm, this._commonService)) {
      return;
    }

    this.getCustomername();
  }

  searchContiMaterial() {
    this.getContiMaterialNo();
  }


  getCustomername() {
    this._salesService.getCustomerName(this.SalesForm.value.CustomerName).subscribe({
      next: (response) => {
        //this.customerField = true;
        //this.getMaterialNo(response);
        //this.customerCodeList = response;
        this.SalesForm.controls.CustomerName.patchValue(response.CustomerName);
        this.SalesForm.controls.CustomerCode.patchValue(response.CustomerCode);
      }, error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  getContiMaterialNo() {
    this._salesService.getContiMaterialNo(this.SalesForm.value.SalesOrganisation, this.SalesForm.value.DistributionChannel, this.SalesForm.value.CustomerCode).subscribe({
      next: (response) => {
        // console.log("Conti Material No", response);
        this.materialNoList = response;
      }
    })
  }

  //  getPlant()
  //  {
  //   this._salesService.getPlant(this.SalesPriceFormGroup.controls.items.value[0].ContiMaterialNo).subscribe({
  //     next : (response) => 
  //     {
  //       this.plantList = response;
  //     }
  //   })
  //  }

  getMaterialNo(data) {
    data.forEach(element => {
      this.materialNoList.push(element.ContiMaterialNo);
    });
  }

  // File Upload Method
  onUploadFileChange(event) {
    this.files = event.target.files[0];
    this._commonService.openSnackbar("Uploaded Successfully", snackbarStatus.Success);
  }

  submit() {
    if (this.files) {

      this._commonSpinner.showSpinner();

      var customerMaterialDto = new CustomerMaterial();

      this.SalesPriceFormGroup.get('items').value.forEach(element => {
        if (element.ContiMaterialNo != null && element.ContiMaterialNo != "") {
          element.ChangedBy = this.userDetails.UserId;
          element.ChangedOn = new Date();
          element.Time = new Date().getTime();
          customerMaterialDto.MaterialDetails.push(element);
        }
      });



      if (this.SalesPriceFormGroup.get('items').value[0].ContiMaterialNo != null && this.SalesPriceFormGroup.get('items').value[0].ContiMaterialNo) {

        customerMaterialDto.CustomerDetail = this.SalesForm.value;
        customerMaterialDto.UserId = this.userDetails.UserId;

        // console.log(customerMaterialDto);

        const formData = new FormData();
        formData.append("CustomerMaterial", JSON.stringify(customerMaterialDto));
        formData.append(this.files.name, this.files, this.files.name);


        this._salesService.saveCustomerMaterial(formData).subscribe({
          next: (response) => {
            this._commonSpinner.hideSpinner();
            this._router.navigate(['/pages/price-pages/dashboard']);
            this._commonService.openSnackbar(response.Message, snackbarStatus.Success);
          }, error: (err) => {
            this._commonSpinner.hideSpinner();
            if (err == "Tracking No is already exists") {
              this.addTracking();
            }
            else {
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            }
          },
        })



      }
      else {
        this._commonService.openSnackbar("Enter Mandatory fields", snackbarStatus.Danger);
      }
    }
    else {
      this._commonService.openSnackbar("Attachment is Mandatory", snackbarStatus.Danger);
    }
  }



  approve() {
    const newComments = this.oldComments === "" ? this.SalesForm.value.Comments : this.getLatestUpdate(this.oldComments, this.SalesForm.value.Comments);
    this._commonSpinner.showSpinner();
    this._salesService.approveCustomerDetails(this.trackingNo, this.userDetails.UserId, newComments).subscribe({
      next: (response) => {
        this._commonSpinner.hideSpinner();
        this._router.navigate(['pages/price-pages/dashboard']);
        this._commonService.openSnackbar(response.Message, snackbarStatus.Success);
      }, error: (err) => {
        this._commonSpinner.hideSpinner();
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }


  reject() {
    const newComments = this.oldComments === "" ? this.SalesForm.value.Comments : this.getLatestUpdate(this.oldComments, this.SalesForm.value.Comments);
    if(newComments != "" && newComments != null)
    {
      this._commonSpinner.showSpinner();
      this._salesService.rejectCustomerDetails(this.trackingNo, this.userDetails.UserId, newComments).subscribe({
        next: (response) => {
          this._commonSpinner.hideSpinner();
          this._router.navigate(['pages/price-pages/dashboard']);
          this._commonService.openSnackbar(response.Message, snackbarStatus.Success);
        }, error: (err) => {
          this._commonSpinner.hideSpinner();
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
      })
    }
    else
    {
      this._commonService.openSnackbar("Add comments", snackbarStatus.Danger);
    }
  }


  cancel() {
    this._router.navigate(['/pages/price-pages/dashboard'])
  }


  update() {
    if (this.SalesForm.valid) {

      if (this.SalesForm.value.ConditionRecNo != 0) {
        const newComments = this.oldComments === "" ? this.SalesForm.value.Comments : this.getLatestUpdate(this.oldComments, this.SalesForm.value.Comments);
        this._commonSpinner.showSpinner();
        this._salesService.UpdateConditionRecNo(this.trackingNo, this.SalesForm.value.ConditionRecNo, this.userDetails.UserId, newComments).subscribe({
          next: (response) => {
            this._commonSpinner.hideSpinner();
            this._commonService.openSnackbar(response.Message, snackbarStatus.Success);
            this._router.navigate(['/pages/price-pages/dashboard']);
          }, error: (err) => {
            this._commonSpinner.hideSpinner();
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        })
      }
      else {
        this._commonService.openSnackbar("Condition Record No is contain more than zero", snackbarStatus.Danger);
      }

    }
    else {
      this._commonService.openSnackbar("Condition Record No is required", snackbarStatus.Danger);
      this.SalesForm.markAllAsTouched();
    }
  }



  addTracking() {
    const dialogRef = this._dialog.open(TrackingDialogComponent, {
      disableClose: true,
      backdropClass: 'userActivationDialog',
    }).afterClosed().subscribe((res) => {
      if (res == "Add") {
        this.getTrackingNo();
      }
    });
  }





  validateSalesFormControls(salesForm, commonService) {
    if (!salesForm.controls.SalesOrganisation.valid) {
      commonService.openSnackbar("Select Sales Organization", snackbarStatus.Danger);
      return false;
    }

    if (!salesForm.controls.DistributionChannel.valid) {
      commonService.openSnackbar("Select Distribution Channel", snackbarStatus.Danger);
      return false;
    }

    if (!salesForm.controls.Plant.valid) {
      commonService.openSnackbar("Enter Plant", snackbarStatus.Danger);
      return false;
    }

    if (!salesForm.controls.CustomerName.valid) {
      commonService.openSnackbar("Enter Customer", snackbarStatus.Danger);
      return false;
    }

    return true;
  }





  getLatestUpdate(oldStr: string, newStr: string): string {
    const diffIndex = oldStr.length;
    const updatedChars = newStr.substring(diffIndex);
    return updatedChars;
}




}
