import { Time } from "@angular/common";

export class CustomerMaterial
{
    CustomerDetail : CustomerDetail;
    MaterialDetails : SaveMaterialDetailsDto [] = [];
    UserId : string;
}

export class CustomerDetail
{
    TrackingNo : string;
    CustomerCode : string;
    SalesOrganisation : string;
    DistributionChannel : string;
    plant : number;
    ConditionRecNo : number;
    Comments : string;
}

export class SaveMaterialDetailsDto
{
    ContiMaterialNo : string;
    CustomerPartNo : string;
    MaterialDescription : string;
    EffectiveDate : Date;
    ValidTo : Date;
    ValidFrom : Date;
    OldPrice : number;
    NewPrice : number;
    OldPriceCurrency : string;
    NewPriceCurrency : string;
    Unit : string;
    Outlet : string;
    ChnagedBy : string;
    ChangedOn : Date;
    Time : string;
}