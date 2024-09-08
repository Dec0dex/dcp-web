import { DOCUMENT } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SupertokensComponent } from './supertokens.component';

describe('SupertokensComponent', () => {
  let fixture;
  let component: SupertokensComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupertokensComponent],
      providers: [
        {
          provide: Renderer2,
          useValue: {
            createElement: () => document.createElement('script'),
            appendChild: () => {},
          },
        },
        { provide: DOCUMENT, useValue: document },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SupertokensComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
