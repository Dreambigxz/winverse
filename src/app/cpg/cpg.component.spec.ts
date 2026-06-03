import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpgComponent } from './cpg.component';

describe('CpgComponent', () => {
  let component: CpgComponent;
  let fixture: ComponentFixture<CpgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
