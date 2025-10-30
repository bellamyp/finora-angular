import { TestBed } from '@angular/core/testing';
import { App } from './app';
import {CommonModule} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, CommonModule],
      providers: [provideHttpClient()],
    }).compileComponents();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title in the template', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Check if any h1 contains the component title
    const titleH1 = Array.from(compiled.querySelectorAll('h1'))
      .find(el => el.textContent?.includes(fixture.componentInstance.title));

    expect(titleH1).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
