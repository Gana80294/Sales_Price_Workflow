import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { SalesService } from '../../Services/sales.service';
import { CommonService } from '../../Services/common.service';
import { TokenService } from '../../Services/token.service';
import { DashboardTable } from '../../Models/dashboardTable';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { snackbarStatus } from '../../Enums/notification-snackbar';
import { CommonSpinnerService } from '../../Services/common-spinner.service';
import { FileSaverService } from '../../Services/file-saver.service';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  Details : any []= [ ];
 
  dataSource = new MatTableDataSource(this.Details);
  activeCard : number = 0;
  userDetails : any;
  tableData : any [] = [];
  dashboardTable = new DashboardTable();
  showExport : boolean  = false;
  showDownload : boolean = false;
  displayedColumns : any [] = [];
 
 
  
 
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<any>(true, []);
  
 ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
 }
 
   constructor(private spinner : NgxSpinnerService, 
               private _salesService : SalesService, 
               private _commonService : CommonService, 
               private _tokenService : TokenService, 
               private _router : Router, 
               private _commonSpinner : CommonSpinnerService, 
               private _fileSaver : FileSaverService){
    

    this.CardClicked(1);

   }



   ngOnInit() 
   {

    this.userDetails = this._tokenService.decryptToken(localStorage.getItem('SalesToken'));

    this.getCustomerDetail();


    if(this.userDetails.Role == "I")
    {
      this.displayedColumns = ['TrackingNO','Customer','Plant','Sales_Organisation','Distribution_channels','Review'];
    }
    else
    {
      this.displayedColumns = ['TrackingNO','Customer','Plant','Sales_Organisation','Distribution_channels','Status'];
    }


   }




       /** Whether the number of selected elements matches the total number of rows. */
 isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}


/** Select the Tracking Numbers */
selectTrackingNo()
{

  this.CardClicked(5);

  this.showExport = true;
  this.showDownload = true;

  this.displayedColumns = [
    'SELECET',
    'TrackingNO', 
    'Customer', 
    'Plant', 
    'Sales_Organisation', 
    'Distribution_channels', 
    'Review'
  ];

  var data = [];
  this.tableData.forEach(element => {
    if(element.Status == "Completed")
    {
      data.push(element);
    }
  });

  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
  //this.dataSource.sort = this.sort;
}



/** Download the Excel Format based on the selected Tracking Numbers */
download()
{
  if(this.selection.selected.length > 0)
  {

    this._commonSpinner.showSpinner();
    this.showExport = true;

    var selectedTrackingNo : number [] = [];
    this.selection.selected.forEach(element => {
      selectedTrackingNo.push(element.TrackingNo);
    });


    this._salesService.downloadFinalExcel(selectedTrackingNo).subscribe({
      next : async (response) => 
      {
        this._commonSpinner.hideSpinner();
        await this._fileSaver.downloadFile(response);
      },error : (err) => {
        this._commonSpinner.hideSpinner();
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })


  this.displayedColumns = [
    'TrackingNO', 
    'Customer', 
    'Plant', 
    'Sales_Organisation', 
    'Distribution_channels', 
    'Review'
  ];

  this.selection.clear();
  this.showDownload = false;

  this.dataSource = new MatTableDataSource(this.tableData);
  this.dataSource.paginator = this.paginator;
  //this.dataSource.sort = this.sort;

  }
  else
  {
    this._commonService.openSnackbar("Selected Tracking No has been Download", snackbarStatus.Warning);
  }
}

/** Cancel the Downloading */
cancelDownload()
{
  this.displayedColumns = [
    'TrackingNO', 
    'Customer', 
    'Plant', 
    'Sales_Organisation', 
    'Distribution_channels', 
    'Review'
  ];

  this.CardClicked(1);

  this.selection.clear();
  this.showDownload = false;
  this.dataSource = new MatTableDataSource(this.tableData);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}



approve(element)
{
  this._router.navigate(['pages/price-pages/price-entry'], { queryParams : { TrackingNo : element.TrackingNo } });
}



CardClicked(cardnumber : number){
this.activeCard = cardnumber;
}




review(data)
{
  this._router.navigate(['/pages/price-pages/price-entry'], { queryParams : { TrackingNo : data.TrackingNo } });
}



getCustomerDetail()
{
  this._salesService.getCustomerDetails(this.userDetails.UserId).subscribe({
    next : (response) => 
    {
      this.tableData = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.getCount(this.tableData);
    },error : (err) => {
      this._commonService.openSnackbar(err, snackbarStatus.Danger);
    },
  });
}
   
 


selectStatus(status)
{
  if(status == "All")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.allData);
  }
  if(status == "Pending")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.pendingData);
  }
  if(status == "Approved")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.approvedData);
  }
  if(status == "Completed")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.completedData);
  }
  if(status == "Rejected")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.rejectedData);
  }
  this.dataSource.paginator = this.paginator;
}


getCount(tableData) : void
{
    this.dashboardTable.allData = tableData;
    tableData.forEach(element => {
        if(element.Status == "Active" || element.Status == "Pending")
        {
            this.dashboardTable.pendingData.push(element);
        }
        else if(element.Status == "Approved")
        {
            this.dashboardTable.approvedData.push(element);
        }
        else if(element.Status == "Completed")
        {
            this.dashboardTable.completedData.push(element);
        }
        else if(element.Status == "Rejected")
        {
            this.dashboardTable.rejectedData.push(element);
        }
    });
   }


checkTrackingStatus(data)
{
  this._router.navigate(['/pages/price-pages/price-entry'], { queryParams : { TrackingNo : data.TrackingNo } });
}




}
