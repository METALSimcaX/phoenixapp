import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerOpertureComponent } from './drawer-operture.component';

describe('DrawerOpertureComponent', () => {
  let component: DrawerOpertureComponent;
  let fixture: ComponentFixture<DrawerOpertureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerOpertureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerOpertureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
