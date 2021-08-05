import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerClosureComponent } from './drawer-closure.component';

describe('DrawerClosureComponent', () => {
  let component: DrawerClosureComponent;
  let fixture: ComponentFixture<DrawerClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerClosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
