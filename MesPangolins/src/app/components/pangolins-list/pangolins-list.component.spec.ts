import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PangolinsListComponent } from './pangolins-list.component';

describe('PangolinsListComponent', () => {
  let component: PangolinsListComponent;
  let fixture: ComponentFixture<PangolinsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PangolinsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PangolinsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
