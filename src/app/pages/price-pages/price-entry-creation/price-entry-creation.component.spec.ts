import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceEntryCreationComponent } from './price-entry-creation.component';

describe('PriceEntryCreationComponent', () => {
  let component: PriceEntryCreationComponent;
  let fixture: ComponentFixture<PriceEntryCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceEntryCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceEntryCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
